import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navber } from "./widget/navber/navber";

// --- ลบ import ของ provideRouter และ routes ออกจากไฟล์นี้ ---

@Component({
  selector: 'app-root',
  standalone: true, // <-- เพิ่มบรรทัดนี้ เพื่อให้เป็น Standalone Component ที่สมบูรณ์
  imports: [RouterOutlet, Navber],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'game-oracle-ui';
}