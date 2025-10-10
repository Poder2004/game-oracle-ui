import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CreateGameResponse,
  Category,
  GetAllGamesResponse,
  GetGameResponse, // 👈 [แก้ไข] Import GetGameResponse
  SearchResponse,
  UpdateGameResponse,
} from '../model/api.model';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly API_ENDPOINT: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  /**
   * ฟังก์ชันช่วยสร้าง Header สำหรับการยืนยันตัวตน
   * (โค้ดส่วนนี้ถูกต้องแล้ว)
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  /**
   * ค้นหาเกม
   */
  searchGames(term: string): Observable<SearchResponse> {
    if (!term.trim()) {
      return of({ status: 'success', message: 'Empty search term', data: [] });
    }
    const searchUrl = `${this.API_ENDPOINT}/api/search`;
    return this.http.get<SearchResponse>(searchUrl, {
      // 👇 เรียกใช้ getAuthHeaders()
      headers: this.getAuthHeaders(),
      params: { q: term }
    });
  }

 
 //ดึงข้อมูลเกมทั้งหมด (สำหรับ Admin)
  
  getAllGames(): Observable<GetAllGamesResponse> {
    const url = `${this.API_ENDPOINT}/admin/games`;
    // 👇 เรียกใช้ getAuthHeaders()
    return this.http.get<GetAllGamesResponse>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * สร้างเกมใหม่
   */
  createGame(formData: FormData): Observable<CreateGameResponse> {
    // 💥 [แก้ไข] URL ให้ตรงกับ router ล่าสุดของคุณ
    const url = `${this.API_ENDPOINT}/admin/games`; 
    // 👇 เรียกใช้ getAuthHeaders()
    return this.http.post<CreateGameResponse>(url, formData, { headers: this.getAuthHeaders() });
  }

  /**
   * ดึงข้อมูลประเภทเกมทั้งหมด
   */
  getCategories(): Observable<Category[]> {
    const url = `${this.API_ENDPOINT}/api/categories`;
    // 💥 [แนะนำ] เส้นทางนี้อาจจะต้องมีการยืนยันตัวตนเช่นกัน
    return this.http.get<Category[]>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * ดึงข้อมูลเกมตาม ID
   */
  getGameById(gameId: number): Observable<GetGameResponse> {
    // 💥 [แก้ไข] URL ให้ตรงกับ public route ของคุณ
    const url = `${this.API_ENDPOINT}/api/games/${gameId}`; 
    // เส้นทางนี้เป็น Public ไม่ต้องใช้ Token
    return this.http.get<GetGameResponse>(url);
  }

  /**
   * อัปเดตข้อมูลเกม
   */
  updateGame(id: number, formData: FormData): Observable<UpdateGameResponse> {
    const url = `${this.API_ENDPOINT}/admin/games/${id}`;
    // 👇 โค้ดส่วนนี้ถูกต้องอยู่แล้ว
    return this.http.put<UpdateGameResponse>(url, formData, { headers: this.getAuthHeaders() });
  }

   deleteGame(id: number): Observable<Object> {
    const url = `${this.API_ENDPOINT}/admin/games/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders(), observe: 'response' });
  }
}

