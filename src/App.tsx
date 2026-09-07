import { useState, useMemo } from 'react';
import { useProducts, useCart, useOrders, useDebounce } from './hooks/useBackend';
import type { Product, SearchFilters, CustomerInfo } from './backend';

// ====================
// APP COMPONENT
// ====================
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRoast, setActiveRoast] = useState<string>('all');
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
    roast: activeRoast !== 'all' ? activeRoast as 'light' | 'medium' | 'dark' : undefined,
    sortBy: sortBy as SearchFilters['sortBy'],
  }), [debouncedSearch, activeCategory, activeRoast, sortBy]);

  const { products, loading } = useProducts(filters);
  const { items: cartItems, total: cartTotal, count: cartCount, addItem, updateQuantity, removeItem, clearCart } = useCart();
  const { submitting, lastOrder, createOrder, setLastOrder } = useOrders();

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
    <div className="min-h-screen bg-[#faf6f1] text-[#2c1810]">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[100] fade-in">
          <div className="bg-[#2c1810] text-[#faf6f1] px-5 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-[#c4883a]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf6f1]/95 backdrop-blur-md border-b border-[#d4a574]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5c3d2e] rounded-full flex items-center justify-center">
                <span className="text-[#c4883a] text-lg sm:text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#2c1810] tracking-tight">Ember & Brew</h1>
                <p className="text-[10px] sm:text-xs text-[#5c3d2e]/60 tracking-widest uppercase">Pune, India</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c3d2e]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search coffee, sandwiches, pastries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 focus:border-[#c4883a] transition-all"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2.5 sm:p-3 bg-[#5c3d2e] text-[#faf6f1] rounded-full hover:bg-[#3d2518] transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c4883a] text-[#2c1810] text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c3d2e]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search coffees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 focus:border-[#c4883a] transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2c1810] via-[#3d2518] to-[#5c3d2e] text-[#faf6f1]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#c4883a] blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#d4a574] blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-[#c4883a] text-sm font-medium tracking-widest uppercase mb-3">📍 Pune, India</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
              Crafted with Love,<br />
              <span className="text-[#c4883a]">Served Fresh Daily</span>
            </h2>
            <p className="text-[#faf6f1]/70 text-base sm:text-lg leading-relaxed max-w-lg">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#5c3d2e] text-[#faf6f1] shadow-md'
                    : 'bg-white text-[#5c3d2e] border border-[#d4a574]/30 hover:border-[#5c3d2e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Roast Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Any Roast' },
              { value: 'light', label: '☀️ Light' },
              { value: 'medium', label: '🌤️ Medium' },
              { value: 'dark', label: '🌙 Dark' },
            ].map((roast) => (
              <button
                key={roast.value}
                onClick={() => setActiveRoast(roast.value)}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  activeRoast === roast.value
                    ? 'bg-[#c4883a] text-[#2c1810] shadow-md font-medium'
                    : 'bg-white text-[#5c3d2e] border border-[#d4a574]/30 hover:border-[#c4883a]'
                }`}
              >
                {roast.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="sm:ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-[#d4a574]/30 rounded-lg text-sm text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40"
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
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-[#d4a574]/20"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#d4a574]/20 rounded w-3/4"></div>
                  <div className="h-3 bg-[#d4a574]/20 rounded w-1/2"></div>
                  <div className="h-8 bg-[#d4a574]/20 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#5c3d2e] mb-2">No coffees found</h3>
            <p className="text-[#5c3d2e]/60">Try adjusting your filters or search terms</p>
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
      <footer className="bg-[#2c1810] text-[#faf6f1]/70 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">☕</span>
                <span className="text-lg font-bold text-[#faf6f1]">Ember & Brew</span>
              </div>
              <p className="text-sm leading-relaxed">
                Specialty coffee roasted with care. Every cup tells a story of origin, craft, and community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#faf6f1] mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-[#c4883a] transition-colors">Our Story</button></li>
                <li><button className="hover:text-[#c4883a] transition-colors">Subscriptions</button></li>
                <li><button className="hover:text-[#c4883a] transition-colors">Brewing Guides</button></li>
                <li><button className="hover:text-[#c4883a] transition-colors">Wholesale</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#faf6f1] mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-[#c4883a] transition-colors">Instagram</button></li>
                <li><button className="hover:text-[#c4883a] transition-colors">Twitter</button></li>
                <li><button className="hover:text-[#c4883a] transition-colors">Newsletter</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#faf6f1]/10 mt-8 pt-8 text-center text-xs">
            <p>© 2024 Ember & Brew. All rights reserved. Backend-powered e-commerce.</p>
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
  const isCoffee = ['single-origin', 'blend', 'decaf'].includes(product.category);
  const roastLabel = product.roast ? { light: 'Light Roast', medium: 'Medium Roast', dark: 'Dark Roast' }[product.roast] : null;
  const roastColor = product.roast ? { light: 'bg-amber-100 text-amber-800', medium: 'bg-orange-100 text-orange-800', dark: 'bg-stone-200 text-stone-800' }[product.roast] : null;

  const categoryLabel: Record<string, string> = {
    sandwich: '🥪 Sandwich',
    pastry: '🥐 Pastry',
    beverage: '🥤 Beverage',
    snack: '🥑 Snack',
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden card-hover shadow-sm border border-[#d4a574]/10 slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden cursor-pointer group" onClick={onViewDetails}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isCoffee && roastLabel && roastColor && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roastColor}`}>
              {roastLabel}
            </span>
          )}
          {!isCoffee && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-[#5c3d2e] backdrop-blur-sm">
              {categoryLabel[product.category] || product.category}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {product.isVeg !== undefined && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 backdrop-blur-sm">
              🌿 Veg
            </span>
          )}
          {product.weight && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-[#5c3d2e] backdrop-blur-sm">
              {product.weight}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-[#2c1810] text-lg leading-tight">{product.name}</h3>
            <p className="text-sm text-[#5c3d2e]/60 mt-0.5">{product.origin || categoryLabel[product.category] || ''}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-[#c4883a]">★</span>
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Flavor Notes / Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {product.flavorNotes.map((note) => (
            <span key={note} className="px-2 py-0.5 bg-[#faf6f1] text-[#5c3d2e]/70 text-xs rounded-full border border-[#d4a574]/20">
              {note}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#d4a574]/10">
          <span className="text-xl font-bold text-[#2c1810]">₹{(product.price * 83).toFixed(0)}</span>
          <button
            onClick={onAddToCart}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5c3d2e] text-[#faf6f1] rounded-lg text-sm font-medium hover:bg-[#3d2518] transition-all active:scale-95"
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
      <div className="absolute inset-0 bg-[#2c1810]/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
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
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2c1810]">{product.name}</h2>
              <p className="text-[#5c3d2e]/60 mt-1">{product.origin || product.category.replace('-', ' ')}</p>
            </div>
            <div className="flex items-center gap-1 bg-[#faf6f1] px-3 py-1.5 rounded-full">
              <span className="text-[#c4883a]">★</span>
              <span className="font-medium text-sm">{product.rating}</span>
              <span className="text-[#5c3d2e]/40 text-xs">({product.reviewCount})</span>
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
              <span key={tag} className="px-2.5 py-1 bg-[#faf6f1] text-[#5c3d2e]/60 text-xs rounded-full border border-[#d4a574]/20 capitalize">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-[#5c3d2e]/80 leading-relaxed mb-6">{product.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {product.roast && (
              <div className="bg-[#faf6f1] rounded-xl p-3 text-center">
                <p className="text-xs text-[#5c3d2e]/50 uppercase tracking-wide">Roast</p>
                <p className="font-semibold text-[#2c1810] capitalize mt-1">{product.roast}</p>
              </div>
            )}
            {product.weight && (
              <div className="bg-[#faf6f1] rounded-xl p-3 text-center">
                <p className="text-xs text-[#5c3d2e]/50 uppercase tracking-wide">Size</p>
                <p className="font-semibold text-[#2c1810] mt-1">{product.weight}</p>
              </div>
            )}
            <div className="bg-[#faf6f1] rounded-xl p-3 text-center">
              <p className="text-xs text-[#5c3d2e]/50 uppercase tracking-wide">Category</p>
              <p className="font-semibold text-[#2c1810] capitalize mt-1">{product.category.replace('-', ' ')}</p>
            </div>
            <div className="bg-[#faf6f1] rounded-xl p-3 text-center">
              <p className="text-xs text-[#5c3d2e]/50 uppercase tracking-wide">Status</p>
              <p className="font-semibold text-[#8b9e82] mt-1">In Stock</p>
            </div>
          </div>

          {/* Flavor Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#5c3d2e] uppercase tracking-wide mb-2">Flavor Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note) => (
                <span key={note} className="px-3 py-1.5 bg-[#c4883a]/10 text-[#5c3d2e] text-sm rounded-full border border-[#c4883a]/20">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#d4a574]/20">
            <div className="flex items-center border border-[#d4a574]/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 hover:bg-[#faf6f1] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-2.5 font-medium text-[#2c1810] min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 hover:bg-[#faf6f1] transition-colors"
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
      <div className="absolute inset-0 bg-[#2c1810]/50 backdrop-blur-sm"></div>
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#faf6f1] shadow-2xl slide-in-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#d4a574]/20">
          <h2 className="text-xl font-bold text-[#2c1810]">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#d4a574]/10 rounded-full transition-colors">
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
              <p className="text-[#5c3d2e]/60">Your cart is empty</p>
              <p className="text-sm text-[#5c3d2e]/40 mt-1">Add some delicious coffee!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 bg-white rounded-xl p-3 shadow-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#2c1810] text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-[#5c3d2e]/50 mt-0.5">{item.product.weight}</p>
                  <p className="font-semibold text-[#2c1810] mt-1">₹{(item.product.price * item.quantity * 83).toFixed(0)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-[#d4a574]/30 rounded-md overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-[#faf6f1] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-2.5 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-[#faf6f1] transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="ml-auto p-1.5 text-[#5c3d2e]/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
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
          <div className="p-5 border-t border-[#d4a574]/20 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#5c3d2e]/60">Subtotal</span>
              <span className="text-xl font-bold text-[#2c1810]">₹{(total * 83).toFixed(0)}</span>
            </div>
            <p className="text-xs text-[#5c3d2e]/40 mb-4">Shipping calculated at checkout</p>
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
      <div className="absolute inset-0 bg-[#2c1810]/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#d4a574]/20">
          <h2 className="text-xl font-bold text-[#2c1810]">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#faf6f1] rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Order Summary */}
          <div className="bg-[#faf6f1] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#5c3d2e] uppercase tracking-wide mb-3">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-[#5c3d2e]/70">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.product.price * item.quantity * 83).toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-[#d4a574]/20 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c3d2e]/70">Shipping</span>
                  <span className="font-medium">{shippingInr === 0 ? 'Free' : `₹${shippingInr}`}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold text-[#2c1810]">Total</span>
                  <span className="font-bold text-lg text-[#2c1810]">₹{(orderTotal * 83).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#5c3d2e] uppercase tracking-wide">Shipping Information</h3>

            <div>
              <label className="block text-sm font-medium text-[#5c3d2e] mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 ${errors.name ? 'border-red-300 bg-red-50' : 'border-[#d4a574]/30'}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c3d2e] mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 ${errors.email ? 'border-red-300 bg-red-50' : 'border-[#d4a574]/30'}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c3d2e] mb-1">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 ${errors.address ? 'border-red-300 bg-red-50' : 'border-[#d4a574]/30'}`}
                placeholder="123 Coffee Street"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#5c3d2e] mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 ${errors.city ? 'border-red-300 bg-red-50' : 'border-[#d4a574]/30'}`}
                  placeholder="Portland"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c3d2e] mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40 ${errors.zipCode ? 'border-red-300 bg-red-50' : 'border-[#d4a574]/30'}`}
                  placeholder="97201"
                />
                {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c3d2e] mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#d4a574]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c4883a]/40"
                placeholder="(555) 123-4567"
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

          <p className="text-xs text-center text-[#5c3d2e]/40">
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
      <div className="absolute inset-0 bg-[#2c1810]/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl slide-up text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-[#8b9e82]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#8b9e82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[#2c1810] mb-2">Order Confirmed!</h2>
        <p className="text-[#5c3d2e]/60 mb-6">Thank you! Your order is being prepared at our Pune café.</p>

        <div className="bg-[#faf6f1] rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#5c3d2e]/60">Order ID</span>
            <span className="font-mono text-xs font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#5c3d2e]/60">Items</span>
            <span className="font-medium">{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-[#d4a574]/20 pt-2 mt-2">
            <span className="font-semibold text-[#2c1810]">Total</span>
            <span className="font-bold text-[#2c1810]">₹{(order.total * 83).toFixed(0)}</span>
          </div>
        </div>

        <button onClick={onDismiss} className="w-full btn-primary">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
