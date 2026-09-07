// Backend Models / Types

export interface Product {
  id: string;
  name: string;
  origin: string;
  category: 'single-origin' | 'blend' | 'decaf';
  price: number;
  weight: string;
  roast: 'light' | 'medium' | 'dark';
  flavorNotes: string[];
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
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
  category?: string;
  roast?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating';
}
