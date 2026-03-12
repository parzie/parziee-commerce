import { Injectable, signal, computed, effect } from '@angular/core';
import type { Product } from '../../../../../shared/src/index';

export interface CartEntry {
  product: Product;
  quantity: number;
}

const STORAGE_KEY = 'parzie-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartEntry[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((s, e) => s + e.quantity, 0));
  readonly subtotal = computed(() =>
    this._items().reduce((s, e) => s + e.product.price * e.quantity, 0),
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items())));
  }

  addToCart(product: Product) {
    const idx = this._items().findIndex((e) => e.product.id === product.id);
    if (idx >= 0) {
      this._items.update((items) =>
        items.map((e, i) => (i === idx ? { ...e, quantity: e.quantity + 1 } : e)),
      );
    } else {
      this._items.update((items) => [...items, { product, quantity: 1 }]);
    }
  }

  updateQuantity(productId: string, delta: number) {
    this._items.update((items) =>
      items
        .map((e) => (e.product.id === productId ? { ...e, quantity: e.quantity + delta } : e))
        .filter((e) => e.quantity > 0),
    );
  }

  removeFromCart(productId: string) {
    this._items.update((items) => items.filter((e) => e.product.id !== productId));
  }

  clearCart() {
    this._items.set([]);
  }

  private loadFromStorage(): CartEntry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
