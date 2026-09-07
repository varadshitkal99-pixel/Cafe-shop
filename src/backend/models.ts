// Backend Models / Types

export type ProductCategory =
  | 'single-origin'
  | 'blend'
  | 'decaf'
  | 'sandwich'
  | 'pastry'
  | 'beverage'
  | 'snack';

export interface Product {
  id: string;
  name: string;
  origin?: string;
  category: ProductCategory;
  price: number;
  weight?: string;
  roast?: 'light' | 'medium' | 'dark';
  flavorNotes: string[];
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isVeg?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: CustomerInfo;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface SearchFilters {
  query?: string;
  category?: ProductCategory;
  roast?: 'light' | 'medium' | 'dark';
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating';
}
