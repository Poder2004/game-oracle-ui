import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

// --- Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

// --- Application-specific Imports ---
import { Navber } from '../../widget/navber/navber';
import { User, DiscountCode } from '../../model/api.model';
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
  styleUrls: ['./cart.scss'], // Changed from styleUrl to styleUrls
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

  /**
   * Fetches all coupons and the user's claimed coupons, then filters to show only the ones available to the user.
   */
  loadAvailableCoupons(): void {
    this.loadingCoupons = true;
    forkJoin({
      allCouponsRes: this.couponService.getAllCoupons(),
      myCouponsRes: this.couponService.getMyClaimedCoupons(),
    }).subscribe({
      next: ({ allCouponsRes, myCouponsRes }) => {
        const allCoupons = allCouponsRes.data || [];
        const myClaimedIds = new Set(myCouponsRes.data || []);

        this.availableCoupons = allCoupons.filter((coupon) =>
          myClaimedIds.has(coupon.did)
        );
        this.loadingCoupons = false;
      },
      error: (err) => {
        console.error('Failed to load coupons', err);
        this.loadingCoupons = false;
      },
    });
  }

  /**
   * Calculates subtotal, applies coupon discount, and determines the final total.
   */
  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    this.discount = 0; // Reset discount before recalculating

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
        // Deselect coupon if subtotal is no longer sufficient
        this.selectedCoupon = null;
      }
    }

    this.total = this.subtotal - this.discount;
  }

  /**
   * Removes an item from the cart and recalculates the totals.
   */
  removeItem(itemToRemove: CartItem): void {
    const index = this.cartItems.indexOf(itemToRemove);
    if (index > -1) {
      this.cartService.removeItem(index);
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  /**
   * Navigates back to the previous page or home.
   */
  goBackToGame(): void {
    this.router.navigate(['/home']);
  }

  getFullImageUrl(path?: string): string {
    return path ? `${this.constants.API_ENDPOINT}/${path}` : '';
  }
}
