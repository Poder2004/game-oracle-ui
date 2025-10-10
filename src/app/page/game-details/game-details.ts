// game-details.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Game } from '../../model/api.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-details.html',
  styleUrl: './game-details.scss'
})
export class GameDetails implements OnInit {
  game?: Game;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) return;

    this.gameService.getGameById(id).subscribe({
      next: (res) => (this.game = res.data),
      error: (e) => console.error('load game failed', e)
    });
  }

  getFullImageUrl(path?: string): string {
    if (!path) return '';
    // path จาก DB เป็น "uploads/xxxx.jpg" => ต่อกับ API_ENDPOINT
    return `${this.constants.API_ENDPOINT}/${path}`;
  }
}
