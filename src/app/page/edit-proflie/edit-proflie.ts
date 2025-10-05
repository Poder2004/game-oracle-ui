import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { User } from '../../model/api.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-edit-profile', // แนะนำให้เปลี่ยน selector ให้ตรง
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
  templateUrl: './edit-proflie.html', // แนะนำให้เปลี่ยนชื่อไฟล์
  styleUrl: './edit-proflie.scss'     // แนะนำให้เปลี่ยนชื่อไฟล์
})
export class EditProfile implements OnInit { // แก้ไขชื่อ Class
  editForm: FormGroup;
  currentUser: User | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private constants: Constants
  ) {
    this.editForm = this.fb.group({
      username: [''],
      email: ['', [Validators.email]], 
      password: [''],
      imageProfile: [null]
    });
  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
      this.editForm.patchValue({
        username: this.currentUser?.username,
        email: this.currentUser?.email
      });

       // 👈 4. สร้าง URL ที่สมบูรณ์สำหรับรูปภาพปัจจุบัน
      if (this.currentUser && this.currentUser.ImageProfile) {
        this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.ImageProfile}`;
      }
    } else {
      this.router.navigate(['/login']);
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

   // 👇 แก้ไขฟังก์ชันนี้ทั้งหมด
    onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.editForm.invalid) {
      this.errorMessage = "ข้อมูลในฟอร์มไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      return;
    }

    const formData = new FormData();
    const controls = this.editForm.controls;

    if (controls['username'].dirty) {
      formData.append('username', controls['username'].value);
    }
    if (controls['email'].dirty) {
      formData.append('email', controls['email'].value);
    }
   const passwordControl = controls['password'];
    // เช็คว่า: 1. ผู้ใช้ได้แก้ไขช่องนี้จริง และ 2. มันมีค่า (ไม่เป็นค่าว่าง)
    if (passwordControl.dirty && passwordControl.value) {
      formData.append('password', passwordControl.value);
    }
    const imageFile = controls['imageProfile'].value;
    if (imageFile) {
      formData.append('imageProfile', imageFile);
    }

    // --- 👇 [ส่วนที่เพิ่มเข้ามา] Log ข้อมูลใน FormData ---
    console.log("--- DEBUG: Submitting FormData ---");
    // เราไม่สามารถ log formData ตรงๆ ได้ ต้องวนลูปดูค่าข้างใน
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    console.log("---------------------------------");
    // --- 👆 [สิ้นสุดส่วนที่เพิ่มเข้ามา] ---


    if (!formData.keys().next().value) {
      this.successMessage = "ไม่มีข้อมูลที่เปลี่ยนแปลง";
      return;
    }

    this.userService.updateProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = "อัปเดตโปรไฟล์สำเร็จ!";
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.editForm.markAsPristine();
        setTimeout(() => {
          this.router.navigate(['/main']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "เกิดข้อผิดพลาดในการอัปเดต";
        console.error("Update profile error:", err); // Log error จริงๆ ที่ได้จาก server
      }
    });
  }


    public isProfileOpen = false; 
  // ฟังก์ชันสำหรับสลับสถานะ (เปิด/ปิด)
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout(): void {
    localStorage.removeItem('authToken'); // ลบ token
    localStorage.removeItem('currentUser'); // ลบข้อมูล user
    this.router.navigate(['/login']); // กลับไปหน้า login
    
    // (Optional) รีเฟรชหน้าเพื่อให้ component อัปเดตสถานะทันที
    window.location.reload(); 
  }
}
