import { Component, OnInit } from '@angular/core'; // 👈 1. Import OnInit
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';
import { RouterModule } from '@angular/router'; // 👈 1. Import RouterModule
// --- 👇 2. Import ที่จำเป็น ---
import { GameService } from '../../services/game.service';
import { Game } from '../../model/api.model';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-mainadmin',
  standalone: true,
  imports: [CommonModule, Navadmin,RouterModule],
  templateUrl: './mainadmin.html',
  styleUrl: './mainadmin.scss',
})
export class Mainadmin implements OnInit { // 👈 3. Implement OnInit
  
  // 4. เปลี่ยน games เป็น array ว่างๆ ของ Game model
  games: Game[] = [];
  errorMessage: string | null = null;

  // 5. Inject Services ที่ต้องใช้
  constructor(
    private gameService: GameService,
    private constants: Constants
  ) {}

  // 6. ดึงข้อมูลเมื่อ Component เริ่มทำงาน
  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.errorMessage = null;
    this.gameService.getAllGames().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.games = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch games:', err);
        this.errorMessage = "ไม่สามารถดึงข้อมูลเกมได้ กรุณาลองอีกครั้ง";
      }
    });
  }

  // 7. สร้างฟังก์ชันสำหรับสร้าง URL รูปภาพที่สมบูรณ์
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      // ถ้าไม่มี path รูปภาพ ให้ใช้ placeholder
      return 'https://placehold.co/150x75/2c2c2e/f2f2f7?text=No+Image';
    }
    // นำ URL ของ API มาต่อกับ path ของรูปภาพ
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}
