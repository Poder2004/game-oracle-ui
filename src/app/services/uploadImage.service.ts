import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImageUploads {
    private cloudName = 'ddcuq2vh9';
    private preset = 'avdweb-game';

    constructor(private http: HttpClient) { }

    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        // FIX 1: ปิด template string ด้วย backtick (`) ให้ถูกต้อง
        const filename = `userimage${Date.now()}_${Math.floor(Math.random() * 10000)}`; 
        
        formData.append('public_id', filename);
        formData.append('file', file);
        formData.append('upload_preset', this.preset);

        // FIX 2: แก้ไข URL ให้ถูกต้อง
        const observable = this.http.post<any>(
            `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
            formData
        );

        const response = await lastValueFrom(observable);
        return response.secure_url;
    }
}             