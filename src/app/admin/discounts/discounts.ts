import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // 👈 Import Reactive Forms
import { CouponService } from '../../services/coupon.service'; // 👈 Import CouponService
import { DiscountCode } from '../../model/api.model'; // 👈 Import DiscountCode model

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, Navadmin, ReactiveFormsModule], // 👈 เพิ่ม ReactiveFormsModule
  templateUrl: './discounts.html',
  styleUrl: './discounts.scss',
})
export class Discounts implements OnInit {
  couponForm: FormGroup;
  isModalOpen = false;
  allCoupons: DiscountCode[] = [];

  // สำหรับแสดงข้อความ Feedback
  submitSuccess: string | null = null;
  submitError: string | null = null;
  fetchError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService
  ) {
    // สร้างฟอร์มพร้อม Validation
    this.couponForm = this.fb.group({
      name_code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]], // อังกฤษตัวใหญ่, ตัวเลข, และ _
      description: ['', Validators.required],
      discount_value: [null, [Validators.required, Validators.min(0)]],
      discount_type: ['percent', Validators.required], // ค่าเริ่มต้น
      min_value: [0, [Validators.required, Validators.min(0)]],
      limit_usage: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  // ฟังก์ชันสำหรับส่งข้อมูลฟอร์ม
  onSubmit(): void {
    this.submitSuccess = null;
    this.submitError = null;

    if (this.couponForm.invalid) {
      this.submitError = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.couponService.createCoupon(this.couponForm.value).subscribe({
      next: (response) => {
        alert('เพิ่มคูปองสำเร็จ!');
        this.submitSuccess = `สร้างคูปอง "${response.data.name_code}" สำเร็จ!`;
        this.couponForm.reset({
          discount_type: 'percent',
          min_value: 0
        });
      },
      error: (err) => {
        this.submitError = err.error?.details || 'เกิดข้อผิดพลาดในการสร้างคูปอง';
      }
    });
  }

  // ฟังก์ชันสำหรับเปิด Modal และดึงข้อมูล
  openModal(): void {
    this.fetchError = null;
    this.isModalOpen = true;
    this.couponService.getAllCoupons().subscribe({
      next: (response) => {
        this.allCoupons = response.data;
      },
      error: (err) => {
        this.fetchError = 'ไม่สามารถดึงข้อมูลคูปองได้';
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
