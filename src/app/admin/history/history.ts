import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';
import { UserService } from '../../services/user.service';
import { User } from '../../model/api.model';
import { Constants } from '../../config/constants'; // 👈 1. Import Constants
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-historyuser',
  standalone: true,
  imports: [CommonModule, Navadmin,RouterModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss']
})
export class Historyuser implements OnInit {
  
  users: User[] = [];
  fetchError: string | null = null;

  // 👈 2. Inject Constants Service
  constructor(
    private userService: UserService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.fetchError = null;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.users = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
        this.fetchError = 'ไม่สามารถดึงข้อมูลผู้ใช้ได้';
      }
    });
  }

  // 👇 3. สร้างฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
  getFullImageUrl(imagePath: string): string {
    // ถ้าไม่มี path รูปภาพ หรือ path เป็นค่าว่าง
    if (!imagePath) {
      // ให้ใช้รูป default จาก assets
      return 'assets/images/userimage.jpg';
    }
    // นำ URL ของ API มาต่อกับ path ของรูปภาพ
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}

