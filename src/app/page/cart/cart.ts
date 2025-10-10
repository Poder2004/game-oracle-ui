import { Component, OnInit } from '@angular/core';

// --- Modules ที่จำเป็น ---
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio'; // สำหรับ Radio Button
import { FormsModule } from '@angular/forms';
import { Navber } from '../../widget/navber/navber'; // สำหรับ ngModel
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/api.model';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service'; // ✅ เพิ่ม
import { Location } from '@angular/common'; // ✅ เพิ่ม

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

    Navber,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  public currentUser: User | null = null;
  public isUserLoggedIn: boolean = false;

  // ✅ ใช้ของจริงจาก service
  cartItems: CartItem[] = [];

  coupons = [
    { name: 'ส่วนลด ซื้อขั้นต่ำ 1000 ลด 30%', value: 300, minValue: 1000 },
    { name: 'ส่วนลด ซื้อขั้นต่ำ 500 ลด 10%', value: 50, minValue: 500 },
  ];

  // ตัวแปรสำหรับเก็บค่า
  selectedCoupon: any = null;
  subtotal = 0;
  discount = 0;
  total = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private location: Location // ✅ เพิ่ม
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

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems(); // ✅ โหลดจาก localStorage
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
  removeItem(itemToRemove: CartItem): void {
    const idx = this.cartItems.indexOf(itemToRemove);
    if (idx > -1) {
      this.cartService.removeItem(idx);
      this.cartItems.splice(idx, 1);
      this.calculateTotals();
    }
  }

  public isProfileOpen = false;
  // ฟังก์ชันสำหรับสลับสถานะ (เปิด/ปิด)
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }
  goBackToGame(): void {
    const id = localStorage.getItem('lastGameId');
    if (id) {
      this.router.navigate(['/GameDetails', Number(id)]);
    } else {
      this.location.back();
    }
  }
}
