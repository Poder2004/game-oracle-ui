import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from '../config/constants';
import { GetAllUsersResponse, GetProfileResponse, GetUserOrdersResponse, GetUserResponse, GetWalletHistoryResponse, User } from '../model/api.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_ENDPOINT: string;

  constructor(
    private http: HttpClient,
    private constants: Constants
  ) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  // --- 👇 1. [เพิ่มฟังก์ชันนี้เข้าไปใหม่] ---
  /**
   * ฟังก์ชันช่วยสร้าง Header สำหรับการยืนยันตัวตน
   * @returns HttpHeaders ที่มี Authorization token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // --- 👆 [สิ้นสุดฟังก์ชันที่เพิ่มเข้ามา] ---

  /**
   * ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
   */
  getProfile(): Observable<GetProfileResponse> {
    const url = `${this.API_ENDPOINT}/api/profile`;
    // เรียกใช้ฟังก์ชันช่วยที่เราเพิ่งสร้าง
    return this.http.get<GetProfileResponse>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * อัปเดตข้อมูลโปรไฟล์ผู้ใช้
   */
  updateProfile(formData: FormData): Observable<any> {
    // 💥 แก้ไข URL ที่นี่ จาก /api/updateprofile เป็น /api/profile
    const url = `${this.API_ENDPOINT}/api/updateprofile`;
    // เรียกใช้ฟังก์ชันช่วยที่เราเพิ่งสร้าง
    return this.http.put<any>(url, formData, { headers: this.getAuthHeaders() });
  }

  /**
   * ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ Admin)
   */
  getAllUsers(): Observable<GetAllUsersResponse> {
    const url = `${this.API_ENDPOINT}/admin/alluser`;
    // เรียกใช้ฟังก์ชันช่วยที่เราเพิ่งสร้าง
    return this.http.get<GetAllUsersResponse>(url, { headers: this.getAuthHeaders() });
  }
 /**
   * ดึงข้อมูลผู้ใช้คนเดียวตาม ID
   */
  getUserById(id: number): Observable<GetUserResponse> {
    const url = `${this.API_ENDPOINT}/admin/users/${id}`;
    return this.http.get<GetUserResponse>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * ดึงประวัติการซื้อเกมทั้งหมดของผู้ใช้
   */
  getUserOrders(id: number): Observable<GetUserOrdersResponse> {
    const url = `${this.API_ENDPOINT}/admin/users/${id}/orders`;
    return this.http.get<GetUserOrdersResponse>(url, { headers: this.getAuthHeaders() });
  }
  
  /**
   * ดึงประวัติการเติมเงินทั้งหมดของผู้ใช้
   */
  getWalletHistory(id: number): Observable<GetWalletHistoryResponse> {
    const url = `${this.API_ENDPOINT}/admin/users/${id}/wallet-history`;
    return this.http.get<GetWalletHistoryResponse>(url, { headers: this.getAuthHeaders() });
  }
}

