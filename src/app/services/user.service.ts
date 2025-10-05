// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { ProfileResponse } from '../model/api.model';

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
}