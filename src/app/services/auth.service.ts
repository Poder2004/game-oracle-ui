// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Constants } from '../config/constants';
import { LoginResponse, RegisterResponse, User, UserLogin } from '../model/api.model';
import { UserService } from './user.service';
import { GetProfileResponse } from '../model/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_ENDPOINT: string;

  // BehaviorSubject จะเป็น "ศูนย์กลาง" ในการเก็บข้อมูลผู้ใช้
  // private เพื่อไม่ให้คอมโพเนนต์อื่นมาแก้ไขข้อมูลได้โดยตรง
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  // Observable สำหรับให้คอมโพเนนต์อื่น ๆ มา "ติดตาม" (subscribe) การเปลี่ยนแปลงข้อมูล
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private userService: UserService
  ) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
    // --- 👇 [แก้ไข] เรียกใช้ฟังก์ชันนี้ทันทีที่ Service ถูกสร้าง ---
    // เพื่อดึงข้อมูลผู้ใช้จาก localStorage ถ้ามี (กรณีรีเฟรชหน้า)
    this.loadInitialUser();
  }

  /**
   * ตรวจสอบสถานะการล็อกอินจาก Token ใน Local Storage
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return token != null;
  }

  /**
   * โหลดข้อมูลผู้ใช้เริ่มต้นจาก Local Storage
   * เพื่อให้สถานะล็อกอินคงอยู่แม้จะรีเฟรชหน้าเว็บ
   */
  private loadInitialUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      // ถ้ามีข้อมูล user ใน storage, ให้ส่งข้อมูลนั้นเข้าไปใน Subject
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  /**
   * ดึงข้อมูลโปรไฟล์ล่าสุดจาก API
   * และอัปเดตทั้งใน Subject และ Local Storage
   * @returns Observable ของ GetProfileResponse
   */
  public refreshUserProfile(): Observable<GetProfileResponse> {
    return this.userService.getProfile().pipe(
      tap(response => {
        if (response && response['data']) {
          const user = response['data'];
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user); // ส่งข้อมูลใหม่ให้ทุกคอมโพเนนต์ที่ subscribe อยู่
        }
      })
    );
  }

  /**
   * ส่งข้อมูลการลงทะเบียนไปยัง API
   */
  register(formData: FormData): Observable<RegisterResponse> {
    const url = `${this.API_ENDPOINT}/register`;
    return this.http.post<RegisterResponse>(url, formData);
  }

  /**
   * ส่งข้อมูลการเข้าสู่ระบบและจัดการกับ Token และข้อมูลผู้ใช้
   */
  login(credentials: UserLogin): Observable<LoginResponse> {
    const url = `${this.API_ENDPOINT}/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      // --- 👇 [แก้ไข] เพิ่ม .pipe() และ tap() เพื่อจัดการข้อมูลหลังล็อกอินสำเร็จ ---
      tap(response => {
        // ตรวจสอบว่า API ส่ง token กลับมาหรือไม่
        if (response && response.token) {
          // 1. เก็บ Token เอาไว้ใน Local Storage
          localStorage.setItem('authToken', response.token);

          // 2. สั่งให้ refreshUserProfile() ทำงานทันทีเพื่อดึงข้อมูลผู้ใช้
          //    แล้วเก็บลง Subject และ Local Storage
          this.refreshUserProfile().subscribe();
        }
      })
    );
  }

  /**
   * --- 👇 [เพิ่มฟังก์ชันนี้] ---
   * ฟังก์ชันสำหรับออกจากระบบ
   */
  logout(): void {
    // 1. ลบข้อมูลออกจาก Local Storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // 2. แจ้งให้ทุกคอมโพเนนต์ที่ติดตามอยู่ทราบว่า user ได้ logout แล้ว (โดยส่งค่า null)
    this.currentUserSubject.next(null);
  }
}
