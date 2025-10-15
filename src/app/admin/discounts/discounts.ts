import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navadmin } from '../navadmin/navadmin';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CouponService } from '../../services/coupon.service';
import { DiscountCode, UpdateCouponPayload, CreateCouponPayload } from '../../model/api.model';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, Navadmin, ReactiveFormsModule],
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

  // ตัวแปรสำหรับเช็คสถานะการแก้ไข
  editingCouponId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService
  ) {
    // สร้างฟอร์มพร้อม Validation
    this.couponForm = this.fb.group({
      name_code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
      description: ['', Validators.required],
      discount_value: [null, [Validators.required, Validators.min(0)]],
      discount_type: ['percent', Validators.required],
      min_value: [0, [Validators.required, Validators.min(0)]],
      limit_usage: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  /**
   * จัดการการ Submit ฟอร์ม
   * จะตรวจสอบว่าเป็นโหมด "สร้าง" หรือ "แก้ไข" แล้วเรียกใช้ service ที่เหมาะสม
   */
  onSubmit(): void {
    this.submitSuccess = null;
    this.submitError = null;
    if (this.couponForm.invalid) {
      this.submitError = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    if (this.editingCouponId) {
      // --- โหมด Update ---
      const payload: UpdateCouponPayload = this.couponForm.value;
      this.couponService.updateCoupon(this.editingCouponId, payload).subscribe({
        next: (response) => {
          alert('อัปเดตคูปองสำเร็จ!');
          this.submitSuccess = `อัปเดตคูปอง "${response.data.name_code}" สำเร็จ!`;
          this.resetFormAndState();
          this.loadAllCoupons(); // โหลดข้อมูลใหม่เพื่ออัปเดตใน modal
        },
        error: (err) => {
          this.submitError = err.error?.details || 'เกิดข้อผิดพลาดในการอัปเดต';
        }
      });
    } else {
      // --- โหมด Create ---
      const payload: CreateCouponPayload = this.couponForm.getRawValue();
      this.couponService.createCoupon(payload).subscribe({
        next: (response) => {
          alert('เพิ่มคูปองสำเร็จ!');
          this.submitSuccess = `สร้างคูปอง "${response.data.name_code}" สำเร็จ!`;
          this.resetFormAndState();
        },
        error: (err) => {
          this.submitError = err.error?.details || 'เกิดข้อผิดพลาดในการสร้าง';
        }
      });
    }
  }

  /**
   * ถูกเรียกเมื่อกดปุ่ม "แก้ไข" ใน Modal
   * @param coupon ข้อมูลคูปองที่ต้องการแก้ไข
   */
  onEdit(coupon: DiscountCode): void {
    this.editingCouponId = coupon.did;
    this.couponForm.patchValue({
      name_code: coupon.name_code,
      description: coupon.description,
      discount_value: coupon.discount_value,
      discount_type: coupon.discount_type,
      min_value: coupon.min_value,
      limit_usage: coupon.limit_usage,
    });
    // this.couponForm.get('name_code')?.disable(); // ไม่ให้แก้ไขชื่อโค้ด
    this.closeModal();
    this.submitSuccess = null;
    this.submitError = null;
  }

  /**
   * ถูกเรียกเมื่อกดปุ่ม "ลบ" ใน Modal
   * @param couponId ID ของคูปองที่ต้องการลบ
   */
  onDelete(couponId: number): void {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโค้ดส่วนลดนี้?')) {
      this.couponService.deleteCoupon(couponId).subscribe({
        next: () => {
          alert('ลบคูปองสำเร็จ!');
          // ลบคูปองออกจาก array ในหน้าเว็บทันทีเพื่ออัปเดต UI
          this.allCoupons = this.allCoupons.filter(c => c.did !== couponId);
        },
        error: (err) => {
          alert('เกิดข้อผิดพลาดในการลบ');
          console.error('Delete coupon error:', err);
        }
      });
    }
  }

  /**
   * ถูกเรียกเมื่อกดปุ่ม "ยกเลิก" ขณะอยู่ในโหมดแก้ไข
   */
  cancelEdit(): void {
    this.resetFormAndState();
  }

  /**
   * เปิด Modal และโหลดข้อมูลคูปองทั้งหมด
   */
  openModal(): void {
    this.isModalOpen = true;
    this.loadAllCoupons();
  }

  /**
   * ปิด Modal
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * รีเซ็ตฟอร์มและสถานะการแก้ไขทั้งหมดกลับเป็นค่าเริ่มต้น
   */
  private resetFormAndState(): void {
    this.editingCouponId = null;
    this.couponForm.reset({
      discount_type: 'percent',
      min_value: 0
    });
    this.couponForm.get('name_code')?.enable(); // เปิดให้กรอกชื่อโค้ดได้อีกครั้ง
  }

  /**
   * โหลดข้อมูลคูปองทั้งหมดจาก API
   */
  private loadAllCoupons(): void {
    this.fetchError = null;
    this.couponService.getAllCoupons().subscribe({
      next: (response) => {
        this.allCoupons = response.data;
      },
      error: (err) => {
        this.fetchError = 'ไม่สามารถดึงข้อมูลคูปองได้';
        console.error('Fetch coupons error:', err);
      }
    });
  }
}