import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { User } from '../model/api.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      const user: User = JSON.parse(userDataString);
      // ตรวจสอบว่า role เป็น admin หรือไม่
      if (user.role === 'admin') {
        return true; // เป็น admin, อนุญาตให้เข้าถึง
      }
    }
  }

  // ถ้าไม่ใช่ admin หรือไม่มีข้อมูล ให้ส่งกลับไปหน้าหลัก
  router.navigate(['/main']);
  return false;
};
