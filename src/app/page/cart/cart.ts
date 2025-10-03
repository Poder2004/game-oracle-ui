import { Component, OnInit } from '@angular/core';

// --- Modules ที่จำเป็น ---
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio'; // สำหรับ Radio Button
import { FormsModule } from '@angular/forms';
import { Navber } from "../../widget/navber/navber"; // สำหรับ ngModel
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    MatToolbarModule,
    RouterModule,

    Navber
],
   templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit{

  // ข้อมูลจำลอง
  cartItems = [
    { name: 'EA SPORTS FC 26', price: 1000, image: 'assets/images/fc26.jpg' },
    { name: 'Battlefield 6', price: 200, image: 'assets/images/bf6.jpg' },
    { name: 'PUBG: BATTLEGROUNDS', price: 300, image: 'assets/images/pubg.jpg' },
  ];

  coupons = [
    { name: 'ส่วนลด ซื้อขั้นต่ำ 1000 ลด 30%', value: 300, minValue: 1000 },
    { name: 'ส่วนลด ซื้อขั้นต่ำ 500 ลด 10%', value: 50, minValue: 500 }
  ];

  // ตัวแปรสำหรับเก็บค่า
  selectedCoupon: any = null;
  subtotal = 0;
  discount = 0;
  total = 0;

  constructor() { }

  ngOnInit(): void {
    this.calculateTotals();
  }

  // ฟังก์ชันคำนวณราคาทั้งหมด
  calculateTotals(): void {
    // คำนวณราคารวม
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);

    // คำนวณส่วนลด
    if (this.selectedCoupon && this.subtotal >= this.selectedCoupon.minValue) {
      this.discount = this.selectedCoupon.value;
    } else {
      this.discount = 0;
      this.selectedCoupon = null; // รีเซ็ตถ้าเงื่อนไขไม่ถึง
    }

    // คำนวณยอดสุทธิ
    this.total = this.subtotal - this.discount;
  }

  // ฟังก์ชันสำหรับลบ item
  removeItem(itemToRemove: any): void {
    this.cartItems = this.cartItems.filter(item => item !== itemToRemove);
    this.calculateTotals(); // คำนวณใหม่ทุกครั้งที่ลบ
  }
  public isProfileOpen = false; 
  // ฟังก์ชันสำหรับสลับสถานะ (เปิด/ปิด)
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }
}