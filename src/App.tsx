import { useState, useMemo } from 'react';
import { useProducts, useCart, useOrders, useDebounce } from './hooks/useBackend';
import { useTheme } from './hooks/useTheme';
import type { Product, SearchFilters, CustomerInfo } from './backend';

// ====================
// APP COMPONENT
// ====================
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [sortBy, setSortBy] = useState<string>('rating');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filters: SearchFilters = useMemo(() => ({
    query: debouncedSearch || undefined,
    category: activeCategory !== 'all' ? activeCategory as Product['category'] : undefined,
    sortBy: sortBy as SearchFilters['sortBy'],
  }), [debouncedSearch, activeCategory, sortBy]);

  const { products, loading } = useProducts(filters);
  const { items: cartItems, total: cartTotal, count: cartCount, addItem, updateQuantity, removeItem, clearCart } = useCart();
  const { submitting, lastOrder, createOrder, setLastOrder } = useOrders();
  const { theme, toggleTheme } = useTheme();

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAddToCart = async (product: Product) => {
    await addItem(product);
    showNotification(`${product.name} added to cart`);
  };

  const handleCheckout = async (customer: CustomerInfo) => {
    const response = await createOrder(customer);
    if (response.success) {
      setShowCheckout(false);
      setShowCart(false);
      setShowOrderSuccess(true);
    }
  };

  const handleDismissOrder = () => {
    setShowOrderSuccess(false);
    setLastOrder(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[100] fade-in">
          <div className="px-5 py-3 rounded-lg shadow-lg flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--color-accent)' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)', borderBottom: '1px solid var(--color-border-soft)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <span className="text-lg sm:text-xl" style={{ color: 'var(--color-accent)' }}>☕</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>Ember & Brew</h1>
                <p className="text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Pune, India</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search coffee, sandwiches, pastries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', boxShadow: 'none' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 sm:p-3 rounded-full transition-all active:scale-95 hover:scale-105"
                style={{ backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-text)' }}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2.5 sm:p-3 rounded-full transition-all active:scale-95"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text)' }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search coffee, sandwiches, pastries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--color-hero-overlay)' }}></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-accent)' }}></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-primary)' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--color-accent)' }}>📍 Pune, India</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--color-primary-text)' }}>
              Crafted with Love,<br />
              <span style={{ color: 'var(--color-accent)' }}>Served Fresh Daily</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: 'color-mix(in srgb, var(--color-primary-text) 70%, transparent)' }}>
              From single-origin estates to artisanal sandwiches and pastries — everything handcrafted at our Pune café, roasted and baked to perfection.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: '🍽️ All' },
              { value: 'single-origin', label: '☕ Single Origin' },
              { value: 'blend', label: '☕ Blends' },
              { value: 'sandwich', label: '🥪 Sandwiches' },
              { value: 'pastry', label: '🥐 Pastries' },
              { value: 'beverage', label: '🥤 Beverages' },
              { value: 'snack', label: '🥑 Snacks' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={
                  activeCategory === cat.value
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
                    : { backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="sm:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                <div className="h-56" style={{ backgroundColor: 'var(--color-bg-soft)' }}></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-bg-soft)' }}></div>
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-bg-soft)' }}></div>
                  <div className="h-8 rounded w-1/3" style={{ backgroundColor: 'var(--color-bg-soft)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No items found</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onViewDetails={() => setSelectedProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16" style={{ backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-text-muted)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">☕</span>
                <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Ember & Brew</span>
              </div>
              <p className="text-sm leading-relaxed">
                Specialty coffee and artisanal food, crafted with care in Pune. Every cup and bite tells a story of origin, craft, and community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>Our Story</button></li>
                <li><button className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>Subscriptions</button></li>
                <li><button className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>Café Menu</button></li>
                <li><button className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>Wholesale</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Visit Us</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 Koregaon Park, Pune 411001</li>
                <li>🕐 7:00 AM – 10:00 PM</li>
                <li>📞 +91 20 1234 5678</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-xs" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-faint)' }}>
            <p>© 2024 Ember & Brew, Pune. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => handleAddToCart(selectedProduct)}
        />
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar
          items={cartItems}
          total={cartTotal}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          items={cartItems}
          total={cartTotal}
          submitting={submitting}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
        />
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && lastOrder && (
        <OrderSuccessModal
          order={lastOrder}
          onDismiss={handleDismissOrder}
        />
      )}
    </div>
  );
}

// ====================
// PRODUCT CARD
// ====================
function ProductCard({ product, index, onViewDetails, onAddToCart }: {
  product: Product;
  index: number;
  onViewDetails: () => void;
  onAddToCart: () => void;
}) {
  const categoryLabel: Record<string, string> = {
    'single-origin': '☕ Single Origin',
    'blend': '☕ Blend',
    'decaf': '☕ Decaf',
    sandwich: '🥪 Sandwich',
    pastry: '🥐 Pastry',
    beverage: '🥤 Beverage',
    snack: '🥑 Snack',
  };

  return (
    <div
      className="rounded-2xl overflow-hidden card-hover shadow-sm slide-up"
      style={{ animationDelay: `${index * 80}ms`, backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-soft)' }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden cursor-pointer group" onClick={onViewDetails}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--color-text)' }}>
            {categoryLabel[product.category] || product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {product.isVeg !== undefined && (
            <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-green-100 text-green-800">
              🌿 Veg
            </span>
          )}
          {product.weight && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--color-text)' }}>
              {product.weight}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{product.origin || categoryLabel[product.category] || ''}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span style={{ color: 'var(--color-accent)' }}>★</span>
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Flavor Notes / Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {product.flavorNotes.map((note) => (
            <span key={note} className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'var(--color-chip-bg)', color: 'var(--color-chip-text)', border: '1px solid var(--color-chip-border)' }}>
              {note}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--color-border-soft)' }}>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>₹{(product.price * 83).toFixed(0)}</span>
          <button
            onClick={onAddToCart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================
// PRODUCT DETAIL MODAL
// ====================
function ProductDetailModal({ product, onClose, onAddToCart }: {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-overlay)' }}></div>
      <div
        className="relative rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-all shadow-md"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-elevated) 80%, transparent)', color: 'var(--color-text)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="h-64 sm:h-80 overflow-hidden rounded-t-2xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{product.name}</h2>
              <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>{product.origin || product.category.replace('-', ' ')}</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
              <span style={{ color: 'var(--color-accent)' }}>★</span>
              <span className="font-medium text-sm">{product.rating}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>({product.reviewCount})</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.isVeg && (
              <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">🌿 Vegetarian</span>
            )}
            {product.spiceLevel && (
              <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                {product.spiceLevel === 'mild' ? '🌶️ Mild' : product.spiceLevel === 'medium' ? '🌶️🌶️ Medium' : '🌶️🌶️🌶️ Spicy'}
              </span>
            )}
            {product.tags?.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-chip-bg)', color: 'var(--color-chip-text)', border: '1px solid var(--color-chip-border)' }}>
                {tag}
              </span>
            ))}
          </div>

          <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>{product.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {product.weight && (
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-faint)' }}>Size</p>
                <p className="font-semibold mt-1" style={{ color: 'var(--color-text)' }}>{product.weight}</p>
              </div>
            )}
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-faint)' }}>Category</p>
              <p className="font-semibold capitalize mt-1" style={{ color: 'var(--color-text)' }}>{product.category.replace('-', ' ')}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-faint)' }}>Status</p>
              <p className="font-semibold mt-1" style={{ color: 'var(--color-success)' }}>In Stock</p>
            </div>
          </div>

          {/* Flavor Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>Flavor Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note) => (
                <span key={note} className="px-3 py-1.5 text-sm rounded-full" style={{ backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-text)', border: '1px solid var(--color-accent-border)' }}>
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-2.5 font-medium min-w-[3rem] text-center" style={{ color: 'var(--color-text)' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) onAddToCart();
                onClose();
              }}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart — ₹{(product.price * quantity * 83).toFixed(0)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================
// CART SIDEBAR
// ====================
function CartSidebar({ items, total, onClose, onUpdateQuantity, onRemoveItem, onCheckout }: {
  items: { product: Product; quantity: number }[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 fade-in" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-overlay)' }}></div>
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md shadow-2xl slide-in-right flex flex-col"
        style={{ backgroundColor: 'var(--color-bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: 'var(--color-text)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛒</div>
              <p style={{ color: 'var(--color-text-muted)' }}>Your cart is empty</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-faint)' }}>Add some delicious coffee or food!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 rounded-xl p-3 shadow-sm" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>{item.product.name}</h4>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-faint)' }}>{item.product.weight}</p>
                  <p className="font-semibold mt-1" style={{ color: 'var(--color-text)' }}>₹{(item.product.price * item.quantity * 83).toFixed(0)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 transition-colors text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        −
                      </button>
                      <span className="px-2.5 py-1 text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 transition-colors text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="ml-auto p-1.5 rounded-md transition-all hover:text-red-500"
                      style={{ color: 'var(--color-text-faint)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5" style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>₹{(total * 83).toFixed(0)}</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-faint)' }}>Shipping calculated at checkout</p>
            <button onClick={onCheckout} className="w-full btn-primary flex items-center justify-center gap-2">
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================
// CHECKOUT MODAL
// ====================
function CheckoutModal({ items, total, submitting, onClose, onSubmit }: {
  items: { product: Product; quantity: number }[];
  total: number;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (customer: CustomerInfo) => void;
}) {
  const [form, setForm] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: '',
    city: 'Pune',
    zipCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const shippingInr = (total * 83) > 500 ? 0 : 49;
  const orderTotal = total + (shippingInr / 83);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-overlay)' }}></div>
      <div
        className="relative rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Checkout</h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: 'var(--color-text)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Order Summary */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-muted)' }}>Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.product.name} × {item.quantity}</span>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>₹{(item.product.price * item.quantity * 83).toFixed(0)}</span>
                </div>
              ))}
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>{shippingInr === 0 ? 'Free' : `₹${shippingInr}`}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>₹{(orderTotal * 83).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>Shipping Information</h3>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 bg-red-50' : ''}`}
                style={{ backgroundColor: errors.name ? undefined : 'var(--color-input-bg)', borderColor: errors.name ? undefined : 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                style={{ backgroundColor: errors.email ? undefined : 'var(--color-input-bg)', borderColor: errors.email ? undefined : 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.address ? 'border-red-300 bg-red-50' : ''}`}
                style={{ backgroundColor: errors.address ? undefined : 'var(--color-input-bg)', borderColor: errors.address ? undefined : 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="123 Coffee Street, Koregaon Park"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.city ? 'border-red-300 bg-red-50' : ''}`}
                  style={{ backgroundColor: errors.city ? undefined : 'var(--color-input-bg)', borderColor: errors.city ? undefined : 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="Pune"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>PIN Code</label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.zipCode ? 'border-red-300 bg-red-50' : ''}`}
                  style={{ backgroundColor: errors.zipCode ? undefined : 'var(--color-input-bg)', borderColor: errors.zipCode ? undefined : 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="411001"
                />
                {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Order...
              </>
            ) : (
              <>
                Place Order — ₹{(orderTotal * 83).toFixed(0)}
              </>
            )}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-faint)' }}>
            This is a simulated checkout. No real payment will be processed.
          </p>
        </form>
      </div>
    </div>
  );
}

// ====================
// ORDER SUCCESS MODAL
// ====================
function OrderSuccessModal({ order, onDismiss }: {
  order: { id: string; total: number; items: { product: Product; quantity: number }[]; createdAt: string };
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in" onClick={onDismiss}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--color-overlay)' }}></div>
      <div
        className="relative rounded-2xl max-w-md w-full shadow-2xl slide-up text-center p-8"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 15%, transparent)' }}>
          <svg className="w-8 h-8" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Order Confirmed!</h2>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>Thank you! Your order is being prepared at our Pune café.</p>

        <div className="rounded-xl p-4 mb-6 text-left" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: 'var(--color-text-muted)' }}>Order ID</span>
            <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-text)' }}>{order.id}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: 'var(--color-text-muted)' }}>Items</span>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 mt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Total</span>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>₹{(order.total * 83).toFixed(0)}</span>
          </div>
        </div>

        <button onClick={onDismiss} className="w-full btn-primary">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
