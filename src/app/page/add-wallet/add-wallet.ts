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

import { Navber } from "../../widget/navber/navber";

// Services & models
import { WalletService } from '../../services/wallet.service';
import { WalletTopUpReq } from '../../model/api.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,     // ต้องมีเพื่อเรียก HTTP
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    Navber
  ],
  templateUrl: './add-wallet.html',
  styleUrl: './add-wallet.scss'
})
export class AddWallet implements OnInit {

  amountControl = new FormControl('');
  options: string[] = ['100', '300', '500', '1000'];
  filteredOptions!: Observable<string[]>;

  // state บนหน้า
  walletBalance = 0;
  userId!: number;
  userName = '';        // << เพิ่ม
  userEmail = '';       // << เพิ่ม

  // ประวัติการเติม (UI)
  topUpHistory = [
    { date: '19 ก.ย. 68', amount: 500 },
    { date: '22 ก.ย. 68', amount: 900 },
    { date: '25 ก.ย. 68', amount: 200 },
    { date: '30 ก.ย. 68', amount: 1500 },
  ];

  // ประวัติการซื้อเกม (UI)
  purchaseHistory = [
    { name: 'Battlefield 6', date: '22 ก.ย. 68', price: 200, image: 'assets/images/bf6.jpg' },
    { name: 'PUBG: BATTLEGROUNDS', date: '22 ก.ย. 68', price: 300, image: 'assets/images/pubg.jpg' },
    { name: 'EA SPORTS FC 26', date: '22 ก.ย. 68', price: 1000, image: 'assets/images/fc26.jpg' },
  ];

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    // autocomplete
    this.filteredOptions = this.amountControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter((value || '').toString())),
    );

    // ดึงโปรไฟล์เพื่อรู้ user_id และยอด wallet ปัจจุบัน
    this.walletService.getProfile().subscribe({
      next: (res) => {
        // ถ้า service คืน GetProfileResponse → ใช้ res.user
        const u: any = (res as any).user ?? res;
        this.userId = u.user_id;
        this.walletBalance = u.wallet;
        this.userName = u.username;   // << เพิ่ม
        this.userEmail = u.email;     // << เพิ่ม
        
      },
      error: (err) => {
        console.error('โหลดโปรไฟล์ไม่สำเร็จ', err);
        alert('โหลดโปรไฟล์ไม่สำเร็จ — กรุณาเข้าสู่ระบบใหม่');
      }
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

    const body: WalletTopUpReq = { user_id: this.userId, amount: value };

    this.walletService.topUp(body).subscribe({
      next: (res) => {
        this.walletBalance = res.wallet;

        // เพิ่มประวัติบนหน้า
        const now = new Date();
        this.topUpHistory.unshift({
          date: now.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' }),
          amount: value
        });

        this.amountControl.setValue('');
        alert(res.message);
      },
      error: (err) => {
        console.error(err);
        alert('เติมเงินไม่สำเร็จ');
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
