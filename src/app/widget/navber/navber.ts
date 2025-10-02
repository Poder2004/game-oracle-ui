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

    // 1. สร้าง Array สำหรับเก็บชื่อเมนูทั้งหมด
  navLinks = [
    { name: 'แนะนำ' },
    { name: 'อันดับเกมขายดี' },
    { name: 'เติมเงิน/ประวัติการซื้อ' },
    { name: 'ประเภทเกม' }
  ];

  // 2. สร้างตัวแปรสำหรับเก็บชื่อเมนูที่ถูกเลือกอยู่ปัจจุบัน (กำหนดค่าเริ่มต้นเป็น 'แนะนำ')
  activeLink = this.navLinks[0].name;

  constructor() { }

  // 3. สร้างฟังก์ชันที่จะทำงานเมื่อมีการคลิกปุ่ม
  // ฟังก์ชันนี้จะรับชื่อเมนูที่ถูกคลิกเข้ามา แล้วอัปเดตค่า activeLink
  setActiveLink(linkName: string): void {
    this.activeLink = linkName;
    // เมื่อตัวแปร activeLink เปลี่ยนไป Angular จะอัปเดตหน้าเว็บให้เอง!
  }

}
