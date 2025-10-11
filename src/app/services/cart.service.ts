import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ 1. เพิ่ม HttpClient
import { Observable } from 'rxjs'; // ✅ 2. เพิ่ม Observable
import { Constants } from '../config/constants'; // ✅ 3. เพิ่ม Constants

export interface CartItem {
  id?: number;
  name: string;
  price: number;
  image?: string;
}

// ✅ 4. เพิ่ม Interfaces สำหรับ Checkout
export interface CheckoutPayload {
  game_ids: number[];
  coupon_id?: number | null;
}

export interface CheckoutResponse {
  status: string;
  message: string;
}

const CART_KEY = 'cartItems';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API_ENDPOINT: string; // ✅ 5. เพิ่มตัวแปร

  // ✅ 6. Inject HttpClient และ Constants
  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  // ✅ 7. เพิ่มฟังก์ชันสร้าง Header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getItems(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  addItem(item: CartItem): void {
    const items = this.getItems();
    items.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  removeItem(index: number): void {
    const items = this.getItems();
    items.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  clear(): void {
    localStorage.removeItem(CART_KEY);
  }
  /**
   * ✅ 8. เพิ่มฟังก์ชัน checkout
   * ส่งข้อมูลตะกร้าและคูปองไปยัง Backend เพื่อทำการสั่งซื้อ
   */
  checkout(payload: CheckoutPayload): Observable<CheckoutResponse> {
    const url = `${this.API_ENDPOINT}/api/checkout`;
    return this.http.post<CheckoutResponse>(url, payload, {
      headers: this.getAuthHeaders(),
    });
  }
}
