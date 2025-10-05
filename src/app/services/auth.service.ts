// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { LoginResponse, RegisterResponse, UserLogin, UserRegister } from '../model/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 1. ประกาศตัวแปรไว้เฉยๆ โดยยังไม่กำหนดค่า
  private readonly API_ENDPOINT: string;

  constructor(
    private http: HttpClient,
    private constants: Constants
  ) {
    // 2. ย้ายการกำหนดค่ามาไว้ในนี้
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  /**
   * ฟังก์ชันสำหรับส่งข้อมูลการลงทะเบียน
   * @param userData ข้อมูลของผู้ใช้ที่ต้องการลงทะเบียน
   * @returns Observable ของ RegisterResponse
   */
  register(userData: UserRegister): Observable<RegisterResponse> {
    const url = `${this.API_ENDPOINT}/register`;
    return this.http.post<RegisterResponse>(url, userData);
  }

  /**
   * ฟังก์ชันสำหรับส่งข้อมูลการเข้าสู่ระบบ
   * @param credentials ข้อมูล username และ password
   * @returns Observable ของ LoginResponse
   */
  login(credentials: UserLogin): Observable<LoginResponse> {
    const url = `${this.API_ENDPOINT}/login`;
    return this.http.post<LoginResponse>(url, credentials);
  }
}