// file: src/app/pages/library/library.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs'; // ✅ 1. Import forkJoin

import { Game, Category } from '../../model/api.model'; // ✅ 2. Import Category
import { GameService } from '../../services/game.service';
import { Constants } from '../../config/constants';
import { Navber } from '../../widget/navber/navber';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    Navber,
  ],
  templateUrl: './library.html',
  styleUrls: ['./library.scss'],
})
export class Library implements OnInit {
  libraryGames: Game[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private gameService: GameService, private constants: Constants) {}

  ngOnInit(): void {
    // ✅ 3. เปลี่ยนมาเรียกฟังก์ชันใหม่ที่ดึงข้อมูล 2 ส่วนพร้อมกัน
    this.loadLibraryAndCategories();
  }

  loadLibraryAndCategories(): void {
    this.isLoading = true;
    forkJoin({
      libraryRes: this.gameService.getUserLibrary(),
      categories: this.gameService.getCategories(),
    }).subscribe({
      next: ({ libraryRes, categories }) => {
        const games = libraryRes.data || [];

        // สร้าง Map เพื่อให้ค้นหาชื่อ Category ได้อย่างรวดเร็ว
        const categoryMap = new Map<number, string>();
        categories.forEach((cat) =>
          categoryMap.set(cat.category_id, cat.category_name)
        );

        // วนลูปเพื่อเติมข้อมูล Category ที่อาจจะขาดไป
        this.libraryGames = games.map((game) => {
          // ถ้าเกมไม่มีข้อมูล category ติดมาด้วย (จากการ Preload)
          if (!game.category && game.category_id) {
            const categoryName = categoryMap.get(game.category_id);
            if (categoryName) {
              // สร้าง object category ขึ้นมาเองในฝั่ง Frontend
              game.category = {
                category_id: game.category_id,
                category_name: categoryName,
              };
            }
          }
          return game;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load library data:', err);
        this.error = 'ไม่สามารถโหลดข้อมูลคลังเกมได้';
        this.isLoading = false;
      },
    });
  }

  // 🚨 ตรวจสอบให้แน่ใจว่าฟังก์ชันนี้ถูกต้อง (มี /uploads/)
  getFullImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder.png';
    }
    return `${this.constants.API_ENDPOINT}/${imagePath}`;
  }
}
