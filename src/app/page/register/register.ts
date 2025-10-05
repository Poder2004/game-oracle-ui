import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRegister } from '../../model/api.model'; // Import model มาใช้

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  public hidePassword = true;
  public registerForm: FormGroup; // 1. สร้างตัวแปรสำหรับฟอร์ม
  public registerError: string | null = null; // 2. สร้างตัวแปรสำหรับเก็บ Error Message
    public imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder, // 3. Inject FormBuilder
    private authService: AuthService, // 4. Inject AuthService
    private router: Router // 5. Inject Router
  ) {
    // 6. สร้างโครงสร้างฟอร์มพร้อม validation
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]], // เพิ่ม validator สำหรับเช็ค format email
      password: ['', [Validators.required, Validators.minLength(6)]],
      imageProfile: [null] 
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // เก็บข้อมูลไฟล์ลงใน Form
      this.registerForm.patchValue({ imageProfile: file });
      this.registerForm.get('imageProfile')?.updateValueAndValidity();

      // สร้างภาพ Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

 onSubmit(): void {
    this.registerError = null;
    if (this.registerForm.invalid) {
      return;
    }

    // 1. สร้าง FormData object
    const formData = new FormData();

    // 2. นำข้อมูลแต่ละ field จากฟอร์มมาใส่ใน formData
    formData.append('username', this.registerForm.get('username')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    
    // 3. นำไฟล์มาใส่ (ถ้ามี)
    const imageFile = this.registerForm.get('imageProfile')?.value;
    if (imageFile) {
      formData.append('imageProfile', imageFile);
    }

    // 4. ส่ง formData ไปที่ Service แทน userData เดิม
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.registerError = err.error?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      }
    });
  }
}