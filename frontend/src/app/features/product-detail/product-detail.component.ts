import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import type { Product } from '../../../../../shared/src/index';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  @Input() id!: string;

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);
  notFound = signal(false);
  selectedImage = signal(0);
  added = signal(false);

  ngOnInit() {
    this.productService.getProduct(this.id).subscribe({
      next: (res) => {
        this.product.set(res.data ?? null);
        if (!res.data) this.notFound.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }

  selectImage(index: number) {
    this.selectedImage.set(index);
  }

  formatPrice(cents: number): number {
    return cents / 100;
  }
}
