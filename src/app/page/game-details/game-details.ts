// game-details.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { CartService } from '../../services/cart.service';
import { Game } from '../../model/api.model';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-details.html',
  styleUrls: ['./game-details.scss'], // ✅ แก้เป็น styleUrls
})
export class GameDetails implements OnInit {
  game?: Game;

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
      next: (res) => (this.game = res.data),
      error: (e) => console.error('load game failed', e),
    });
  }

  // ✅ เวอร์ชันใช้งานจริง: ส่ง name, price, image ไปที่ตะกร้า แล้วเด้งไปหน้า cart
  addToCart(g: Game): void {
    this.cart.addItem({
      id: g.game_id,
      name: g.title,
      price: Number(g.price) || 0,
      image: this.getFullImageUrl(g.image_game), // ✅ เพิ่มรูป
    });
    localStorage.setItem('lastGameId', String(g.game_id)); // ✅ กันพลาด
    this.router.navigate(['/cart']);
  }

  getFullImageUrl(path?: string): string {
    if (!path) return '';
    // path จาก DB เป็น "uploads/xxx.jpg" → ต่อกับ API_ENDPOINT ให้เป็น URL เต็ม
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
}
