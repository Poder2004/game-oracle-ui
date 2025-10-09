import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// 👈 1. Import 'GetAllGamesResponse' เพิ่มเข้ามา
import { CreateGameResponse, Category, Game, GetAllGamesResponse } from '../model/api.model'; 
import { Constants } from '../config/constants';

// 👈 2. ลบ Interface ที่ซ้ำซ้อนออกจากที่นี่

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly API_ENDPOINT: string; 

  constructor(
    private http: HttpClient,
    private constants: Constants 
  ) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  /**
   * ดึงข้อมูลเกมทั้งหมด (สำหรับ Admin)
   */
  getAllGames(): Observable<GetAllGamesResponse> {
    const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // เรียกใช้เส้นทาง GET /admin/games
    return this.http.get<GetAllGamesResponse>(`${this.API_ENDPOINT}/admin/games`, { headers });
  }

  /**
   * สร้างเกมใหม่ (โค้ดเดิม)
   */
  createGame(formData: FormData): Observable<CreateGameResponse> {
    const token = localStorage.getItem('authToken'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<CreateGameResponse>(`${this.API_ENDPOINT}/admin/addgames`, formData, { headers });
  }

  /**
   * ดึงข้อมูลประเภทเกมทั้งหมด (โค้ดเดิม)
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_ENDPOINT}/api/categories`);
  }

  
}

