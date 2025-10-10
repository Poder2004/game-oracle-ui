import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Game, SearchResponse, GetAllGamesResponse } from '../../model/api.model';
import { Navber } from '../../widget/navber/navber';

@Component({
  selector: 'app-game-type',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, Navber],
  templateUrl: './game-type.html',
  styleUrls: ['./game-type.scss'],
})
export class GameType implements OnInit {
  loadingGames = true;
  games: Game[] = [];
  catId!: number;
  categoryName = '';

  // Fallback map (เผื่อ backend ไม่ส่งชื่อหมวดมา)
  private categoryMap: Record<number, string> = {
    1: 'สร้างสรรค์',
    2: 'แอ็กชัน',
    3: 'ปกป้องอาณาจักร',
    4: 'สยองขวัญ',
    5: 'แข่งรถ',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private constants: Constants
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const cat = Number(params.get('cat'));
      if (!Number.isFinite(cat)) {
        this.router.navigate(['/home']);
        return;
      }
      this.catId = cat;
      this.categoryName = this.categoryMap[cat] ?? `หมวด #${cat}`;
      this.fetchGamesByCategory(cat);
    });
  }

  private fetchGamesByCategory(catId: number) {
    this.loadingGames = true;

    this.gameService.getGamesByCategory(catId).subscribe({
      next: (res: SearchResponse) => {
        this.games = res.data ?? [];
        this.resolveCategoryNameFromData();
        this.loadingGames = false;
      },
      error: () => {
        this.gameService.getAllGames().subscribe({
          next: (all: GetAllGamesResponse) => {
            this.games = (all.data ?? []).filter(
              (g) => Number(g.category_id) === Number(this.catId)
            );
            this.resolveCategoryNameFromData();
            this.loadingGames = false;
          },
          error: (e2) => {
            console.error('load games failed', e2);
            this.games = [];
            this.loadingGames = false;
          },
        });
      },
    });
  }

  private resolveCategoryNameFromData() {
    const found = this.games.find((g) => g?.category?.category_name);
    if (found?.category?.category_name) {
      this.categoryName = found.category.category_name;
      return;
    }
    if (!this.categoryName) {
      this.categoryName =
        this.categoryMap[this.catId] ?? `หมวด #${this.catId}`;
    }
  }

  getFullImageUrl(path?: string): string {
    return path ? `${this.constants.API_ENDPOINT}/${path}` : '';
  }
}
