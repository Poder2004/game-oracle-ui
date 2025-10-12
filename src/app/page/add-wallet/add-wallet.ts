import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // 👈 Import Pipes
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Navber } from '../../widget/navber/navber';

// --- 👇 Import ที่อัปเดต ---
import { WalletService } from '../../services/wallet.service';
import { Constants } from '../../config/constants';
import { Order, WalletHistoryItem, WalletTopUpReq } from '../../model/api.model';
import { RouterModule } from '@angular/router'; // 👈 Import RouterModule

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatAutocompleteModule, Navber, DatePipe, DecimalPipe, RouterModule // 👈 เพิ่ม Pipes และ RouterModule
  ],
  templateUrl: './add-wallet.html',
  styleUrls: ['./add-wallet.scss'],
})
export class AddWallet implements OnInit {
  amountControl = new FormControl('');
  options: string[] = ['100', '300', '500', '1000'];
  filteredOptions!: Observable<string[]>;

  walletBalance = 0;
  userId!: number;

  topUpHistory: { date: string; amount: number }[] = [];
  
  // 1. ลบข้อมูลจำลอง และสร้างตัวแปรใหม่สำหรับเก็บข้อมูลจริง
  purchaseHistory: Order[] = [];

  constructor(
    private walletService: WalletService,
    private constants: Constants // 👈 Inject Constants
  ) {}

  ngOnInit() {
    this.filteredOptions = this.amountControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter((value || '').toString()))
    );

    this.walletService.getProfile().subscribe({
      next: (res) => {
        const u = res.user;
        this.userId = u.user_id;
        this.walletBalance = u.wallet;
        
        // 2. เรียกฟังก์ชันโหลดประวัติต่างๆ หลังจากโหลดโปรไฟล์สำเร็จ
        this.loadTopUpHistory();
        this.loadPurchaseHistory();
      },
      error: (err) => {
        console.error('โหลดโปรไฟล์ไม่สำเร็จ', err);
        alert('โหลดโปรไฟล์ไม่สำเร็จ — กรุณาเข้าสู่ระบบใหม่');
      },
    });
  }

  // 3. สร้างฟังก์ชันสำหรับโหลดประวัติการซื้อเกม
  loadPurchaseHistory(): void {
    this.walletService.getMyOrders().subscribe({
      next: (res) => {
        this.purchaseHistory = res.data;
      },
      error: (err) => {
        console.error('โหลดประวัติการซื้อเกมไม่สำเร็จ', err);
      }
    });
  }

  // สร้างฟังก์ชันสำหรับสร้าง URL รูปภาพ
  getFullImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/150x75/2c2c2e/f2f2f7?text=No+Image';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }

  onTopUp(): void {
    const value = Number(this.amountControl.value);
    if (!value || value <= 0) {
      alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }
    
    const body: WalletTopUpReq = { user_id: this.userId, amount: value };
    this.walletService.topUp(body).subscribe({
      next: (res) => {
        this.walletBalance = res.wallet;
        this.loadTopUpHistory(); // แก้ชื่อฟังก์ชัน
        this.amountControl.setValue('');
        alert(res.message);
      },
      error: (err) => alert('เติมเงินไม่สำเร็จ'),
    });
  }

  // แก้ไขชื่อฟังก์ชัน loadHistory เป็น loadTopUpHistory เพื่อความชัดเจน
  private loadTopUpHistory() {
    if (!this.userId) return;
    this.walletService.getHistory(this.userId).subscribe({
      next: (res) => {
        const rows = (res.data || []).slice().sort((a,b) => 
          new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        
        this.topUpHistory = rows.map((h: WalletHistoryItem) => ({
          date: new Date(h.transaction_date).toLocaleDateString('th-TH', {
            day: '2-digit', month: 'short', year: '2-digit',
          }),
          amount: h.amount,
        }));
      },
      error: (err) => console.error('โหลดประวัติไม่สำเร็จ', err),
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
}

