
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  GameService } from '../../services/game.service'; // ตรวจสอบ path ให้ถูกต้อง
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Game } from '../../model/api.model';
import { Constants } from '../../config/constants'; // 1. Import Constants
import { MatCardModule } from '@angular/material/card'; // 2. Import MatCardModule
import { MatButtonModule } from '@angular/material/button'; // 3. Import MatButtonModule
import { RouterModule } from '@angular/router';      // 4. Import RouterModule สำหรับ routerLink
import { Navber } from '../../widget/navber/navber';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule,CommonModule,
    MatCardModule,    // <-- เพิ่ม
    MatButtonModule,  // <-- เพิ่ม
    RouterModule,
    Navber 
  ],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResults implements OnInit {
  games$!: Observable<Game[]>;
  searchTerm: string = '';
  private readonly API_ENDPOINT: string;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private constants: Constants
  )  {
    this.API_ENDPOINT = this.constants.API_ENDPOINT; // <-- เพิ่ม
  }

  ngOnInit(): void {
    this.games$ = this.route.queryParamMap.pipe(
      switchMap(params => {
        const term = params.get('q') || '';
        this.searchTerm = term;
        return this.gameService.searchGames(term);
      }),
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching search results:', error);
        return of([]); // คืนค่าเป็น array ว่างถ้าเกิด error
      })
    );
  }
   getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      // สามารถกำหนดรูปภาพเริ่มต้นได้ หากไม่มีรูป
      return 'assets/images/default-game-image.png';
    }
    return `${this.API_ENDPOINT}/${imagePath}`;
  }
}