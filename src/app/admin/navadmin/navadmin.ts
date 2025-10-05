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

@Component({
  selector: 'app-navadmin',
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
  templateUrl: './navadmin.html',
  styleUrl: './navadmin.scss',
})
export class Navadmin {
   public isUserLoggedIn: boolean = false
   public currentUser: User | null = null; 

    navLinks = [
    { name: 'หน้าหลัก', path: '/Mainadmin' }, // ตัวอย่าง: ลิงก์ไปหน้า home
    { name: 'เพิ่มรายการใหม่', path: '/addgame' }, // ตัวอย่าง
    { name: 'โค้ดส่วนลด', path: '/discounts' }, // <-- นี่คือลิงก์เป้าหมายของคุณ
    { name: 'ประวัติการทำธุรกรรม', path: '/history' } // ตัวอย่าง
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
