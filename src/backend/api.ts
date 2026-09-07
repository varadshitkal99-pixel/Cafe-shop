// API layer - simulates network requests with realistic delays
import { db } from './database';
import {
  Product,
  CartItem,
  Order,
  ApiResponse,
  SearchFilters,
  CustomerInfo,
} from './models';

// Simulate network latency (200-600ms)
const simulateDelay = (ms?: number): Promise<void> => {
  const delay = ms ?? Math.floor(Math.random() * 400) + 200;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Generate unique ID
const generateId = (): string => {
  return `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ====================
// PRODUCTS API
// ====================

export const ProductsAPI = {
  async getAll(filters?: SearchFilters): Promise<ApiResponse<Product[]>> {
    await simulateDelay();

    try {
      let products = db.getProducts();

      // Apply filters
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.origin?.toLowerCase().includes(q) ?? false) ||
            p.flavorNotes.some((n) => n.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q) ||
            (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
        );
      }

      if (filters?.category) {
        products = products.filter((p) => p.category === filters.category);
      }

      if (filters?.roast) {
        products = products.filter((p) => p.roast === filters.roast);
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      return {
        success: true,
        data: products,
        meta: { total: products.length },
      };
    } catch (error) {
      return { success: false, error: 'Failed to fetch products' };
    }
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    await simulateDelay(150);

    const product = db.getProductById(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product };
  },
};

// ====================
// CART API
// ====================

export const CartAPI = {
  async getItems(): Promise<ApiResponse<CartItem[]>> {
    await simulateDelay(100);

    const cart = db.getCart();
    return { success: true, data: cart };
  },

  async addItem(product: Product, quantity: number = 1): Promise<ApiResponse<CartItem[]>> {
    await simulateDelay(150);

    const cart = db.getCart();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    db.saveCart(cart);
    return { success: true, data: cart };
  },

  async updateQuantity(productId: string, quantity: number): Promise<ApiResponse<CartItem[]>> {
    await simulateDelay(100);

    const cart = db.getCart();
    const existingIndex = cart.findIndex((item) => item.product.id === productId);

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(existingIndex, 1);
      } else {
        cart[existingIndex].quantity = quantity;
      }
    }

    db.saveCart(cart);
    return { success: true, data: cart };
  },

  async removeItem(productId: string): Promise<ApiResponse<CartItem[]>> {
    await simulateDelay(100);

    const cart = db.getCart();
    const filtered = cart.filter((item) => item.product.id !== productId);
    db.saveCart(filtered);
    return { success: true, data: filtered };
  },

  async clear(): Promise<ApiResponse<CartItem[]>> {
    await simulateDelay(100);

    db.clearCart();
    return { success: true, data: [] };
  },

  async getTotal(): Promise<ApiResponse<{ count: number; total: number }>> {
    await simulateDelay(50);

    const cart = db.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return { success: true, data: { count, total } };
  },
};

// ====================
// ORDERS API
// ====================

export const OrdersAPI = {
  async create(customer: CustomerInfo): Promise<ApiResponse<Order>> {
    await simulateDelay(800); // Longer delay for order processing

    const cart = db.getCart();
    if (cart.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order: Order = {
      id: generateId(),
      items: [...cart],
      total: Math.round(total * 100) / 100,
      customer,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    db.saveOrder(order);
    db.clearCart();

    return { success: true, data: order };
  },

  async getAll(): Promise<ApiResponse<Order[]>> {
    await simulateDelay(200);

    const orders = db.getOrders();
    return { success: true, data: orders };
  },

  async getById(id: string): Promise<ApiResponse<Order>> {
    await simulateDelay(150);

    const order = db.getOrderById(id);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, data: order };
  },
};
