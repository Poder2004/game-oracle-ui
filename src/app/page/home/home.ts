// file: home.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Navber } from '../../widget/navber/navber';
import { GameService } from '../../services/game.service';
// ✅ เพิ่ม CouponService
import { CouponService } from '../../services/coupon.service';
// ✅ เพิ่ม Model ที่เกี่ยวข้องกับ Game และ Coupon
import {
  Game,
  GetAllGamesResponse,
  DiscountCode,
  GetAllCouponsResponse,
} from '../../model/api.model';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    Navber,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  // --- ตัวแปรสำหรับข้อมูลเกม (Game Data) ---
  public games: Game[] = [];
  public loadingGames = true;

  // --- ตัวแปรสำหรับข้อมูลคูปอง (Coupon Data) ---
  // ✅ 1. เพิ่มตัวแปรสำหรับคูปองจริง
  public coupons: DiscountCode[] = [];
  // ✅ 2. เพิ่มตัวแปรสถานะการโหลดคูปอง
  public loadingCoupons = true;

  public showPromotionPopup = true;

  closePopup(): void {
    this.showPromotionPopup = false;
  }

  constructor(
    private gameService: GameService,

    // ✅ 3. Inject CouponService เข้ามาใน constructor
    private couponService: CouponService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    this.getAllGames();
    // ✅ 4. เรียกใช้ฟังก์ชันดึงคูปองเมื่อ Component เริ่มทำงาน
    this.getAllCoupons();
  }

  /**
   * ดึงข้อมูลเกมทั้งหมดจาก GameService
   */
  getAllGames(): void {
    this.gameService.getAllGames().subscribe({
      next: (response: GetAllGamesResponse) => {
        if (response.data) {
          this.games = response.data;
        }
        this.loadingGames = false;
      },
      error: (error) => {
        console.error('Error fetching games:', error);
        this.loadingGames = false;
        this.games = [];
      },
    });
  }

  /**
   * ✅ 5. เพิ่มฟังก์ชันดึงข้อมูลคูปองทั้งหมดจาก CouponService
   */
  getAllCoupons(): void {
    this.couponService.getAllCoupons().subscribe({
      next: (response: GetAllCouponsResponse) => {
        // API ควรส่งข้อมูลคูปองมาใน Field ที่ชื่อว่า data
        if (response.data) {
          this.coupons = response.data;
        }
        this.loadingCoupons = false;
      },
      error: (error) => {
        console.error('Error fetching coupons:', error);
        this.loadingCoupons = false;
        this.coupons = [];
      },
    });
  }
  // 7. สร้างฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      // ถ้าไม่มี path รูปภาพ ให้ใช้ placeholder
      return 'https://placehold.co/150x75/2c2c2e/f2f2f7?text=No+Image';
    }
    // นำ URL ของ API มาต่อกับ path ของรูปภาพ
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}
