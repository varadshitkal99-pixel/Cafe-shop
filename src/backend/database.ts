// Database layer with localStorage persistence
import { Product, Order, CartItem } from './models';

const STORAGE_KEYS = {
  PRODUCTS: 'ember_brew_products',
  CART: 'ember_brew_cart',
  ORDERS: 'ember_brew_orders',
  INITIALIZED: 'ember_brew_initialized',
};

// Seed product data
const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Ethiopian Yirgacheffe',
    origin: 'Yirgacheffe, Ethiopia',
    category: 'single-origin',
    price: 18.99,
    weight: '250g',
    roast: 'light',
    flavorNotes: ['Blueberry', 'Jasmine', 'Citrus'],
    description: 'A bright and complex coffee from the birthplace of coffee. Grown at elevations above 1,800m, this natural-process lot delivers an explosion of fruity aromatics with a silky body and lingering floral finish.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 'prod-002',
    name: 'Colombian Supremo',
    origin: 'Huila, Colombia',
    category: 'single-origin',
    price: 16.49,
    weight: '250g',
    roast: 'medium',
    flavorNotes: ['Caramel', 'Walnut', 'Red Apple'],
    description: 'Sourced from small farms in the Huila region, this washed-process coffee offers a perfectly balanced cup. Rich caramel sweetness meets bright acidity with a clean, nutty finish.',
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'prod-003',
    name: 'Midnight Velvet Blend',
    origin: 'Brazil & Guatemala',
    category: 'blend',
    price: 15.99,
    weight: '250g',
    roast: 'dark',
    flavorNotes: ['Dark Chocolate', 'Molasses', 'Toasted Almond'],
    description: 'Our signature dark roast blend combines Brazilian Santos with Guatemalan Antigua beans. The result is a bold, full-bodied cup with decadent chocolate notes and zero bitterness.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: 'prod-004',
    name: 'Kenyan AA Peaberry',
    origin: 'Nyeri, Kenya',
    category: 'single-origin',
    price: 22.99,
    weight: '250g',
    roast: 'light',
    flavorNotes: ['Blackcurrant', 'Tomato', 'Grapefruit'],
    description: 'An exceptional peaberry lot from the highlands of Nyeri. These rare single-bean cherries produce an intensely concentrated cup with wine-like complexity and vibrant acidity.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.9,
    reviewCount: 67,
  },
  {
    id: 'prod-005',
    name: 'Morning Ritual Blend',
    origin: 'Ethiopia & Costa Rica',
    category: 'blend',
    price: 14.99,
    weight: '250g',
    roast: 'medium',
    flavorNotes: ['Honey', 'Milk Chocolate', 'Orange Zest'],
    description: 'Designed for your daily ritual, this approachable blend combines Ethiopian brightness with Costa Rican sweetness. Smooth, versatile, and endlessly drinkable.',
    image: 'https://images.unsplash.com/photo-1442512595433-83297350b808?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.5,
    reviewCount: 312,
  },
  {
    id: 'prod-006',
    name: 'Sumatra Mandheling',
    origin: 'Sumatra, Indonesia',
    category: 'single-origin',
    price: 17.49,
    weight: '250g',
    roast: 'dark',
    flavorNotes: ['Cedar', 'Dark Cocoa', 'Earthy'],
    description: 'Wet-hulled in the traditional Giling Basah method, this Sumatran coffee delivers an unmistakable earthy depth. Full-bodied with herbal complexity and a syrupy mouthfeel.',
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.4,
    reviewCount: 156,
  },
];

class Database {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  initialize(): void {
    const isInitialized = this.getItem<boolean>(STORAGE_KEYS.INITIALIZED, false);
    if (!isInitialized) {
      this.setItem(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
      this.setItem(STORAGE_KEYS.CART, []);
      this.setItem(STORAGE_KEYS.ORDERS, []);
      this.setItem(STORAGE_KEYS.INITIALIZED, true);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  }

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  // Cart
  getCart(): CartItem[] {
    return this.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  saveCart(cart: CartItem[]): void {
    this.setItem(STORAGE_KEYS.CART, cart);
  }

  clearCart(): void {
    this.setItem(STORAGE_KEYS.CART, []);
  }

  // Orders
  getOrders(): Order[] {
    return this.getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.setItem(STORAGE_KEYS.ORDERS, orders);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  // Reset (for testing)
  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.initialize();
  }
}

export const db = new Database();
