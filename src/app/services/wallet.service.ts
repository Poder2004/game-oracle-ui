import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';
import { GetProfileResponse, WalletTopUpReq, WalletTopUpRes } from '../model/api.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly API_ENDPOINT: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.API_ENDPOINT = this.constants.API_ENDPOINT;
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /** ดึงโปรไฟล์เพื่อรู้ user_id + wallet ปัจจุบัน */
  getProfile(): Observable<GetProfileResponse> {
    return this.http.get<GetProfileResponse>(`${this.API_ENDPOINT}/api/profile`, {
      headers: this.authHeaders(),
    });
  }

  /** เติมเงิน */
  topUp(body: WalletTopUpReq): Observable<WalletTopUpRes> {
    return this.http.post<WalletTopUpRes>(`${this.API_ENDPOINT}/api/wallet`, body, {
      headers: this.authHeaders(),
    });
  }
}
