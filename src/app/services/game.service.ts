import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// 👈 1. Import 'GetAllGamesResponse' เพิ่มเข้ามา
import {
  CreateGameResponse,
  Category,
  Game,
  GetAllGamesResponse,
  SearchResponse,
} from '../model/api.model';
import { Constants } from '../config/constants';

// 👈 2. ลบ Interface ที่ซ้ำซ้อนออกจากที่นี่

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly API_ENDPOINT: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }
 searchGames(term: string): Observable<SearchResponse> { // หรือ SearchResponse ตามที่คุณตั้งชื่อ
  // 1. ตรวจสอบว่ามีคำค้นหาจริงๆ (ไม่ใช่แค่ช่องว่าง)
  if (!term.trim()) {
    return of({ status: 'success', message: 'Empty search term', data: [] });
  }

  // --- vvvv ส่วนที่เพิ่มเข้ามา vvvv ---
  // 2. ดึง Token มาจาก localStorage
  const token = localStorage.getItem('authToken');
  // 3. สร้าง Headers สำหรับยืนยันตัวตน
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  // --- ^^^^ ส่วนที่เพิ่มเข้ามา ^^^^ ---

  // 4. สร้าง URL สำหรับค้นหา
  const searchUrl = `${this.API_ENDPOINT}/api/search`;

  // 5. ส่ง GET request พร้อมกับ Headers และ query parameter
  return this.http.get<SearchResponse>(searchUrl, {
    headers: headers, // <-- เพิ่ม Headers เข้าไปใน options
    params: { q: term }
  });
}
  /**
   * ดึงข้อมูลเกมทั้งหมด (สำหรับ Admin)
   */
  getAllGames(): Observable<GetAllGamesResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // เรียกใช้เส้นทาง GET /admin/games
    return this.http.get<GetAllGamesResponse>(
      `${this.API_ENDPOINT}/admin/games`,
      { headers }
    );
  }

  /**
   * สร้างเกมใหม่ (โค้ดเดิม)
   */
  createGame(formData: FormData): Observable<CreateGameResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<CreateGameResponse>(
      `${this.API_ENDPOINT}/admin/addgames`,
      formData,
      { headers }
    );
  }

  /**
   * ดึงข้อมูลประเภทเกมทั้งหมด (โค้ดเดิม)
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_ENDPOINT}/api/categories`);
  }

  // เพิ่มฟังก์ชันใหม่สำหรับดึงข้อมูลเกมตาม ID
  getGameById(
    gameId: number
  ): Observable<{ status: string; message: string; data: Game }> {
    return this.http.get<{ status: string; message: string; data: Game }>(
      `${this.API_ENDPOINT}/api/games/${gameId}`
    );
  }
}


