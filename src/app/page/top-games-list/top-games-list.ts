// file: top-games-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Game } from '../../model/api.model';
import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Navber } from '../../widget/navber/navber';

@Component({
  selector: 'app-top-games-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    Navber,
  ],
  templateUrl: './top-games-list.html',
  styleUrls: ['./top-games-list.scss'],
})
export class TopGamesList implements OnInit {
  topGames: Game[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private gameService: GameService, private constants: Constants) {}

  ngOnInit(): void {
    this.gameService.getTopSellingGames().subscribe({
      next: (response) => {
        this.topGames = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load top selling games:', err);
        this.error = 'ไม่สามารถโหลดข้อมูลอันดับเกมได้';
        this.isLoading = false;
      },
    });
  }

  getFullImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder.png'; // ควรมีรูปสำรองในโปรเจกต์
    }
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}
