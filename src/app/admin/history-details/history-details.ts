// file: history-details.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Navadmin } from '../navadmin/navadmin';
import { UserService } from '../../services/user.service';
import { Order, User, WalletHistoryItem } from '../../model/api.model';
import { Constants } from '../../config/constants';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardSubtitle } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-history-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, Navadmin, DatePipe, DecimalPipe, MatCardModule, MatIconModule
  ],
  templateUrl: './history-details.html',
  styleUrls: ['./history-details.scss']
})
export class HistoryDetails implements OnInit {

  user: User | null = null;
  // 🎯 [แก้ไข] เปลี่ยนชื่อตัวแปรให้ตรงกับใน HTML เพื่อความชัดเจน
  purchaseHistory: Order[] = [];
  walletHistory: WalletHistoryItem[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  userId: number | null = null;

  // --- 👇 [เพิ่ม] ตัวแปรสำหรับจัดการ Modal ---
  public selectedOrder: Order | null = null;
  public isModalOpen = false;
  // --- 👆 [สิ้นสุดส่วนที่เพิ่ม] ---


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private constants: Constants
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : null;

    if (this.userId) {
      this.loadAllData(this.userId);
    } else {
      this.errorMessage = "ไม่พบ ID ของผู้ใช้ใน URL";
      this.isLoading = false;
    }
  }

  loadAllData(id: number): void {
    this.errorMessage = null;
    this.isLoading = true;

    // โหลดข้อมูลโปรไฟล์ผู้ใช้
    this.userService.getUserById(id).subscribe({
      next: res => { this.user = res.data; },
      error: err => {
        this.errorMessage = "ไม่สามารถโหลดข้อมูลโปรไฟล์ผู้ใช้ได้";
        console.error("Failed to load user profile:", err);
      },
      complete: () => this.isLoading = false
    });

    // โหลดประวัติการซื้อเกม
    this.userService.getUserOrders(id).subscribe({
      next: res => {
        // 🎯 [แก้ไข] นำข้อมูลใส่ใน purchaseHistory
        this.purchaseHistory = res.data;
      },
      error: err => { console.error("Failed to load user orders:", err); }
    });

    // โหลดประวัติการเติมเงิน
    this.userService.getWalletHistory(id).subscribe({
      next: res => { this.walletHistory = res.data; },
      error: err => { console.error("Failed to load wallet history:", err); }
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
    if (!path) return 'assets/images/userimage.jpg';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
}