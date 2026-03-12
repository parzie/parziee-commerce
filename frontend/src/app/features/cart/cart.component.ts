import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatButtonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private cartService = inject(CartService);

  items = this.cartService.items;
  subtotal = this.cartService.subtotal;

  updateQty(productId: string, delta: number) {
    this.cartService.updateQuantity(productId, delta);
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  formatPrice(cents: number): number {
    return cents / 100;
  }
}
