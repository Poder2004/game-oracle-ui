// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // 👈 Import HttpHeaders
import { Observable, of } from 'rxjs';
import { Constants } from '../config/constants';
import { ProfileResponse, User, UserUpdatePayload } from '../model/api.model'; // 👈 Import User


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // 1. ประกาศตัวแปรไว้ก่อน
  private readonly API_ENDPOINT: string;

  constructor(
    private http: HttpClient,
    private constants: Constants
  ) {
    // 2. กำหนดค่าตัวแปรภายใน constructor
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  /**
   * ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์ผู้ใช้จาก Backend
   * @param userId ID ของผู้ใช้ที่ต้องการดึงข้อมูล
   * @returns Observable ของ ProfileResponse
   */
  getProfile(userId: number): Observable<ProfileResponse> {
    const url = `${this.API_ENDPOINT}/profile`;

    // สร้าง HttpParams สำหรับส่ง user_id ไปในรูปแบบ Query String
    // จะได้ URL เป็น http://localhost:8080/profile?user_id=123
    const params = new HttpParams().set('user_id', userId.toString());

    return this.http.get<ProfileResponse>(url, { params });
  }

    // 👇 เพิ่มฟังก์ชันนี้เข้าไปใหม่
  /**
   * อัปเดตข้อมูลโปรไฟล์ผู้ใช้
   * @param userData ข้อมูลที่ต้องการอัปเดต
   * @returns Observable ที่มีข้อมูล user ที่อัปเดตแล้ว
   */
   updateProfile(formData: FormData): Observable<{ status: string, message: string, user: User }> {
    const url = `${this.API_ENDPOINT}/api/profile`;
    const token = localStorage.getItem('authToken');

    if (!token) {
      return of(); 
    }

    // เมื่อส่ง FormData ไม่ต้องกำหนด Content-Type เอง
    // เบราว์เซอร์จะจัดการให้เป็น multipart/form-data โดยอัตโนมัติ
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<{ status: string, message: string, user: User }>(url, formData, { headers: headers });
  }
}