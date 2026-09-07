// Custom hooks for connecting React to the backend API
import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductsAPI, CartAPI, OrdersAPI, db } from '../backend';
import type { Product, CartItem, Order, SearchFilters, CustomerInfo } from '../backend';

// Initialize database on first load
db.initialize();

// ====================
// useProducts
// ====================
export function useProducts(filters?: SearchFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await ProductsAPI.getAll(filters);
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError(response.error || 'Failed to load products');
    }
    setLoading(false);
  }, [filters?.query, filters?.category, filters?.roast, filters?.sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// ====================
// useProduct
// ====================
export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const response = await ProductsAPI.getById(id);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Product not found');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

// ====================
// useCart
// ====================
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const refreshCart = useCallback(async () => {
    const [itemsRes, totalRes] = await Promise.all([
      CartAPI.getItems(),
      CartAPI.getTotal(),
    ]);

    if (itemsRes.success && itemsRes.data) {
      setItems(itemsRes.data);
    }
    if (totalRes.success && totalRes.data) {
      setTotal(totalRes.data.total);
      setCount(totalRes.data.count);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    setLoading(true);
    const response = await CartAPI.addItem(product, quantity);
    if (response.success) {
      await refreshCart();
    }
    setLoading(false);
    return response;
  }, [refreshCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setLoading(true);
    const response = await CartAPI.updateQuantity(productId, quantity);
    if (response.success) {
      await refreshCart();
    }
    setLoading(false);
    return response;
  }, [refreshCart]);

  const removeItem = useCallback(async (productId: string) => {
    setLoading(true);
    const response = await CartAPI.removeItem(productId);
    if (response.success) {
      await refreshCart();
    }
    setLoading(false);
    return response;
  }, [refreshCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    const response = await CartAPI.clear();
    if (response.success) {
      setItems([]);
      setTotal(0);
      setCount(0);
    }
    setLoading(false);
    return response;
  }, []);

  return {
    items,
    loading,
    total,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };
}

// ====================
// useOrders
// ====================
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const response = await OrdersAPI.getAll();
    if (response.success && response.data) {
      setOrders(response.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (customer: CustomerInfo) => {
    setSubmitting(true);
    const response = await OrdersAPI.create(customer);
    if (response.success && response.data) {
      setLastOrder(response.data);
      await fetchOrders();
    }
    setSubmitting(false);
    return response;
  }, [fetchOrders]);

  return { orders, loading, submitting, lastOrder, createOrder, setLastOrder };
}

// ====================
// useDebounce
// ====================
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
