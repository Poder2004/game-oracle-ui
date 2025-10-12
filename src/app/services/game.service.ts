import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateGameResponse,
  Category,
  CategoryListResponse,
  GetAllGamesResponse,
  GetGameResponse,
  SearchResponse,
  UpdateGameResponse,
} from '../model/api.model';
import { Constants } from '../config/constants';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly API_ENDPOINT: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  /** header ใส่โทเคน */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** ค้นหาเกม (เหลือไว้แค่อันเดียว) */
  searchGames(term: string): Observable<SearchResponse> {
    if (!term.trim()) {
      return of({ status: 'success', message: 'Empty search term', data: [] });
    }
    const searchUrl = `${this.API_ENDPOINT}/api/search`;
    return this.http.get<SearchResponse>(searchUrl, {
      headers: this.getAuthHeaders(),
      params: { q: term },
    });
  }

  /** ดึงเกมทั้งหมด (admin) */
  getAllGames(): Observable<GetAllGamesResponse> {
    const url = `${this.API_ENDPOINT}/admin/games`;
    return this.http.get<GetAllGamesResponse>(url, { headers: this.getAuthHeaders() });
  }

  /** สร้างเกมใหม่ (admin) */
  createGame(formData: FormData): Observable<CreateGameResponse> {
    const url = `${this.API_ENDPOINT}/admin/games`;
    return this.http.post<CreateGameResponse>(url, formData, { headers: this.getAuthHeaders() });
  }

  /** ดึงประเภทเกมทั้งหมด */
  getCategories(): Observable<Category[]> {
    const url = `${this.API_ENDPOINT}/api/categories`;
    return this.http
      .get<CategoryListResponse>(url, { headers: this.getAuthHeaders() })
      .pipe(map(res => res?.data ?? [] as Category[]));
  }

  /** ดึงเกมตาม id (public) */
  getGameById(gameId: number): Observable<GetGameResponse> {
    const url = `${this.API_ENDPOINT}/api/games/${gameId}`;
    return this.http.get<GetGameResponse>(url);
  }

  /** อัปเดตเกม (admin) */
  updateGame(id: number, formData: FormData): Observable<UpdateGameResponse> {
    const url = `${this.API_ENDPOINT}/admin/games/${id}`;
    return this.http.put<UpdateGameResponse>(url, formData, { headers: this.getAuthHeaders() });
  }

  /** ลบเกม (admin) */
  deleteGame(id: number): Observable<Object> {
    const url = `${this.API_ENDPOINT}/admin/games/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders(), observe: 'response' });
  }

  /** ดึงเกมตามหมวด (public) */
  getGamesByCategory(categoryId: number): Observable<SearchResponse> {
    const url = `${this.API_ENDPOINT}/api/games`;
    return this.http.get<SearchResponse>(url, {
      params: { category_id: String(categoryId) },
    });
  }

 
}
