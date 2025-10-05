import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// --- Import Angular Material Modules ---
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/api.model';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-navber',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './navber.html',
  styleUrl: './navber.scss'
})
export class Navber {
  public isUserLoggedIn: boolean = false
  public currentUser: User | null = null;
  userImageUrl: string | null = null;

  navLinks = [
    { name: 'แนะนำ', path: '/home' }, // ตัวอย่าง: ลิงก์ไปหน้า home
    { name: 'อันดับเกมขายดี', path: '/top-selling' }, // ตัวอย่าง
    { name: 'เติมเงิน/ประวัติการซื้อ', path: '/addwallet' }, // <-- นี่คือลิงก์เป้าหมายของคุณ
    { name: 'ประเภทเกม', path: '/genres' } // ตัวอย่าง
  ];

  activeLink = this.navLinks[0].name;

  setActiveLink(linkName: string): void {
    this.activeLink = linkName;
    // เมื่อตัวแปร activeLink เปลี่ยนไป Angular จะอัปเดตหน้าเว็บให้เอง!
  }
  public isProfileOpen = false; // ตัวแปรควบคุมสถานะของ Sidebar (เริ่มต้นคือปิด)

  // ฟังก์ชันสำหรับสลับสถานะ (เปิด/ปิด)
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }


  constructor(
    private constants: Constants,
    private authService: AuthService,
    private router: Router
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // 2. ดึงข้อมูลผู้ใช้จาก localStorage ถ้ามี
    if (this.isUserLoggedIn) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson); // แปลง JSON string กลับเป็น Object
      }
    }

    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);

      // 4. สร้าง URL ที่สมบูรณ์
      if (this.currentUser && this.currentUser.ImageProfile) {
        // นำ Base URL ของ API มาต่อกับ Path ของรูปภาพ
        this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.ImageProfile}`;
      }
    }
  }

  // 3. สร้างฟังก์ชันสำหรับ Logout
  logout(): void {
    localStorage.removeItem('authToken'); // ลบ token
    localStorage.removeItem('currentUser'); // ลบข้อมูล user
    this.router.navigate(['/login']); // กลับไปหน้า login

    // (Optional) รีเฟรชหน้าเพื่อให้ component อัปเดตสถานะทันที
    window.location.reload();
  }
}
