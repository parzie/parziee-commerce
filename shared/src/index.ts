// ─── Value types ──────────────────────────────────────────────────────────────

export type Category =
  | 'clothing'
  | 'electronics'
  | 'books'
  | 'furniture'
  | 'sports'
  | 'other';

export type Condition = 'new' | 'like-new' | 'good' | 'fair';

export type UserRole = 'admin' | 'seller' | 'buyer';

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  description: string;
  /** Price in cents (integer). Divide by 100 before displaying. */
  price: number;
  images: string[];
  category: Category;
  condition: Condition;
  sold: boolean;
  sellerId: string;
  createdAt: string; // ISO string for JSON transport
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = void> {
  data?: T;
  message?: string;
  error?: string;
}

// ─── DTOs & filters ───────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: Category;
  condition?: Condition;
  /** Min price in cents */
  minPrice?: number;
  /** Max price in cents */
  maxPrice?: number;
  search?: string;
  sold?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductDto {
  title: string;
  description: string;
  /** Price in cents */
  price: number;
  images: string[];
  category: Category;
  condition: Condition;
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  /** Price in cents */
  price?: number;
  images?: string[];
  category?: Category;
  condition?: Condition;
  sold?: boolean;
}
