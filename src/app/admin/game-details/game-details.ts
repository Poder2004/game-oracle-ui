import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, User } from '../../model/api.model';
import { Constants } from '../../config/constants';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, RouterModule, MatIconModule, MatToolbar], // 👈 Import Pipes
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss'
})
export class GameDetailsadmin implements OnInit {
  game?: Game;
  errorMessage: string | null = null;
  public currentUser: User | null = null;
  public isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants,
    private router: Router,
     private authService: AuthService,
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // 2. ดึงข้อมูลผู้ใช้จาก localStorage ถ้ามี
    if (this.isUserLoggedIn) {
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson); // แปลง JSON string กลับเป็น Object
      }
    }
  }


  ngOnInit(): void {
    // ดึง ID จาก URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id === null || isNaN(id)) {
      this.errorMessage = 'Game ID ไม่ถูกต้อง';
      return;
    }

    this.gameService.getGameById(id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.game = res.data;
        } else {
          this.errorMessage = 'ไม่พบข้อมูลเกม';
        }
      },
      error: (e) => {
        console.error('load game failed', e);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลเกมได้';
      },
    });
  }

  getFullImageUrl(path?: string): string {
    if (!path) return 'https://placehold.co/600x400/2c2c2e/f2f2f7?text=No+Image';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }

  // ฟังก์ชันสำหรับปุ่ม "แก้ไข"
  onEdit(): void {
    if (this.game) {
      // นำทางไปยังหน้า Edit พร้อมส่ง ID ของเกมไปด้วย
      this.router.navigate(['/edit-game', this.game.game_id]);
    }
  }

  // ฟังก์ชันสำหรับปุ่ม "ลบ"
  onDelete(): void {
    // 3.1 ตรวจสอบว่ามีข้อมูลเกมก่อน
    if (!this.game) return;

    // 3.2 แสดงหน้าต่างยืนยัน
    if (confirm(`คุณต้องการลบเกม "${this.game.title}" ออกจากระบบใช่หรือไม่?`)) {
      // 3.3 เรียกใช้ Service เพื่อลบ
      this.gameService.deleteGame(this.game.game_id).subscribe({
        next: () => {
          // --- กรณีสำเร็จ ---
          alert(`ลบเกม "${this.game?.title}" สำเร็จ`);
          // พาผู้ใช้กลับไปหน้ารายการเกมทั้งหมด
          this.router.navigate(['/Mainadmin']);
        },
        error: (err) => {
          // --- กรณีล้มเหลว ---
          console.error('Delete game failed', err);
          alert('เกิดข้อผิดพลาดในการลบเกม กรุณาลองอีกครั้ง');
        }
      });
    }
  }

  public isProfileOpen = false;
  // ฟังก์ชันสำหรับสลับสถานะ (เปิด/ปิด)
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout(): void {
    localStorage.removeItem('authToken'); // ลบ token
    localStorage.removeItem('currentUser'); // ลบข้อมูล user
    this.router.navigate(['/login']); // กลับไปหน้า login

    // (Optional) รีเฟรชหน้าเพื่อให้ component อัปเดตสถานะทันที
    window.location.reload();
  }
}
