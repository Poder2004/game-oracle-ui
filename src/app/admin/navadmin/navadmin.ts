import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navadmin',
  standalone: true, // 2. ทำให้เป็น Standalone Component
  imports: [CommonModule, RouterModule],
  templateUrl: './navadmin.html',
  styleUrl: './navadmin.scss',
})
export class Navadmin {}
