import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';

// --- Services and Models ---
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // 👈 1. Import UserService
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
  public isUserLoggedIn: boolean = false;
  public currentUser: User | null = null;
  public userImageUrl: string | null = null;
  public isProfileOpen = false;

  @Input() showCartIcon: boolean = true;

  navLinks = [
    { name: 'แนะนำ', path: '/home' },
    { name: 'อันดับเกมขายดี', path: '/topgame' },
    { name: 'เติมเงิน/ประวัติการซื้อ', path: '/addwallet' },
    { name: 'ประเภทเกม', path: '/GameType' },
  ];

  categories = [
    { id: 1, name: 'สร้างสรรค์' },
    { id: 2, name: 'แอ็กชัน' },
    { id: 3, name: 'ปกป้องอาณาจักร' },
    { id: 4, name: 'สยองขวัญ' },
    { id: 5, name: 'แข่งรถ' },
  ];

  activeLink = this.navLinks[0].name;

  constructor(
    private constants: Constants,
    private authService: AuthService,
    private router: Router,
    private gameService: GameService,
    private userService: UserService // เพิ่มตรงนี้นะ
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // โหลดข้อมูลผู้ใช้เริ่มต้นจาก localStorage เพื่อการแสดงผลที่รวดเร็ว
    if (this.isUserLoggedIn) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        this.buildUserImageUrl(); // เรียกใช้ฟังก์ชันช่วย
      }
    }
  }

  // 👇 3. [แก้ไข] ฟังก์ชันเดิมให้ฉลาดขึ้น
  toggleProfileSidebar(): void {
    // 3.1 ถ้า sidebar กำลังจะเปิด, ให้รีเฟรชข้อมูลก่อน
    if (!this.isProfileOpen) {
      this.refreshUserProfileData();
    }
    // 3.2 สลับสถานะการแสดงผล
    this.isProfileOpen = !this.isProfileOpen;
  }

  // 👇 4. [เพิ่มฟังก์ชันใหม่] สำหรับดึงข้อมูลล่าสุด
  private refreshUserProfileData(): void {
    // เรียก API getProfile จาก UserService
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response && response.user) {
          // อัปเดตข้อมูลผู้ใช้ปัจจุบัน
          this.currentUser = response.user;
          // อัปเดตข้อมูลใน localStorage ให้ตรงกัน
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          // สร้าง URL รูปภาพใหม่
          this.buildUserImageUrl();
        }
      },
      error: (err) => {
        console.error('Failed to refresh user profile:', err);
        // ถ้า Token หมดอายุ (Unauthorized), ให้ logout
        if (err.status === 401) {
          this.logout();
        }
      },
    });
  }

  // 👇 5. [เพิ่มฟังก์ชันช่วย] เพื่อลดโค้ดซ้ำซ้อน
  private buildUserImageUrl(): void {
    if (this.currentUser && this.currentUser.image_profile) {
      this.userImageUrl = `${this.constants.API_ENDPOINT}/${this.currentUser.image_profile}`;
    } else {
      this.userImageUrl = null; // หรือ 'assets/images/default-avatar.png'
    }
  }

  // --- ฟังก์ชันเดิม (ไม่ต้องแก้ไข) ---

  setActiveLink(linkName: string): void {
    this.activeLink = linkName;
  }

  public onSearch(term: string): void {
    if (term && term.trim() !== '') {
      this.router.navigate(['/SearchResults'], {
        queryParams: { q: term.trim() },
      });
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  goToCategory(c: { id: number; name: string }) {
    this.router.navigate(['/GameType'], { queryParams: { cat: c.id } });
  }
}
