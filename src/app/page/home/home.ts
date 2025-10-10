// file: home.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Navber } from '../../widget/navber/navber';
import { GameService } from '../../services/game.service';
import { CouponService } from '../../services/coupon.service';
import {
  Game,
  GetAllGamesResponse,
  DiscountCode,
  GetAllCouponsResponse,
  ClaimCouponResponse, // ✅ เพิ่ม Model สำหรับ Response การ Claim
} from '../../model/api.model';
import { Constants } from '../../config/constants';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; // ✅ 1. Import SweetAlert2
import { forkJoin } from 'rxjs'; // ✅ 2. Import forkJoin

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
    RouterModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  // --- ส่วนของ Navigation (โค้ดเดิม) ---
  navLinks = [{ name: 'GameDetails', path: '/GameDetails' }];
  activeLink = 'GameDetails';

  // --- ตัวแปรสำหรับข้อมูลเกม (Game Data) ---
  public games: Game[] = [];
  public loadingGames = true;

  // --- ตัวแปรสำหรับข้อมูลคูปอง (Coupon Data) ---
  public coupons: DiscountCode[] = [];
  public loadingCoupons = true;

  // --- ตัวแปรสำหรับจัดการสถานะ UI ---
  public claimingCouponIds = new Set<number>();
  public showPromotionPopup = true;

  constructor(
    private gameService: GameService,
    private couponService: CouponService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    this.getAllGames();
    // ✅ 3. เปลี่ยนไปเรียกฟังก์ชันใหม่ที่ตรวจสอบสถานะคูปอง
    this.loadCouponsWithClaimedStatus();
  }

  setActiveLink(name: string) {
    this.activeLink = name;
  }

  closePopup(): void {
    this.showPromotionPopup = false;
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
   * ✅ 4. สร้างฟังก์ชันใหม่สำหรับโหลดคูปองพร้อมตรวจสอบสถานะการรับ
   */
  loadCouponsWithClaimedStatus(): void {
    this.loadingCoupons = true;

    forkJoin({
      allCouponsRes: this.couponService.getAllCoupons(),
      myCouponsRes: this.couponService.getMyClaimedCoupons(),
    }).subscribe({
      next: ({ allCouponsRes, myCouponsRes }) => {
        const allCoupons = allCouponsRes.data || [];
        const myClaimedIds = new Set(myCouponsRes.data || []);

        this.coupons = allCoupons.map((coupon) => ({
          ...coupon,
          isClaimed: myClaimedIds.has(coupon.did),
        }));

        this.loadingCoupons = false;
      },
      error: (error) => {
        console.error('Error fetching coupons data:', error);
        this.loadingCoupons = false;
        this.coupons = [];
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถโหลดข้อมูลคูปองได้',
        });
      },
    });
  }

  /**
   * ✅ 5. เพิ่มฟังก์ชันสำหรับจัดการการกดรับคูปอง
   */
  claimCoupon(coupon: DiscountCode): void {
    this.claimingCouponIds.add(coupon.did);

    this.couponService.claimCoupon(coupon.did).subscribe({
      next: (response: ClaimCouponResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'รับคูปองสำเร็จ!',
          text: `คุณได้รับคูปอง ${coupon.name_code} เรียบร้อยแล้ว`,
          timer: 2500,
          showConfirmButton: false,
        });
        coupon.isClaimed = true;
      },
      error: (error) => {
        const errorMessage =
          error.error?.error || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: errorMessage,
        });
      },
      complete: () => {
        this.claimingCouponIds.delete(coupon.did);
      },
    });
  }

  /**
   * สร้างฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
   */
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'https://placehold.co/150x75/2c2c2e/f2f2f7?text=No+Image';
    }
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}
