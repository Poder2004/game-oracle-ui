import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- สิ่งที่ต้อง Import เพิ่ม ---
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../model/api.model'; // Import model มาใช้

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  public hidePassword = true;
  public loginForm: FormGroup; // 1. สร้างตัวแปรสำหรับฟอร์ม
  public loginError: string | null = null; // 2. สร้างตัวแปรสำหรับเก็บ Error Message

  constructor(
    private fb: FormBuilder, // 3. Inject FormBuilder
    private authService: AuthService, // 4. Inject AuthService
    private router: Router // 5. Inject Router สำหรับเปลี่ยนหน้า
  ) {
    // 6. สร้างโครงสร้างของฟอร์มพร้อม validation
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // field 'username' ต้องไม่เป็นค่าว่าง
      password: ['', [Validators.required]]  // field 'password' ต้องไม่เป็นค่าว่าง
    });
  }

  // 7. สร้างฟังก์ชันสำหรับ submit ฟอร์ม
  onSubmit(): void {
    this.loginError = null; // เคลียร์ error message เก่า
    if (this.loginForm.invalid) {
      return; // ถ้าฟอร์มไม่สมบูรณ์ ไม่ต้องทำอะไรต่อ
    }

    const credentials: UserLogin = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // --- กรณี Login สำเร็จ ---
        console.log('Login successful:', response);
        // เก็บ token
        localStorage.setItem('authToken', response.token);
        // ⭐️ เพิ่มบรรทัดนี้: เก็บข้อมูล user ทั้ง object เป็น JSON string
        localStorage.setItem('currentUser', JSON.stringify(response.user));

         if (response.user.role === 'admin') {
          // ถ้าเป็น 'admin' ให้ไปที่หน้า Mainadmin
          this.router.navigate(['/Mainadmin']);
        } else {
          // ถ้าเป็น Role อื่นๆ (เช่น 'member') ให้ไปที่หน้า main
          this.router.navigate(['/home']);
        }
      },
    });
  }
}