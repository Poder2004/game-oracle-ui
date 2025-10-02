import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// --- Import Angular Material Modules ---
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

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

    navLinks = [
    { name: 'แนะนำ', path: '/main' }, // ตัวอย่าง: ลิงก์ไปหน้า home
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


  constructor() { }
}
