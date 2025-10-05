import { Component } from '@angular/core';
import { Navber } from '../../widget/navber/navber';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Navber,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
 // ข้อมูลจำลองสำหรับส่วน "ข้อเสนอพิเศษ"
  specialOffers = [
    { name: 'Free Fire Diamonds', discount: '-4.0%', imagePlaceholder: '#4a7a96' },
    { name: 'Delta Force Global Top Up', discount: '-8.0%', imagePlaceholder: '#8c5c4a' },
    { name: 'LifeAfter Credits & Packages', discount: '-6.0%', imagePlaceholder: '#5c8c4a' },
    { name: 'Garena Speed Drifter Diamonds', discount: '-4.0%', imagePlaceholder: '#964a4a' },
    { name: 'Blood Strike Golds', discount: '-4.0%', imagePlaceholder: '#6a4a96' },
    { name: 'Identity V Echoes(Global)', discount: '-7.0%', imagePlaceholder: '#968c4a' },
  ];

   public showPromotionPopup = true; // กำหนดให้ Popup แสดงตอนเริ่มต้น

  // ฟังก์ชันสำหรับปิด Popup
  closePopup(): void {
    this.showPromotionPopup = false;
    this.router.navigate(['/register']); // พาไปหน้าสมัครสมาชิก
  }
 constructor(private router: Router) { }
}
