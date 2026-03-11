import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="parzie-container" style="padding-top: 3rem">
      <h1 class="parzie-display">Product {{ id }}</h1>
      <p style="color: var(--parzie-muted); margin-top: 1rem">Coming soon.</p>
    </div>
  `,
})
export class ProductDetailComponent {
  @Input() id!: string;
}
