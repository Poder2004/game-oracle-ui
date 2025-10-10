import { Injectable } from '@angular/core';

export interface CartItem {
  id?: number;  
  name: string;
  price: number;
  image?: string;

}

const CART_KEY = 'cartItems';

@Injectable({ providedIn: 'root' })
export class CartService {
  getItems(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  addItem(item: CartItem): void {
    const items = this.getItems();
    items.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  removeItem(index: number): void {
    const items = this.getItems();
    items.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  clear(): void {
    localStorage.removeItem(CART_KEY);
  }
}
