// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // 👈 Import HttpHeaders
import { Observable, of } from 'rxjs';
import { Constants } from '../config/constants';
import { GetProfileResponse, ProfileResponse, User, UserUpdatePayload } from '../model/api.model'; // 👈 Import User


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

  // --- 👇 [เพิ่มฟังก์ชันนี้เข้าไปใหม่] ---
  /**
   * ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
   * @returns Observable ที่มีข้อมูลโปรไฟล์
   */
  getProfile(): Observable<GetProfileResponse> {
    const url = `${this.API_ENDPOINT}/api/profile`;
    const token = localStorage.getItem('authToken');

    if (!token) {
      // ถ้าไม่มี token ให้ return Observable ว่างๆ หรือจัดการ error
      return of({} as GetProfileResponse); 
    }

    // สร้าง Header พร้อมแนบ JWT Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // ส่ง GET request พร้อม header
    return this.http.get<GetProfileResponse>(url, { headers: headers });
  }

  // --- 👆 [สิ้นสุดฟังก์ชันที่เพิ่มเข้ามา] ---
  /**
   * อัปเดตข้อมูลโปรไฟล์ผู้ใช้
   * @param userData ข้อมูลที่ต้องการอัปเดต
   * @returns Observable ที่มีข้อมูล user ที่อัปเดตแล้ว
   */
  updateProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken'); // ดึง token ที่เก็บไว้หลัง login
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<any>(`${this.API_ENDPOINT}/api/updateprofile`, formData, { headers });
  }
}