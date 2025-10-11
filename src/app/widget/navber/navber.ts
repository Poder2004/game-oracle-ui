import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

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
import { GameService } from '../../services/game.service';

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
    MatMenuModule,
  ],
  templateUrl: './navber.html',
  styleUrl: './navber.scss',
})
export class Navber {
  [x: string]: any;
  public isUserLoggedIn: boolean = false;
  public currentUser: User | null = null;
  userImageUrl: string | null = null;
  // กำหนดให้ค่าเริ่มต้นเป็น true (แสดงไอคอนตะกร้าเป็นปกติ)
  @Input() showCartIcon: boolean = true;
  navLinks = [
    { name: 'แนะนำ', path: '/home' }, // ตัวอย่าง: ลิงก์ไปหน้า home
    { name: 'อันดับเกมขายดี', path: '/top-selling' }, // ตัวอย่าง
    { name: 'เติมเงิน/ประวัติการซื้อ', path: '/addwallet' }, // <-- นี่คือลิงก์เป้าหมายของคุณ
    { name: 'ประเภทเกม', path: '/GameType' }, // ตัวอย่าง
  ];

  categories = [
    { id: 1, name: 'สร้างสรรค์' },
    { id: 2, name: 'แอ็กชัน' },
    { id: 3, name: 'ปกป้องอาณาจักร' },
    { id: 4, name: 'สยองขวัญ' },
    { id: 5, name: 'แข่งรถ' },
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
    private router: Router,
    private gameService: GameService
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
      if (this.currentUser && this.currentUser.image_profile) {
        // นำ Base URL ของ API มาต่อกับ Path ของรูปภาพ
        this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.image_profile}`;
      }
    }
  }
  public onSearch(term: string): void {
    if (term && term.trim() !== '') {
      // สั่งให้ Router เปลี่ยนหน้าไปที่ '/search-results' พร้อมกับส่งคำค้นหาไปด้วย
      this.router.navigate(['/SearchResults'], {
        queryParams: { q: term.trim() },
      });
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

  goToCategory(c: { id: number; name: string }) {
    // เลือกอย่างใดอย่างหนึ่ง (อันนี้ใช้ query param ปลอดภัยกับเส้นทางเดิม)
    this.router.navigate(['/GameType'], { queryParams: { cat: c.id } });
  }
}
