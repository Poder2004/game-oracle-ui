import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * Guard นี้ทำหน้าที่ป้องกัน "หน้าที่ต้องล็อกอินก่อน"
 * เช่น /main, /mainadmin, /profile
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ตรวจสอบว่าเป็นฝั่งเบราว์เซอร์เท่านั้น เพราะ localStorage ไม่มีบนเซิร์ฟเวอร์
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');

    if (token) {
      // ถ้ามี token, อนุญาตให้เข้าถึงหน้านี้ได้
      return true;
    } else {
      // ถ้าไม่มี token, ส่งผู้ใช้กลับไปที่หน้า login
      router.navigate(['/login']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
