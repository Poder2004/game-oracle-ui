import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

// --- Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

// --- Application-specific Imports ---
import { Navber } from '../../widget/navber/navber';
import { User, DiscountCode, ClaimCouponResponse } from '../../model/api.model';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatToolbarModule,
    MatDividerModule,
    Navber,
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart implements OnInit {
  // --- User and Authentication State ---
  public currentUser: User | null = null;
  public isUserLoggedIn: boolean = false;
  public isProfileOpen = false;

  // --- Cart and Coupon State ---
  cartItems: CartItem[] = [];
  availableCoupons: DiscountCode[] = [];
  loadingCoupons = true;
  selectedCoupon: DiscountCode | null = null;

  // --- Financial Totals ---
  subtotal = 0;
  discount = 0;
  total = 0;

  isCheckingOut = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private location: Location,
    private couponService: CouponService,
    private constants: Constants
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    if (this.isUserLoggedIn) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    }
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
    this.loadAvailableCoupons();
    this.calculateTotals();
  }

  loadAvailableCoupons(): void {
    this.loadingCoupons = true;
    this.couponService.getMyAvailableCoupons().subscribe({
      next: (response) => {
        this.availableCoupons = response.data || [];
        this.loadingCoupons = false;
      },
      error: (err) => {
        console.error('Failed to load available coupons', err);
        this.loadingCoupons = false;
        this.availableCoupons = [];
      },
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    this.discount = 0;

    if (this.selectedCoupon) {
      if (this.subtotal >= this.selectedCoupon.min_value) {
        if (this.selectedCoupon.discount_type === 'fixed') {
          this.discount = this.selectedCoupon.discount_value;
        } else if (this.selectedCoupon.discount_type === 'percent') {
          const discountAmount =
            (this.subtotal * this.selectedCoupon.discount_value) / 100;
          this.discount = parseFloat(discountAmount.toFixed(2));
        }
      } else {
        this.selectedCoupon = null;
      }
    }
    this.total = this.subtotal - this.discount;
  }

  removeItem(itemToRemove: CartItem): void {
    const index = this.cartItems.indexOf(itemToRemove);
    if (index > -1) {
      this.cartService.removeItem(index);
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  onCouponClick(coupon: DiscountCode): void {
    if (coupon === this.selectedCoupon) {
      setTimeout(() => {
        this.selectedCoupon = null;
        this.calculateTotals();
      }, 0);
    }
  }

  goBackToGame(): void {
    this.router.navigate(['/home']);
  }

  getFullImageUrl(path?: string): string {
    return path
      ? `${this.constants.API_ENDPOINT}/${path}`
      : 'assets/images/placeholder.png';
  }

  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire(
        'ตะกร้าว่างเปล่า',
        'กรุณาเลือกซื้อสินค้าก่อนชำระเงิน',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'ยืนยันการชำระเงิน',
      html: `ยอดชำระเงินทั้งหมดคือ <strong>${this.total.toFixed(
        2
      )} ฿</strong><br>คุณต้องการดำเนินการต่อหรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.processCheckout();
      }
    });
  }

  private processCheckout(): void {
    this.isCheckingOut = true;

    const gameIds = this.cartItems
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined);

    if (gameIds.length !== this.cartItems.length) {
      console.error('Some items in the cart are missing an ID.');
      Swal.fire(
        'เกิดข้อผิดพลาด',
        'มีสินค้าบางรายการในตะกร้าไม่มี ID ที่ถูกต้อง',
        'error'
      );
      this.isCheckingOut = false;
      return;
    }

    const payload = {
      game_ids: gameIds,
      coupon_id: this.selectedCoupon ? this.selectedCoupon.did : null,
    };

    this.cartService.checkout(payload).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'สั่งซื้อสำเร็จ!',
          text: 'ขอบคุณที่ใช้บริการ เกมของคุณถูกเพิ่มเข้าคลังแล้ว',
        }).then(() => {
          this.cartService.clear();
          this.router.navigate(['/library']);
        });
      },
      error: (err) => {
        const errorMessage =
          err.error?.error || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        Swal.fire('สั่งซื้อไม่สำเร็จ', errorMessage, 'error');
        this.isCheckingOut = false;
      },
      complete: () => {
        this.isCheckingOut = false;
      },
    });
  }
}
