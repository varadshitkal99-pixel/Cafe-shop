import React, { useState, useMemo, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  weight: string;
  roast: string;
  description: string;
  notes: string[];
  emoji: string;
  rating: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Ethiopia',
    category: 'Single Origin',
    price: 24.99,
    weight: '340g',
    roast: 'Light',
    description: 'A bright and complex coffee from the birthplace of arabica. Grown at elevations above 1,800m in the Yirgacheffe region, this lot showcases the terroir of its origin with remarkable clarity.',
    notes: ['Blueberry', 'Jasmine', 'Bergamot', 'Honey'],
    emoji: '🫐',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    origin: 'Colombia',
    category: 'Single Origin',
    price: 21.99,
    weight: '340g',
    roast: 'Medium',
    description: 'Sourced from small farms in the Huila region, this Supremo grade coffee delivers a perfectly balanced cup with sweet caramel undertones and a velvety body.',
    notes: ['Caramel', 'Red Apple', 'Cocoa', 'Walnut'],
    emoji: '🍎',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Midnight Velvet Blend',
    origin: 'Brazil & Guatemala',
    category: 'Blend',
    price: 19.99,
    weight: '340g',
    roast: 'Dark',
    description: 'Our signature dark roast blend combines Brazilian naturals with Guatemalan highland beans. Rich, full-bodied, and perfect for espresso or French press.',
    notes: ['Dark Chocolate', 'Smoky Oak', 'Molasses', 'Dried Fig'],
    emoji: '🍫',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Kenyan AA Peaberry',
    origin: 'Kenya',
    category: 'Single Origin',
    price: 28.99,
    weight: '250g',
    roast: 'Light-Medium',
    description: 'Rare peaberry selection from the Nyeri highlands. Each bean is a single round seed, concentrating the intense fruit-forward flavors unique to Kenyan coffee.',
    notes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Brown Sugar'],
    emoji: '🍇',
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Morning Ritual Blend',
    origin: 'Ethiopia & Colombia',
    category: 'Blend',
    price: 17.99,
    weight: '340g',
    roast: 'Medium',
    description: 'A smooth, approachable blend designed for your daily ritual. Combines the fruitiness of washed Ethiopian with the sweetness of Colombian for a crowd-pleasing cup.',
    notes: ['Milk Chocolate', 'Toasted Almond', 'Orange Zest', 'Vanilla'],
    emoji: '☀️',
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Sumatra Mandheling',
    origin: 'Indonesia',
    category: 'Single Origin',
    price: 23.99,
    weight: '340g',
    roast: 'Dark',
    description: 'Wet-hulled in the traditional Giling Basah method, this Sumatran coffee offers an earthy, full-bodied experience with low acidity and deep, complex flavors.',
    notes: ['Cedar', 'Dark Cocoa', 'Tobacco', 'Earthy Spice'],
    emoji: '🌿',
    rating: 4.4,
  },
];

const categories = ['All', 'Single Origin', 'Blend'];
const roastLevels = ['All', 'Light', 'Light-Medium', 'Medium', 'Dark'];

// ─── App Component ───────────────────────────────────────────────────────────

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const completeCheckout = () => {
    setCheckoutComplete(true);
    setCart([]);
    setTimeout(() => {
      setIsCheckout(false);
      setIsCartOpen(false);
      setCheckoutComplete(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#faf6f1]/95 backdrop-blur-md border-b border-[#d4a574]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">☕</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#2c1810] tracking-tight leading-none">
                  Ember & Brew
                </h1>
                <p className="text-[10px] sm:text-xs text-[#5c3d2e]/60 tracking-widest uppercase">
                  Specialty Coffee
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#shop" className="text-sm font-medium text-[#5c3d2e] hover:text-[#c4883a] transition-colors">
                Shop
              </a>
              <a href="#about" className="text-sm font-medium text-[#5c3d2e] hover:text-[#c4883a] transition-colors">
                Our Story
              </a>
              <a href="#brew" className="text-sm font-medium text-[#5c3d2e] hover:text-[#c4883a] transition-colors">
                Brewing Guide
              </a>
            </nav>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-3 rounded-full hover:bg-[#d4a574]/10 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2c1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#c4883a] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-[#c4883a] font-medium tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4">
              Freshly Roasted • Small Batch
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#2c1810] leading-tight mb-4 sm:mb-6">
              Coffee that tells a{' '}
              <span className="text-[#c4883a]">story</span>
            </h2>
            <p className="text-base sm:text-lg text-[#5c3d2e]/70 leading-relaxed mb-6 sm:mb-8 max-w-lg">
              From farm to cup, we source the world's finest beans and roast them 
              with care. Each bag is a journey to the origins of exceptional coffee.
            </p>
            <a
              href="#shop"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Explore Our Coffees
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 text-6xl sm:text-8xl opacity-10 hidden sm:block">☕</div>
        <div className="absolute bottom-10 right-1/4 text-4xl opacity-5 hidden lg:block">🌿</div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search & Filters */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#2c1810]">
              Our Selection
            </h3>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5c3d2e]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search coffees, origins, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#5c3d2e] text-[#faf6f1] shadow-md'
                    : 'bg-white text-[#5c3d2e] border border-[#d4a574]/30 hover:border-[#c4883a] hover:text-[#c4883a]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onViewDetails={setSelectedProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-[#5c3d2e]/60 text-lg">No coffees match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-[#c4883a] font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#2c1810] text-[#faf6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c4883a] font-medium tracking-widest uppercase text-xs sm:text-sm mb-3">
                Our Philosophy
              </p>
              <h3 className="text-2xl sm:text-4xl font-bold mb-6 leading-tight">
                Every bean has a journey
              </h3>
              <p className="text-[#faf6f1]/70 leading-relaxed mb-4">
                We travel to origin, building relationships with farmers who share our 
                passion for quality. From the volcanic soils of Ethiopia to the misty 
                highlands of Colombia, we select only the top 2% of the world's coffee.
              </p>
              <p className="text-[#faf6f1]/70 leading-relaxed">
                Each batch is roasted in small quantities at our workshop, ensuring 
                peak freshness and allowing the unique character of each coffee to shine.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#5c3d2e]/50 rounded-2xl p-6 text-center">
                <span className="text-3xl mb-2 block">🌍</span>
                <p className="text-2xl font-bold text-[#c4883a]">12</p>
                <p className="text-sm text-[#faf6f1]/60">Countries</p>
              </div>
              <div className="bg-[#5c3d2e]/50 rounded-2xl p-6 text-center">
                <span className="text-3xl mb-2 block">👨‍🌾</span>
                <p className="text-2xl font-bold text-[#c4883a]">48</p>
                <p className="text-sm text-[#faf6f1]/60">Farm Partners</p>
              </div>
              <div className="bg-[#5c3d2e]/50 rounded-2xl p-6 text-center">
                <span className="text-3xl mb-2 block">🏆</span>
                <p className="text-2xl font-bold text-[#c4883a]">86+</p>
                <p className="text-sm text-[#faf6f1]/60">Cup Score</p>
              </div>
              <div className="bg-[#5c3d2e]/50 rounded-2xl p-6 text-center">
                <span className="text-3xl mb-2 block">📦</span>
                <p className="text-2xl font-bold text-[#c4883a]">24h</p>
                <p className="text-sm text-[#faf6f1]/60">Roast to Ship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c1810] border-t border-[#5c3d2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <span className="font-bold text-[#faf6f1]">Ember & Brew</span>
            </div>
            <p className="text-sm text-[#faf6f1]/40">
              © 2026 Ember & Brew. Crafted with care.
            </p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            addToCart(product);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar
          cart={cart}
          cartTotal={cartTotal}
          isCheckout={isCheckout}
          checkoutComplete={checkoutComplete}
          onClose={() => { setIsCartOpen(false); setIsCheckout(false); }}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          onCompleteCheckout={completeCheckout}
        />
      )}
    </div>
  );
}

// ─── Product Card Component ──────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  onViewDetails,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-[#d4a574]/10 card-hover slide-up group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Product Image Area */}
      <div
        className="relative h-48 sm:h-56 bg-gradient-to-br from-[#d4a574]/20 to-[#c4883a]/10 flex items-center justify-center cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </span>
        {/* Roast badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#5c3d2e]">
          {product.roast} Roast
        </span>
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#5c3d2e]/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#faf6f1]">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-[#2c1810] text-base sm:text-lg leading-tight">
            {product.name}
          </h4>
          <div className="flex items-center gap-0.5 shrink-0">
            <svg className="w-3.5 h-3.5 text-[#c4883a]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-[#5c3d2e]">{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-[#5c3d2e]/60 mb-3">
          {product.origin} • {product.weight}
        </p>

        {/* Tasting Notes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 bg-[#faf6f1] text-[#5c3d2e]/70 text-xs rounded-md border border-[#d4a574]/20"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#d4a574]/10">
          <span className="text-xl font-bold text-[#2c1810]">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5c3d2e] text-[#faf6f1] rounded-lg text-sm font-medium hover:bg-[#3d2518] transition-colors active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal Component ─────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2c1810]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
        >
          <svg className="w-4 h-4 text-[#2c1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image area */}
        <div className="h-56 sm:h-64 bg-gradient-to-br from-[#d4a574]/20 to-[#c4883a]/10 flex items-center justify-center rounded-t-3xl">
          <span className="text-8xl">{product.emoji}</span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#5c3d2e]/10 text-[#5c3d2e] text-xs font-medium rounded-full">
              {product.category}
            </span>
            <span className="px-2.5 py-0.5 bg-[#c4883a]/10 text-[#c4883a] text-xs font-medium rounded-full">
              {product.roast} Roast
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-[#2c1810] mb-1">
            {product.name}
          </h3>
          <p className="text-[#5c3d2e]/60 mb-4">
            {product.origin} • {product.weight}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#c4883a]' : 'text-[#d4a574]/30'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm font-medium text-[#5c3d2e] ml-1">{product.rating}</span>
          </div>

          <p className="text-[#5c3d2e]/80 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Tasting Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#2c1810] uppercase tracking-wider mb-2">
              Tasting Notes
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 bg-[#faf6f1] text-[#5c3d2e] text-sm rounded-lg border border-[#d4a574]/20"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t border-[#d4a574]/10">
            <div>
              <p className="text-sm text-[#5c3d2e]/60">Price</p>
              <p className="text-2xl font-bold text-[#2c1810]">${product.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar Component ──────────────────────────────────────────────────

function CartSidebar({
  cart,
  cartTotal,
  isCheckout,
  checkoutComplete,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onCompleteCheckout,
}: {
  cart: CartItem[];
  cartTotal: number;
  isCheckout: boolean;
  checkoutComplete: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  onCompleteCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2c1810]/50 backdrop-blur-sm" />

      {/* Sidebar */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#faf6f1] shadow-2xl slide-in-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#d4a574]/20">
          <h3 className="text-xl font-bold text-[#2c1810]">
            {isCheckout ? 'Checkout' : 'Your Cart'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4a574]/10 transition-colors"
          >
            <svg className="w-5 h-5 text-[#2c1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {checkoutComplete ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4 block">🎉</span>
              <h4 className="text-2xl font-bold text-[#2c1810] mb-2">Order Confirmed!</h4>
              <p className="text-[#5c3d2e]/60">
                Thank you for your order. Your coffee is being prepared with love.
              </p>
            </div>
          ) : isCheckout ? (
            <CheckoutForm cart={cart} cartTotal={cartTotal} onComplete={onCompleteCheckout} />
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4 block">🛒</span>
              <h4 className="text-lg font-semibold text-[#2c1810] mb-1">Your cart is empty</h4>
              <p className="text-[#5c3d2e]/60 text-sm">
                Discover our specialty coffees and add some to your cart.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemCard
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCheckout && !checkoutComplete && cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#d4a574]/20 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#5c3d2e]/60">Subtotal</span>
              <span className="text-xl font-bold text-[#2c1810]">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-[#5c3d2e]/60">Shipping</span>
              <span className="text-[#8b9e82] font-medium">Free</span>
            </div>
            <div className="flex items-center justify-between mb-5 pt-3 border-t border-[#d4a574]/10">
              <span className="font-semibold text-[#2c1810]">Total</span>
              <span className="text-2xl font-bold text-[#2c1810]">${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="w-full btn-primary text-center">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cart Item Card ──────────────────────────────────────────────────────────

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
}) {
  return (
    <div className="flex gap-4 p-3 bg-white rounded-xl border border-[#d4a574]/10">
      {/* Emoji thumbnail */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#d4a574]/20 to-[#c4883a]/10 rounded-xl flex items-center justify-center shrink-0">
        <span className="text-2xl sm:text-3xl">{item.product.emoji}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-[#2c1810] text-sm sm:text-base truncate">
          {item.product.name}
        </h5>
        <p className="text-xs text-[#5c3d2e]/60">{item.product.weight}</p>
        <p className="text-sm font-bold text-[#c4883a] mt-1">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-[#5c3d2e]/40 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5 bg-[#faf6f1] rounded-lg border border-[#d4a574]/20">
          <button
            onClick={() => onUpdateQuantity(item.product.id, -1)}
            className="w-7 h-7 flex items-center justify-center text-[#5c3d2e] hover:text-[#c4883a] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm font-medium text-[#2c1810] w-5 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.product.id, 1)}
            className="w-7 h-7 flex items-center justify-center text-[#5c3d2e] hover:text-[#c4883a] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Form ───────────────────────────────────────────────────────────

function CheckoutForm({
  cart,
  cartTotal,
  onComplete,
}: {
  cart: CartItem[];
  cartTotal: number;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white rounded-xl p-4 border border-[#d4a574]/10">
        <h4 className="font-semibold text-[#2c1810] text-sm mb-3">Order Summary</h4>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-[#5c3d2e]/70 truncate pr-2">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium text-[#2c1810] shrink-0">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 mt-3 border-t border-[#d4a574]/10">
          <span className="font-semibold text-[#2c1810]">Total</span>
          <span className="font-bold text-[#c4883a] text-lg">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="font-semibold text-[#2c1810] text-sm mb-3">Contact Information</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
            required
          />
        </div>
      </div>

      {/* Shipping */}
      <div>
        <h4 className="font-semibold text-[#2c1810] text-sm mb-3">Shipping Address</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Street Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h4 className="font-semibold text-[#2c1810] text-sm mb-3">Payment Details</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={formData.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#d4a574]/30 rounded-xl text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:outline-none focus:ring-2 focus:ring-[#c4883a]/30 focus:border-[#c4883a] transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="w-full btn-primary text-center text-base py-3.5">
        Place Order — ${cartTotal.toFixed(2)}
      </button>

      <p className="text-center text-xs text-[#5c3d2e]/40">
        🔒 This is a simulated checkout. No real payment will be processed.
      </p>
    </form>
  );
}
