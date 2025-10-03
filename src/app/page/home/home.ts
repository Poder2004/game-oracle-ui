import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']   // ✅ ต้องเป็น styleUrls (array)
})
export class Home {
  // ข้อมูลจำลองสำหรับส่วน "ข้อเสนอพิเศษ"
  specialOffers = [
    { name: 'Free Fire Diamonds', discount: '-4.0%', imagePlaceholder: '#4a7a96' },
    { name: 'Delta Force Global Top Up', discount: '-8.0%', imagePlaceholder: '#8c5c4a' },
    { name: 'LifeAfter Credits & Packages', discount: '-6.0%', imagePlaceholder: '#5c8c4a' },
    { name: 'Garena Speed Drifter Diamonds', discount: '-4.0%', imagePlaceholder: '#964a4a' },
    { name: 'Blood Strike Golds', discount: '-4.0%', imagePlaceholder: '#6a4a96' },
    { name: 'Identity V Echoes(Global)', discount: '-7.0%', imagePlaceholder: '#968c4a' },
    { name: 'Identity V Echoes(Global)', discount: '-7.0%', imagePlaceholder: '#966d4aff' },
    { name: 'Free Fire Diamonds', discount: '-4.0%', imagePlaceholder: '#4a7a96' },
    { name: 'Delta Force Global Top Up', discount: '-8.0%', imagePlaceholder: '#8c5c4a' },
    { name: 'LifeAfter Credits & Packages', discount: '-6.0%', imagePlaceholder: '#5c8c4a' },
    { name: 'Garena Speed Drifter Diamonds', discount: '-4.0%', imagePlaceholder: '#964a4a' },
    { name: 'Blood Strike Golds', discount: '-4.0%', imagePlaceholder: '#6a4a96' },
    { name: 'Identity V Echoes(Global)', discount: '-7.0%', imagePlaceholder: '#968c4a' },
    { name: 'Identity V Echoes(Global)', discount: '-7.0%', imagePlaceholder: '#966d4aff' },
  ];

  // ✅ ข้อมูลจำลองสำหรับส่วน "คูปอง"
  coupons = [
    { discount: 'ลด 70%', details: 'สมัครสมาชิกใหม่' },
    { discount: 'ลด 50%', details: 'ลูกค้าปัจจุบัน' },
    { discount: 'ส่วนลด ฿100', details: 'เมื่อซื้อครบ ฿500' },
    { discount: 'ลด 30%', details: 'เมื่อซื้อครั้งแรกของเดือน' },
  ];

  public showPromotionPopup = true; // กำหนดให้ Popup แสดงตอนเริ่มต้น

  // ฟังก์ชันสำหรับปิด Popup
  closePopup(): void {
    this.showPromotionPopup = false;
  }

  constructor() {}
}
