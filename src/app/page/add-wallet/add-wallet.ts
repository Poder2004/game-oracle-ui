import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Navber } from '../../widget/navber/navber';
import { RouterModule } from '@angular/router';

// --- Imports ---
import { WalletService } from '../../services/wallet.service';
import { Constants } from '../../config/constants';
import { Order, WalletHistoryItem, WalletTopUpReq } from '../../model/api.model';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatAutocompleteModule, Navber, DatePipe, DecimalPipe, RouterModule,
    MatIconModule
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
  purchaseHistory: Order[] = [];

  // --- 👇 [เพิ่ม] ตัวแปรสำหรับจัดการ Modal ---
  public selectedOrder: Order | null = null;
  public isModalOpen = false;
  // --- 👆 [สิ้นสุดส่วนที่เพิ่ม] ---

  constructor(
    private walletService: WalletService,
    private constants: Constants
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
        
        this.loadTopUpHistory();
        this.loadPurchaseHistory();
      },
      error: (err) => {
        console.error('โหลดโปรไฟล์ไม่สำเร็จ', err);
        alert('โหลดโปรไฟล์ไม่สำเร็จ — กรุณาเข้าสู่ระบบใหม่');
      },
    });
  }

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
  
  // --- 👇 [เพิ่ม] ฟังก์ชันสำหรับเปิด/ปิด Modal ---
  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeOrderDetails(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }
  // --- 👆 [สิ้นสุดส่วนที่เพิ่ม] ---

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
        this.loadTopUpHistory();
        this.amountControl.setValue('');
        alert(res.message);
      },
      error: (err) => alert('เติมเงินไม่สำเร็จ'),
    });
  }

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

