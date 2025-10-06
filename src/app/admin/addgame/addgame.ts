import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';
import { FormsModule, NgForm } from '@angular/forms'; // <-- 1. Import FormsModule และ NgForm
import { GameService } from '../../services/game.service'; // <-- 2. Import GameService
import { Category } from '../../model/api.model'; 

@Component({
  selector: 'app-addgame',
  standalone: true,
  imports: [CommonModule, Navadmin, FormsModule], // <-- 3. เพิ่ม FormsModule ที่นี่
  templateUrl: './addgame.html',
  styleUrls: ['./addgame.scss'],
})
export class Addgame implements OnInit { 
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null; // <-- 4. เพิ่มตัวแปรเก็บไฟล์ที่เลือก

  // สมมติว่ามีประเภทเกมเหล่านี้ (ควรดึงมาจาก API ในอนาคต)
   categories: Category[] = [];

  constructor(private gameService: GameService) {} // <-- 5. Inject GameService
    ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.gameService.getCategories().subscribe({
      next: (data) => {
        this.categories = data; // นำข้อมูลที่ได้จาก API มาใส่ในตัวแปร
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        alert('ไม่สามารถโหลดข้อมูลประเภทเกมได้');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file; // <-- 6. เก็บอ็อบเจ็กต์ File ไว้

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // <-- 7. เพิ่มเมธอด onSubmit ทั้งหมด -->
  onSubmit(form: NgForm): void {
    if (form.invalid || !this.selectedFile) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและเลือกรูปภาพ');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.value.gameName);
    formData.append('description', form.value.gameDescription);
    formData.append('price', form.value.gamePrice);
    formData.append('category_id', form.value.gameCategory);
    formData.append('image', this.selectedFile, this.selectedFile.name);

    this.gameService.createGame(formData).subscribe({
      next: (response) => {
        alert('เพิ่มเกมสำเร็จ!');
        form.reset();
        this.previewUrl = null;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Error creating game:', err);
        alert('เกิดข้อผิดพลาด: ' + (err.error?.error || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'));
      },
    });
  }

  onCancel(form: NgForm): void {
    form.reset();
    this.previewUrl = null;
    this.selectedFile = null;
  }
}