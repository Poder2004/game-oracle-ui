import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navber } from '../../widget/navber/navber';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Constants } from '../../config/constants';
import { Order, WalletHistoryItem, WalletTopUpReq } from '../../model/api.model';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, Navber, DatePipe,
    DecimalPipe, RouterModule, MatIconModule
  ],
  templateUrl: './add-wallet.html',
  styleUrls: ['./add-wallet.scss'],
})
export class AddWallet implements OnInit {
  // --- UI ใหม่: ใช้ FormControl กับ Select Dropdown ---
   amountControl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);
    predefinedAmounts: number[] = [100, 300, 500, 1000, 1500];

  walletBalance = 0;
  userId!: number;
  topUpHistory: { date: string; amount: number }[] = [];
  purchaseHistory: Order[] = [];

  // --- ตัวแปรสำหรับจัดการ Modal ---
  public selectedOrder: Order | null = null;
  public isModalOpen = false;

  constructor(
    private walletService: WalletService,
    private constants: Constants
  ) {}

  ngOnInit() {
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

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeOrderDetails(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  getFullImageUrl(path: string): string {
    if (!path) return 'https://placehold.co/150x75/2c2c2e/f2f2f7?text=No+Image';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
  setAmount(amount: number): void {
        this.amountControl.setValue(amount);
    }

  onTopUp(): void {
        const value = this.amountControl.value;
        if (this.amountControl.invalid || !value || value <= 0) {
            alert('กรุณาระบุจำนวนเงินที่ถูกต้อง (ต้องมากกว่า 0)');
            return;
        }

        const body: WalletTopUpReq = { user_id: this.userId, amount: value };

        this.walletService.topUp(body).subscribe({
            next: (res) => {
                this.walletBalance = res.wallet;
                this.loadTopUpHistory();
                this.amountControl.reset();
                alert(res.message || 'เติมเงินสำเร็จ!');
            },
            // นี่คือส่วนที่สำคัญที่สุดในการหาสาเหตุ
            error: (err) => {
                console.error('API Error:', err); // แสดง error ทั้งหมดใน Console
                const errorMessage = err.error?.message || 'เติมเงินไม่สำเร็จ, ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
                alert(errorMessage);
            }
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
            day: '2-digit', month: 'short', year: 'numeric',
          }),
          amount: h.amount,
        }));
      },
      error: (err) => console.error('โหลดประวัติไม่สำเร็จ', err),
    });
  }
}