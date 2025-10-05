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
    this.registerError = null; // เคลียร์ error เก่า
    if (this.registerForm.invalid) {
      return; // ถ้าฟอร์มไม่ถูกต้อง ให้หยุดทำงาน
    }

    // Backend ของคุณไม่ได้ใช้ fullName แต่ถ้าต้องการเพิ่ม ก็แค่เพิ่มในฟอร์มและ Model
    const userData: UserRegister = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (response) => {
        // --- กรณี Register สำเร็จ ---
        console.log('Registration successful:', response);
        // สามารถแสดงข้อความ "สมัครสำเร็จ" หรือจะพาไปหน้า Login เลยก็ได้
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        this.router.navigate(['/login']); // พาไปหน้า Login
      },
      error: (err) => {
        // --- กรณี Register ล้มเหลว ---
        console.error('Registration failed:', err);
        // ตรวจสอบว่ามี error message จาก backend หรือไม่
        this.registerError = err.error?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      }
    });
    console.log(this.registerForm.value);
  }
}