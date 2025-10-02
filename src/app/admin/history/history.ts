import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navadmin } from "../navadmin/navadmin";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, Navadmin],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class Historyuser {
  // ข้อมูลจำลองสำหรับแสดงรายชื่อผู้ใช้
  users = [
    {
      id: 1,
      name: '1mill',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=1',
    },
    {
      id: 2,
      name: 'พ่อครูริน เซนเะฮิปฮอป',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=พ',
    },
    {
      id: 3,
      name: '3mill',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=3',
    },
    {
      id: 4,
      name: '4mill',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=4',
    },
    {
      id: 5,
      name: '5mill',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=5',
    },
    {
      id: 6,
      name: 'Young gu',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=Y',
    },
    {
      id: 7,
      name: 'Young ohm',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=Y',
    },
    {
      id: 8,
      name: 'jayjay',
      imageUrl: 'https://placehold.co/60x60/EFEFEF/333333?text=J',
    },
  ];
}
