import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../core/services/product.service';
import type { Product, Category, Condition, ProductFilters } from '../../../../../shared/src/index';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, MatProgressSpinnerModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(false);
  total = signal(0);
  search = signal('');
  selectedCategory = signal<Category | ''>('');
  selectedCondition = signal<Condition | ''>('');

  readonly categories: { value: Category; label: string }[] = [
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];

  readonly conditions: { value: Condition; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  hasFilters = computed(
    () => this.search() !== '' || this.selectedCategory() !== '' || this.selectedCondition() !== '',
  );

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    const filters: ProductFilters = { sold: false };
    if (this.search()) filters.search = this.search();
    if (this.selectedCategory()) filters.category = this.selectedCategory() as Category;
    if (this.selectedCondition()) filters.condition = this.selectedCondition() as Condition;

    this.productService.getProducts(filters).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadProducts(), 380);
  }

  onCategory(event: Event) {
    this.selectedCategory.set((event.target as HTMLSelectElement).value as Category | '');
    this.loadProducts();
  }

  onCondition(event: Event) {
    this.selectedCondition.set((event.target as HTMLSelectElement).value as Condition | '');
    this.loadProducts();
  }

  clearFilters() {
    this.search.set('');
    this.selectedCategory.set('');
    this.selectedCondition.set('');
    this.loadProducts();
  }

  formatPrice(cents: number): number {
    return cents / 100;
  }
}
