import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';

@Component({
  selector: 'app-addgame',
  standalone: true,
  imports: [CommonModule, Navadmin],
  templateUrl: './addgame.html',
  styleUrls: ['./addgame.scss'],
})
export class Addgame {
  // ตัวแปรสำหรับเก็บ URL ของรูปภาพที่จะแสดงเป็นตัวอย่าง
  previewUrl: string | ArrayBuffer | null = null;

  // เมธอดนี้จะทำงานเมื่อผู้ใช้เลือกไฟล์
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // ตรวจสอบว่าผู้ใช้เลือกไฟล์มาจริงหรือไม่
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      // อ่านไฟล์รูปภาพและแปลงเป็น URL
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // เมธอดสำหรับล้างรูปภาพที่เลือกไว้ (เผื่อต้องการใช้)
  clearPreview(): void {
    this.previewUrl = null;
  }
}
