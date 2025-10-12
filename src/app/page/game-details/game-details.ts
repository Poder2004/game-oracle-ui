// game-details.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Game, User } from '../../model/api.model';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbar,RouterModule],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss',
})
export class GameDetails implements OnInit {
  game?: Game;
  /** ชื่อประเภทเกมที่จะแสดงบนหน้า (เช่น "สยองขวัญ") */
  categoryName = '';
  errorMessage: string | null = null;
  public currentUser: User | null = null;
  public isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants,
    private cart: CartService,
    private authService: AuthService,
    private router: Router
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      console.error('invalid game id in route');
      return;
    }

    this.gameService.getGameById(id).subscribe({
      next: (res) => {
        this.game = res.data;

        // 1) ถ้ามีชื่อประเภทมากับข้อมูลเกม ใช้ได้ทันที
        const nameFromGame = this.game?.category?.category_name;
        if (nameFromGame) {
          this.categoryName = nameFromGame;
        } else {
          // 2) ถ้าไม่มีชื่อหมวด ให้ดึงรายการประเภททั้งหมดแล้วหาเอาตาม category_id
          this.loadCategoryName(this.game?.category_id);
        }
      },
      error: (e) => console.error('load game failed', e),
    });
  }

  /** ดึงชื่อประเภทจาก service.getCategories() (ต้องคืนค่าเป็น Category[] แล้ว) */
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

  addToCart(g: Game) {
    this.cart.addItem({
      id: g.game_id, // 👈 เพิ่มบรรทัดนี้
      name: g.title,
      price: Number(g.price) || 0,
      image: g.image_game || '', // เผื่อแสดงรูปในตะกร้า
    });
    this.router.navigate(['/cart']);
  }

  getFullImageUrl(path?: string): string {
    if (!path) return 'https://placehold.co/600x400/2c2c2e/f2f2f7?text=No+Image';
    return `${this.constants.API_ENDPOINT}/${path}`;
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
