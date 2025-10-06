import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateGameResponse, Category } from '../model/api.model';
@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly API_URL = 'http://localhost:8080'; // URL ของ Backend API

  constructor(private http: HttpClient) { }

  /**
   * สร้างเกมใหม่โดยส่งข้อมูลแบบ FormData
   * @param formData ข้อมูลฟอร์มที่ประกอบด้วย title, description, price, category_id และไฟล์ image
   */
  createGame(formData: FormData): Observable<CreateGameResponse> {
    // ดึง token จาก localStorage (ต้องมีตอน Login)
    const token = localStorage.getItem('token');

    // สร้าง Headers เพื่อส่ง token ไปยืนยันตัวตน
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // ไม่ต้องระบุ Content-Type, Angular จะจัดการให้เองเมื่อส่ง FormData
    return this.http.post<CreateGameResponse>(`${this.API_URL}/admin/addgames`, formData, { headers });
  }

   /**
   * ดึงข้อมูลประเภทเกมทั้งหมด
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/api/categories`);
  }
}