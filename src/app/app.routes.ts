import { Routes } from '@angular/router';

// 1. นำเข้า Guards
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

// 2. Import Components (ใช้ชื่อแบบ PascalCase ตามมาตรฐาน)
import { Register } from './page/register/register';
import { Login } from './page/login/login';
import { Main } from './page/main/main';

import { Discounts } from './admin/discounts/discounts';
import { AddWallet } from './page/add-wallet/add-wallet';
import { Cart } from './page/cart/cart';
import { Home } from './page/home/home';
import { EditProfile } from './page/edit-proflie/edit-proflie';
import { Mainadmin } from './admin/mainadmin/mainadmin';
import { Addgame } from './admin/addgame/addgame';
import { Historyuser } from './admin/history/history';
import { adminGuard } from './guards/admin.guard';
import { GameDetails } from './page/game-details/game-details';
import { SearchResults } from './page/search-results/search-results';
import { GameDetailsadmin } from './admin/game-details/game-details';
import { EditGame } from './admin/edit-game/edit-game';
import { HistoryDetails } from './admin/history-details/history-details';

export const routes: Routes = [
  // --- Routes ที่ไม่ต้องล็อกอิน (Public Routes) ---
  {
    path: 'main',
    component: Main, // หน้าสาธารณะ ไม่ต้องมี Guard
  },
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard], // ป้องกันคนล็อกอินแล้วเข้าซ้ำ
  },
  {
    path: 'register',
    component: Register,
    canActivate: [loginGuard], // ป้องกันคนล็อกอินแล้วเข้าซ้ำ
  },

  // --- Routes สำหรับผู้ใช้ทั่วไปที่ต้องล็อกอินก่อน ---
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard], // ต้องล็อกอินก่อน
  },
  {
    path: 'addwallet',
    component: AddWallet,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
  },
  {
    path: 'editprofile',
    component: EditProfile,
    canActivate: [authGuard],
  },
  {
    path: 'SearchResults',
    component: SearchResults,
    canActivate: [authGuard],
  },
  {
    path: 'GameDetails/:id',
    component: GameDetails,
  },
  {
    path: 'GameDetailsadmin/:id',
    component: GameDetailsadmin,
  },
  { 
    path: 'edit-game/:id', 
    component: EditGame,
    canActivate: [authGuard] 
  },
  { 
    path: 'admin/user-details/:id', 
    component: HistoryDetails,
    canActivate: [authGuard] 
  },

  // --- Routes สำหรับ Admin ที่ต้องล็อกอินก่อน ---
  {
    path: 'Mainadmin', // ปรับ path เป็น kebab-case
    component: Mainadmin,
  },
  {
    path: 'addgame', // ปรับ path เป็น kebab-case
    component: Addgame,
  },
  {
    path: 'history',
    component: Historyuser,
  },
  {
    path: 'discounts',
    component: Discounts,
  },

  {
    path: 'GameType',
    loadComponent: () =>
      import('./page/game-type/game-type').then((m) => m.GameType),
    canActivate: [authGuard], // ถ้าต้องการ
  },
  // --- Route เริ่มต้นและ Wildcard ---
  {
    path: '',
    redirectTo: '/login', // หน้าเริ่มต้นคือ /main
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login', // หากเข้า path ที่ไม่มีอยู่จริง ให้กลับไปหน้า main
  },
];
