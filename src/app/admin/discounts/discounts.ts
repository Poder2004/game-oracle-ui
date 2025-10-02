import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navadmin } from '../navadmin/navadmin'; // Assuming this path is correct

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, Navadmin],
  templateUrl: './discounts.html',
  styleUrl: './discounts.scss',
})
export class Discounts {
  // --- เพิ่มโค้ดสำหรับจัดการ Modal ---
  isModalOpen = false;

  // ข้อมูลจำลองสำหรับแสดงใน Modal
  allCoupons = [
    {
      name: 'สุดปัง กับเกมที่คุณสนใจ',
      description: 'ซื้อขั้นต่ำ 1000 ลด 70 %',
      quantity: 10,
    },
    {
      name: 'สุดปัง กับเกมที่คุณสนใจ',
      description: 'ซื้อขั้นต่ำ 1000 ลด 70 %',
      quantity: 4,
    },
    {
      name: 'สุดปัง กับเกมที่คุณสนใจ',
      description: 'ซื้อขั้นต่ำ 1000 ลด 70 %',
      quantity: 10,
    },
    {
      name: 'สุดปัง กับเกมที่คุณสนใจ',
      description: 'ซื้อขั้นต่ำ 1000 ลด 70 %',
      quantity: 10,
    },
  ];

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  // ------------------------------------
}
