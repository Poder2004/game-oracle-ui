import { Routes } from '@angular/router';
import { Register } from './page/register/register';
import { Login } from './page/login/login';
import { Main } from './page/main/main';

export const routes: Routes = [
     { path: 'login', component: Login },
    { path: 'register', component: Register },

    // (แนะนำ) กำหนดหน้าเริ่มต้น เมื่อไม่มี path
    { path: '', component: Main  }  
];
