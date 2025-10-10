import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Navadmin } from '../navadmin/navadmin'; // ตรวจสอบ Path
import { UserService } from '../../services/user.service';
import { User} from '../../model/api.model'; // 👈 Import Models
import { Constants } from '../../config/constants'; // 👈 Import Constants

@Component({
  selector: 'app-history-details',
  standalone: true,
  // เพิ่ม Pipes และ RouterModule
  imports: [CommonModule, RouterModule, Navadmin, DatePipe, DecimalPipe],
  templateUrl: './history-details.html',
  styleUrls: ['./history-details.scss']
})
export class HistoryDetails implements OnInit {
  // 1. ลบข้อมูลจำลองออก และสร้างตัวแปรสำหรับเก็บข้อมูลจริง
  user: User | null = null;
  // orders: Order[] = [];
  // walletHistory: WalletHistory[] = [];
  
  errorMessage: string | null = null;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
       private userService: UserService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    // 2. ดึง ID ของผู้ใช้จาก URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : null;

    if (this.userId) {
      // 3. เรียกฟังก์ชันเพื่อโหลดข้อมูลทั้งหมด
      this.loadAllData(this.userId);
    } else {
      this.errorMessage = "ไม่พบ ID ของผู้ใช้";
    }
  }

  loadAllData(id: number): void {
    this.errorMessage = null;
    
    // 4. โหลดข้อมูลโปรไฟล์ผู้ใช้
    this.userService.getUserById(id).subscribe({
      next: res => this.user = res.data,
      error: err => this.errorMessage = "ไม่สามารถโหลดข้อมูลผู้ใช้ได้"
    });

    // // 5. โหลดประวัติการซื้อเกม
    // this.userService.getUserOrders(id).subscribe({
    //   next: res => this.orders = res.data,
    //   error: err => console.error("Failed to load orders", err)
    // });
    
    // 6. โหลดประวัติการเติมเงิน (ถ้ามี Service)
    // this.adminService.getWalletHistory(id).subscribe(...)
  }
  
  // 7. ฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
  getFullImageUrl(path: string): string {
    if (!path) return 'assets/images/default-avatar.png';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
}
