// src/app/model/api.model.ts

// --- Interfaces สำหรับ Request Body ---

/**
 * Interface สำหรับข้อมูลที่ส่งไปตอนลงทะเบียน
 * ปรับแก้ 'passwordHash' เป็น 'password' ให้ตรงกับที่ backend รับ
 */
export interface UserRegister {
  username: string;
  password: string; // Backend รับเป็น 'password'
  email: string;
  ImageProfile?: string; // field นี้อาจจะไม่ถูกส่งไปเสมอ ทำให้เป็น optional
}

/**
 * Interface สำหรับข้อมูลที่ส่งไปตอนเข้าสู่ระบบ
 */
export interface UserLogin {
  username: string;
  password: string; // Backend รับเป็น 'password'
}


// --- Interfaces สำหรับ Response Body ---

/**
 * Interface สำหรับข้อมูล User ที่ backend ส่งกลับมา
 */
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  wallet: number;
  ImageProfile: string;
}

/**
 * Interface สำหรับข้อมูลที่ได้รับกลับมาหลังจากการ Register สำเร็จ
 */
export interface RegisterResponse {
  status: string;
  message: string;
  user_id: number;
}

/**
 * Interface สำหรับข้อมูลที่ได้รับกลับมาหลังจากการ Login สำเร็จ
 */
export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: User; // มีข้อมูล user ซ้อนอยู่ข้างใน
}

/**
 * Interface สำหรับข้อมูลโปรไฟล์ที่ได้รับกลับมาจาก endpoint /profile
 */
export interface ProfileResponse {
    status: string;
    message: string;
    user: {
        username: string;
        email: string;
    }
}