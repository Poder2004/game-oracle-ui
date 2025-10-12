import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, User } from '../../model/api.model';
import { Constants } from '../../config/constants';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Navadmin } from '../navadmin/navadmin';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    RouterModule,
    MatIconModule,
    Navadmin,
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss',
})
export class GameDetailsadmin implements OnInit {
  game?: Game;
  // ✨ 1. เพิ่ม Property สำหรับเก็บชื่อประเภทเกม
  categoryName = '';
  errorMessage: string | null = null;
  public currentUser: User | null = null;
  public isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants,
    private router: Router,
    private authService: AuthService
  ) {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    if (this.isUserLoggedIn) {
      // 🔑 แก้ไข: อ่านจาก 'userData' เพื่อความสอดคล้อง
      const userJson = localStorage.getItem('userData');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    }
  }

  ngOnInit(): void {
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

          // ✨ 2. เพิ่ม Logic การค้นหาชื่อประเภทเกมเหมือนฝั่ง User
          const nameFromGame = this.game?.category?.category_name;
          if (nameFromGame) {
            this.categoryName = nameFromGame;
          } else {
            this.loadCategoryName(this.game?.category_id);
          }
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

  // ✨ 3. เพิ่มฟังก์ชัน loadCategoryName ทั้งหมดจากฝั่ง User
  private loadCategoryName(catId?: number) {
    if (catId == null) return;
    this.gameService.getCategories().subscribe({
      next: (cats) => {
        const hit = (cats || []).find(
          (c) => Number(c.category_id) === Number(catId)
        );
        if (hit) this.categoryName = hit.category_name;
      },
      error: (e) => console.warn('load categories failed', e),
    });
  }

  getFullImageUrl(path?: string): string {
    if (!path)
      return 'https://placehold.co/600x400/2c2c2e/f2f2f7?text=No+Image';
    return `${this.constants.API_ENDPOINT}/${path}`;
  }

  onEdit(): void {
    if (this.game) {
      this.router.navigate(['/edit-game', this.game.game_id]);
    }
  }

  onDelete(): void {
    if (!this.game) return;
    if (confirm(`คุณต้องการลบเกม "${this.game.title}" ออกจากระบบใช่หรือไม่?`)) {
      this.gameService.deleteGame(this.game.game_id).subscribe({
        next: () => {
          alert(`ลบเกม "${this.game?.title}" สำเร็จ`);
          this.router.navigate(['/Mainadmin']);
        },
        error: (err) => {
          console.error('Delete game failed', err);
          alert('เกิดข้อผิดพลาดในการลบเกม กรุณาลองอีกครั้ง');
        },
      });
    }
  }

  // ส่วน Sidebar ไม่ต้องแก้ไข แต่จะแก้ localStorage key ใน logout เพื่อความถูกต้อง
  public isProfileOpen = false;
  toggleProfileSidebar(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }
  logout(): void {
    localStorage.removeItem('authToken');
    // 🔑 แก้ไข: ลบ 'userData'
    localStorage.removeItem('userData');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
