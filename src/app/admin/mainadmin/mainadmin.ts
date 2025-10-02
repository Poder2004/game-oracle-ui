import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';

@Component({
  selector: 'app-mainadmin',
  standalone: true, // 2. ทำให้เป็น Standalone Component
  imports: [CommonModule, Navadmin], // 3. เพิ่ม CommonModule เข้าไปใน imports
  templateUrl: './mainadmin.html',
  styleUrl: './mainadmin.scss',
})
export class Mainadmin {
  // ข้อมูลจำลองสำหรับแสดงรายการเกม
  games = [
    {
      id: 1,
      name: 'EA SPORTS FC 26',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+1',
    },
    {
      id: 2,
      name: 'EA SPORTS FC 26',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+2',
    },
    {
      id: 3,
      name: 'Monster Hunter Wilds',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+3',
    },
    {
      id: 4,
      name: 'PUBG: BATTLEGROUNDS',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+4',
    },
    {
      id: 5,
      name: 'Dead by Daylight',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+5',
    },
    {
      id: 6,
      name: 'Dota 2',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+6',
    },
    {
      id: 7,
      name: 'Red Dead Redemption 2',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+7',
    },
    {
      id: 8,
      name: 'Battlefield 6',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+8',
    },
    {
      id: 9,
      name: 'Counter-Strike 2',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+9',
    },
    {
      id: 10,
      name: 'Path of Exile 2',
      imageUrl: 'https://placehold.co/150x75/25282E/E79A4A?text=Game+10',
    },
  ];
}
