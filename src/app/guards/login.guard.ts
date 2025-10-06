// src/app/guards/login.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * Guard นี้ทำหน้าที่ป้องกัน "คนล็อกอินแล้ว" ไม่ให้เข้าหน้า Login หรือ Register ซ้ำ
 * เช่น /login, /register
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ตรวจสอบว่าเป็นฝั่งเบราว์เซอร์เท่านั้น
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');

    if (token) {
      // ถ้ามี token (ล็อกอินอยู่แล้ว) ให้ส่งผู้ใช้กลับไปที่หน้า home
      // และไม่อนุญาตให้เข้าถึงหน้านี้ (return false)
      router.navigate(['/home']);
      return false;
    } else {
      // ถ้าไม่มี token (ยังไม่ล็อกอิน) อนุญาตให้เข้าถึงหน้า login/register ได้
      return true;
    }
  }

  return true;
};