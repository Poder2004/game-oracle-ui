import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navadmin } from '../navadmin/navadmin';
import { GameService } from '../../services/game.service';
import { Category, Game } from '../../model/api.model';
import { Constants } from '../../config/constants';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Navadmin],
  templateUrl: './edit-game.html',
  styleUrls: ['./edit-game.scss']
})
export class EditGame implements OnInit {
  editForm: FormGroup;
  gameId: number | null = null;
  currentGame: Game | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  categories: Category[] = [];

  submitSuccess: string | null = null;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private constants: Constants
  ) {
    this.editForm = this.fb.group({
      title: [''],
      description: [''],
      price: [null],
      category_id: [null],
      image: [null] // สำหรับเก็บไฟล์ใหม่
    });
  }

  ngOnInit(): void {
    // 1. ดึง ID จาก URL และโหลดข้อมูลเกม
    const idParam = this.route.snapshot.paramMap.get('id');
    this.gameId = idParam ? Number(idParam) : null;
    if (this.gameId) {
      this.loadGameData(this.gameId);
    } else {
      this.submitError = "ไม่พบ ID ของเกม";
    }

    // 2. โหลด Categories สำหรับ Dropdown
    this.loadCategories();
  }

  loadGameData(id: number): void {
    this.gameService.getGameById(id).subscribe({
      next: (res) => {
        this.currentGame = res.data;
        // 3. นำข้อมูลเดิมมาใส่ในฟอร์ม
        this.editForm.patchValue({
          title: this.currentGame.title,
          description: this.currentGame.description,
          price: this.currentGame.price,
          category_id: this.currentGame.category_id,
        });
        // 4. ตั้งค่ารูปภาพ Preview เริ่มต้น
        this.previewUrl = `${this.constants.API_ENDPOINT}/${this.currentGame.image_game}`;
      },
      error: (err) => this.submitError = "ไม่สามารถโหลดข้อมูลเกมได้"
    });
  }

  loadCategories(): void {
    this.gameService.getCategories().subscribe(cats => this.categories = cats);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.editForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitSuccess = null;
    this.submitError = null;

    if (!this.gameId) {
      this.submitError = "ไม่พบ ID ของเกม ไม่สามารถอัปเดตได้";
      return;
    }

    // 5. สร้าง FormData เฉพาะข้อมูลที่ถูกแก้ไข
    const formData = new FormData();
    const controls = this.editForm.controls;

    for (const key in controls) {
      if (controls[key].dirty && controls[key].value !== null) {
        formData.append(key, controls[key].value);
      }
    }

    // ถ้าไม่มีอะไรเปลี่ยนแปลงเลย ก็ไม่ต้องส่ง request
    if (!formData.keys().next().value) {
      this.submitSuccess = "ไม่มีข้อมูลที่เปลี่ยนแปลง";
      return;
    }

    // 6. เรียก Service เพื่ออัปเดต
    this.gameService.updateGame(this.gameId, formData).subscribe({
      next: (res) => {
        this.submitSuccess = `อัปเดตเกม "${res.data.title}" สำเร็จ!`;
        setTimeout(() => this.router.navigate(['/Mainadmin']), 2000);
      },
      error: (err) => this.submitError = err.error?.error || 'เกิดข้อผิดพลาดในการอัปเดต'
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/game-details', this.gameId]);
  }
}
