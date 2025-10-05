import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { User } from '../model/api.model'; // ต้อง import User model มาใช้

/**
 * Guard นี้ทำหน้าที่ป้องกัน "หน้า login"
 * ไม่ให้ผู้ใช้ที่ล็อกอินอยู่แล้วกลับเข้ามาได้
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ตรวจสอบว่าเป็นฝั่งเบราว์เซอร์เท่านั้น
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');

    if (token && userDataString) {
      // ถ้ามี token (ล็อกอินอยู่แล้ว), จะไม่ให้อยู่ที่หน้า login
      const user: User = JSON.parse(userDataString);

      // ตรวจสอบ role แล้วส่งไปหน้าที่ถูกต้อง
      if (user.role === 'admin') {
        router.navigate(['/Mainadmin']);
      } else {
        router.navigate(['/main']);
      }
      return false; // **ไม่อนุญาต** ให้เข้าหน้า login
    } else {
      // ถ้าไม่มี token, อนุญาตให้เข้าหน้า login ได้
      return true;
    }
  }

  // สำหรับฝั่งเซิร์ฟเวอร์, อนุญาตให้เข้าถึงหน้า login ได้เสมอ
  return true;
};
