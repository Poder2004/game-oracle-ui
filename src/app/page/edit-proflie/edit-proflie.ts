import { Component, OnDestroy, OnInit } from '@angular/core'; // [แก้ไข] เพิ่ม OnDestroy
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs'; // [เพิ่ม] import Subscription

import { User } from '../../model/api.model';
import { UserService } from '../../services/user.service';
import { Constants } from '../../config/constants';
import { AuthService } from '../../services/auth.service'; // [แก้ไข] แก้ path import ให้ถูกต้อง

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule
  ],
  templateUrl: './edit-proflie.html',
  styleUrl: './edit-proflie.scss'
})
export class EditProfile implements OnInit, OnDestroy { // [แก้ไข] implement OnDestroy
  editForm: FormGroup;
  currentUser: User | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userImageUrl: string | null = null;

  private userSubscription!: Subscription; // [เพิ่ม] ตัวแปรสำหรับเก็บ Subscription

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private constants: Constants,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      username: [''],
      email: ['', [Validators.email]],
      password: [''],
      imageProfile: [null]
    });
  }

  ngOnInit(): void {
    // [แก้ไข] เปลี่ยนมาดึงข้อมูลจาก AuthService เพื่อให้เป็นมาตรฐานเดียวกัน
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.editForm.patchValue({
          username: this.currentUser?.username,
          email: this.currentUser?.email
        });

        if (this.currentUser?.image_profile) {
          this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.image_profile}`;
        }
      } else {
        // ถ้าไม่มี user ในระบบ ให้ redirect ไปหน้า login
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    // [เพิ่ม] ยกเลิก Subscription เพื่อป้องกัน memory leak
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editForm.patchValue({ imageProfile: file });

      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.editForm.invalid) {
      this.errorMessage = "ข้อมูลในฟอร์มไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      return;
    }

    const formData = new FormData();
    const controls = this.editForm.controls;

    // (ส่วนนี้เหมือนเดิม)
    if (controls['username'].dirty) formData.append('username', controls['username'].value);
    if (controls['email'].dirty) formData.append('email', controls['email'].value);
    const passwordControl = controls['password'];
    if (passwordControl.dirty && passwordControl.value) formData.append('password', passwordControl.value);
    const imageFile = controls['imageProfile'].value;
    if (imageFile) formData.append('imageProfile', imageFile);

    if (!formData.keys().next().value) {
      this.successMessage = "ไม่มีข้อมูลที่เปลี่ยนแปลง";
      return;
    }

    this.userService.updateProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = "อัปเดตโปรไฟล์สำเร็จ!";

        // --- 👇 [นี่คือส่วนที่แก้ไขตามคำแนะนำ!] ---
        // 1. เรียกใช้ฟังก์ชัน refreshUserProfile() จาก AuthService
        // 2. ฟังก์ชันนี้จะไปดึงข้อมูลใหม่, อัปเดต localStorage และแจ้งเตือนทุกคอมโพเนนต์เอง
        this.authService.refreshUserProfile().subscribe(() => {
          console.log('User profile has been refreshed across the app.');
          // 3. เมื่อข้อมูลอัปเดตทั่วแอปแล้ว ค่อยย้ายหน้า
          this.editForm.markAsPristine();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000); // เพิ่มเวลาเล็กน้อยให้ผู้ใช้เห็นข้อความ
        });
        // --- 👆 [สิ้นสุดส่วนที่แก้ไข] ---

      },
      error: (err) => {
        this.errorMessage = err.error?.error || "เกิดข้อผิดพลาดในการอัปเดต";
        console.error("Update profile error:", err);
      }
    });
  }

  // ส่วน toggleProfileSidebar เหมือนเดิม
  public isProfileOpen = false;
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  // [แก้ไข] เรียกใช้ logout จาก AuthService เพื่อความเป็นระเบียบ
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    // ไม่ต้อง reload หน้าเว็บอีกต่อไป
  }
}
