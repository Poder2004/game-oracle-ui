import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import {
  ClaimCouponResponse,
  CreateCouponPayload,
  CreateCouponResponse,
  GetAllCouponsResponse,
  GetMyCouponsResponse,
  UpdateCouponPayload,
  UpdateCouponResponse,
} from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly API_ENDPOINT: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  // สร้าง Header พร้อม Token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * ดึงข้อมูลคูปองทั้งหมด
   */
  getAllCoupons(): Observable<GetAllCouponsResponse> {
    const url = `${this.API_ENDPOINT}/admin/allcoupons`;
    return this.http.get<GetAllCouponsResponse>(url, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * สร้างคูปองใหม่
   */
  createCoupon(payload: CreateCouponPayload): Observable<CreateCouponResponse> {
    const url = `${this.API_ENDPOINT}/admin/coupons`;
    return this.http.post<CreateCouponResponse>(url, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  getMyClaimedCoupons(): Observable<GetMyCouponsResponse> {
    const url = `${this.API_ENDPOINT}/api/my-coupons`;
    return this.http.get<GetMyCouponsResponse>(url, {
      headers: this.getAuthHeaders(),
    });
  }

  claimCoupon(couponId: number): Observable<ClaimCouponResponse> {
    // POST /api/coupons/:did/claim
    const url = `${this.API_ENDPOINT}/api/coupons/${couponId}/claim`;
    return this.http.post<ClaimCouponResponse>(
      url,
      {},
      { headers: this.getAuthHeaders() }
    ); // ส่ง body ว่างๆ ไป
  }

  getMyAvailableCoupons(): Observable<GetAllCouponsResponse> {
    const url = `${this.API_ENDPOINT}/api/my-available-coupons`;
    return this.http.get<GetAllCouponsResponse>(url, {
      headers: this.getAuthHeaders(),
    });
  }

    // ฟังก์ชันสำหรับอัปเดตคูปอง
   updateCoupon(id: number, couponData: UpdateCouponPayload): Observable<UpdateCouponResponse> {
    const url = `${this.API_ENDPOINT}/admin/coupons/${id}`;
    return this.http.put<UpdateCouponResponse>(url, couponData, { headers: this.getAuthHeaders() });
  }

  // ฟังก์ชัน deleteCoupon
  deleteCoupon(id: number): Observable<void> {
    const url = `${this.API_ENDPOINT}/admin/coupons/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
