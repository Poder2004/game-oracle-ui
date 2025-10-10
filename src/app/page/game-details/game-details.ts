// game-details.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Game } from '../../model/api.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss',
})
export class GameDetails implements OnInit {
  game?: Game;
  /** ชื่อประเภทเกมที่จะแสดงบนหน้า (เช่น "สยองขวัญ") */
  categoryName = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants,
    private cart: CartService,
    private router: Router
  ) {}

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
        const hit = (cats || []).find(c => Number(c.category_id) === Number(catId));
        if (hit) this.categoryName = hit.category_name;
      },
      error: (e) => console.warn('load categories failed', e),
    });
  }

  addToCart(g: Game) {
    this.cart.addItem({
      name: g.title,
      price: Number(g.price) || 0,
      image: g.image_game || '', // เผื่อแสดงรูปในตะกร้า
    });
    this.router.navigate(['/cart']);
  }

  getFullImageUrl(path?: string): string {
    return path ? `${this.constants.API_ENDPOINT}/${path}` : '';
  }
}
