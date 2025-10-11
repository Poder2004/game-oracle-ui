import { Component, OnInit } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Navber } from '../../widget/navber/navber';

// Services & models
import { WalletService } from '../../services/wallet.service';
import { WalletHistoryItem, WalletTopUpReq } from '../../model/api.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, // ต้องมีเพื่อเรียก HTTP
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    Navber,
  ],
  templateUrl: './add-wallet.html',
  styleUrls: ['./add-wallet.scss'], // ✅ ใช้ styleUrls (array)
})
export class AddWallet implements OnInit {
  amountControl = new FormControl('');
  dateControl = new FormControl('');

  options: string[] = ['100', '300', '500', '1000'];
  filteredOptions!: Observable<string[]>;

  // state บนหน้า
  walletBalance = 0;
  userId!: number;
  userName = '';
  userEmail = '';

  // ประวัติการเติม (UI)
  topUpHistory: { date: string; amount: number }[] = [];

  // (ตัวอย่าง) ประวัติการซื้อเกม (UI)
  purchaseHistory = [
    { name: 'Battlefield 6', date: '22 ก.ย. 68', price: 200, image: 'assets/images/bf6.jpg' },
    { name: 'PUBG: BATTLEGROUNDS', date: '22 ก.ย. 68', price: 300, image: 'assets/images/pubg.jpg' },
    { name: 'EA SPORTS FC 26', date: '22 ก.ย. 68', price: 1000, image: 'assets/images/fc26.jpg' },
  ];

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    // ตั้งค่า default = วันนี้ (YYYY-MM-DD) ให้กับ input type="date"
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.dateControl.setValue(`${yyyy}-${mm}-${dd}`);

    // autocomplete
    this.filteredOptions = this.amountControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter((value || '').toString()))
    );

    // ดึงโปรไฟล์เพื่อรู้ user_id และยอด wallet ปัจจุบัน
    this.walletService.getProfile().subscribe({
      next: (res) => {
        const u: any = (res as any).user ?? res;
        this.userId = u.user_id;
        this.walletBalance = u.wallet;
        this.userName = u.username;
        this.userEmail = u.email;
        this.loadHistory();
      },
      error: (err) => {
        console.error('โหลดโปรไฟล์ไม่สำเร็จ', err);
        alert('โหลดโปรไฟล์ไม่สำเร็จ — กรุณาเข้าสู่ระบบใหม่');
      },
    });
  }

  onTopUp(): void {
    const value = Number(this.amountControl.value);
    if (!value || value <= 0) {
      alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }
    if (!this.userId) {
      alert('ไม่พบผู้ใช้ — กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    // ✅ แนบวันที่ที่ผู้ใช้เลือกไปกับ body
    const dateStr = (this.dateControl.value || '').toString().trim();

    const body: WalletTopUpReq = {
      user_id: this.userId,
      amount: value,
      transaction_date: dateStr || undefined, // ถ้าผู้ใช้ล้างค่า จะไม่ส่งฟิลด์นี้
    };

    this.walletService.topUp(body).subscribe({
      next: (res) => {
        this.walletBalance = res.wallet;
        this.loadHistory();
        this.amountControl.setValue('');
        alert(res.message);
      },
      error: (err) => {
        console.error(err);
        alert('เติมเงินไม่สำเร็จ');
      },
    });
  }

  private loadHistory() {
    if (!this.userId) return;
    this.walletService.getHistory(this.userId).subscribe({
      next: (res) => {
        // ✅ จัดเรียงใหม่ → เก่า ก่อน map โดยไทเบรกด้วย id/history_id
        const rows = (res.data || []).slice().sort((a: any, b: any) => {
          const ta = new Date(a.transaction_date).getTime();
          const tb = new Date(b.transaction_date).getTime();
          if (tb !== ta) return tb - ta; // ใหม่ก่อน
          const aId = (a.history_id ?? a.id ?? 0) as number;
          const bId = (b.history_id ?? b.id ?? 0) as number;
          return bId - aId; // ใหม่ก่อน
        });

        this.topUpHistory = rows.map((h: WalletHistoryItem) => ({
          date: new Date(h.transaction_date).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }),
          amount: h.amount,
        }));
      },
      error: (err) => {
        console.error('โหลดประวัติไม่สำเร็จ', err);
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
}
