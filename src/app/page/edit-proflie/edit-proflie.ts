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

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.editForm.invalid) { return; }

    const formData = new FormData();
    formData.append('username', this.editForm.get('username')?.value);
    formData.append('email', this.editForm.get('email')?.value);

    const password = this.editForm.get('password')?.value;
    if (password) {
      formData.append('password', password);
    }

    const imageFile = this.editForm.get('imageProfile')?.value;
    if (imageFile) {
      formData.append('imageProfile', imageFile);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = "อัปเดตโปรไฟล์สำเร็จ!";
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setTimeout(() => {
          this.router.navigate(['/main']).then(() => window.location.reload());
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || "เกิดข้อผิดพลาดในการอัปเดต";
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
