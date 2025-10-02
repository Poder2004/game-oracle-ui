import { Component } from '@angular/core';

// --- Modules ที่จำเป็น ---
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Navber } from "../../widget/navber/navber"; // สำหรับ Dropdown

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule // เพิ่ม MatSelectModule
    ,
    Navber
],
  templateUrl: './add-wallet.html',
  styleUrl: './add-wallet.scss'
})
export class AddWallet {

  // ข้อมูลจำลองสำหรับประวัติการเติมเงิน
  topUpHistory = [
    { date: '19 ก.ย. 68', amount: 500 },
    { date: '22 ก.ย. 68', amount: 900 },
    { date: '25 ก.ย. 68', amount: 200 },
    { date: '30 ก.ย. 68', amount: 1500 },
  ];

  // ข้อมูลจำลองสำหรับประวัติการซื้อเกม
  purchaseHistory = [
    { name: 'Battlefield 6', date: '22 ก.ย. 68', price: 200, image: 'assets/images/bf6.jpg' },
    { name: 'PUBG: BATTLEGROUNDS', date: '22 ก.ย. 68', price: 300, image: 'assets/images/pubg.jpg' },
    { name: 'EA SPORTS FC 26', date: '22 ก.ย. 68', price: 1000, image: 'assets/images/fc26.jpg' },
  ];

  constructor() { }
}