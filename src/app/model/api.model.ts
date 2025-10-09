// src/app/model/api.model.ts
export interface UserRegister {
  username: string;
  password: string; // Backend รับเป็น 'password'
  email: string;
  ImageProfile: string; // field นี้อาจจะไม่ถูกส่งไปเสมอ ทำให้เป็น optional
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
  image_profile: string; // 👈 [แก้ไข] เปลี่ยนจาก ImageProfile เป็น image_profile
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

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  imageProfile?: string;
  password?: string;
}

export interface GetProfileResponse {
  [x: string]: any;
  status: string;
  message: string;
  user: User;
}

/**
 * Interface สำหรับข้อมูลเกมที่ได้รับจาก API
 */
export interface Game {
  game_id: number;
  title: string;
  description: string;
  price: number;
  image_game: string;
  release_date: string; // หรือ Date
  category_id: number;
  category?: Category; // 👈 [แก้ไข] เพิ่ม property นี้เข้ามา (เป็น optional)
}

/**
 * Interface สำหรับการตอบกลับหลังจากสร้างเกมสำเร็จ
 */
export interface CreateGameResponse {
  message: string;
  data: Game;
}

/**
 * Interface สำหรับข้อมูลประเภทเกม
 */
export interface Category {
  category_id: number;
  category_name: string;
}

export interface GetAllGamesResponse {
  status: string;
  message: string;
  data: Game[];
}

/**
 * Interface สำหรับข้อมูลคูปองส่วนลด
 */
export interface DiscountCode {
  did: number;
  name_code: string;
  description: string;
  discount_value: number;
  discount_type: 'fixed' | 'percent';
  min_value: number;
  limit_usage: number;
  used_count: number;
}

/**
 * Interface สำหรับ Response การดึงคูปองทั้งหมด
 */
export interface GetAllCouponsResponse {
  status: string;
  message: string;
  data: DiscountCode[];
}

/**
 * Interface สำหรับ Response การสร้างคูปอง
 */
export interface CreateCouponResponse {
  status: string;
  message: string;
  data: DiscountCode;
}

/**
 * Interface สำหรับข้อมูลที่จะส่งไปสร้างคูปอง
 */
export interface CreateCouponPayload {
  name_code: string;
  description: string;
  discount_value: number;
  discount_type: 'fixed' | 'percent';
  min_value: number;
  limit_usage: number;
}

export interface GetAllUsersResponse {
  status: string;
  message: string;
  data: User[];
}