import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { CreateCouponPayload, CreateCouponResponse, GetAllCouponsResponse } from '../model/api.model';


@Injectable({
  providedIn: 'root'
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
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * ดึงข้อมูลคูปองทั้งหมด
   */
  getAllCoupons(): Observable<GetAllCouponsResponse> {
    const url = `${this.API_ENDPOINT}/admin/allcoupons`;
    return this.http.get<GetAllCouponsResponse>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * สร้างคูปองใหม่
   */
  createCoupon(payload: CreateCouponPayload): Observable<CreateCouponResponse> {
    const url = `${this.API_ENDPOINT}/admin/coupons`;
    return this.http.post<CreateCouponResponse>(url, payload, { headers: this.getAuthHeaders() });
  }
}
