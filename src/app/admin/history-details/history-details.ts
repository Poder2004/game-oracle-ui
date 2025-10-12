import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Navadmin } from '../navadmin/navadmin'; 
import { UserService } from '../../services/user.service';
import { Order, User, WalletHistoryItem } from '../../model/api.model'; 
import { Constants } from '../../config/constants'; 

@Component({
  selector: 'app-history-details',
  standalone: true,
  // เพิ่ม Pipes และ RouterModule
  imports: [CommonModule, RouterModule, Navadmin, DatePipe, DecimalPipe],
  templateUrl: './history-details.html',
  styleUrls: ['./history-details.scss']
})
export class HistoryDetails implements OnInit {

  user: User | null = null;
  orders: Order[] = [];
  walletHistory: WalletHistoryItem[] = [];
  isLoading: boolean = true; 
  errorMessage: string | null = null;

  userId: number | null = null;

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

    // 4. โหลดข้อมูลโปรไฟล์ผู้ใช้
    this.userService.getUserById(id).subscribe({
      next: res => {
        this.user = res.data;
      },
      error: err => {
        this.errorMessage = "ไม่สามารถโหลดข้อมูลโปรไฟล์ผู้ใช้ได้";
        console.error("Failed to load user profile:", err);
      },
      complete: () => this.isLoading = false // หยุด Loading เมื่อโหลดเสร็จ (ทั้งสำเร็จและล้มเหลว)
    });

    // 5. โหลดประวัติการซื้อเกม
    this.userService.getUserOrders(id).subscribe({
      next: res => {
        this.orders = res.data;
      },
      error: err => {
        console.error("Failed to load user orders:", err);
        // อาจจะแสดงข้อความ Error แยกสำหรับส่วนนี้
      }
    });

    // 6. โหลดประวัติการเติมเงิน
    this.userService.getWalletHistory(id).subscribe({
      next: res => {
        this.walletHistory = res.data;
      },
      error: err => {
        console.error("Failed to load wallet history:", err);
      }
    });
  }

  // 7. ฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
  getFullImageUrl(path: string): string {
    if (!path) return 'assets/images/userimage.jpg';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
}
