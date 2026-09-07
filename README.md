--- README.md 


+++ README.md 
# ☕ Ember & Brew — Specialty Coffee & Café E-Commerce

A modern, full-featured specialty coffee and café e-commerce web application based in Pune, India. Built with React, TypeScript, and Tailwind CSS, featuring a warm refined design with dark/light theme support.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blueviolet)
![Vite](https://img.shields.io/badge/Vite-6-yellow)

---

## ✨ Features

### 🛒 E-Commerce
- **Product Catalog** — Browse 14+ products including coffee, sandwiches, pastries, beverages & snacks
- **Search & Filter** — Real-time search with category filters (Single Origin, Blends, Sandwiches, Pastries, Beverages, Snacks)
- **Sort Options** — Sort by rating, price (low/high), or name
- **Product Details** — Detailed modal with descriptions, flavor notes, tags, and ratings
- **Shopping Cart** — Slide-out cart sidebar with quantity controls, item removal, and running totals
- **Simulated Checkout** — Complete checkout flow with form validation and order confirmation

### 🎨 Design & UX
- **Dark/Light Theme** — Toggle between warm cream (light) and rich espresso (dark) modes
- **Theme Persistence** — Saved to localStorage, respects system preference
- **Smooth Animations** — Fade-in, slide-up, and hover transitions throughout
- **Fully Responsive** — Optimized for mobile, tablet, and desktop
- **Warm Aesthetic** — Coffee-inspired color palette with refined typography

### 🏗️ Architecture
- **Backend Simulation** — Full API layer with simulated network latency (200-600ms)
- **Data Persistence** — localStorage-based database with seed data
- **Custom Hooks** — `useProducts`, `useCart`, `useOrders`, `useDebounce`, `useTheme`
- **TypeScript Models** — Strongly typed `Product`, `CartItem`, `Order`, `CustomerInfo`
- **Clean Separation** — Backend (`/backend`), hooks (`/hooks`), and UI (`App.tsx`)

---

## 🍽️ Products

### ☕ Coffee
| Product | Origin | Roast | Price |
|---------|--------|-------|-------|
| Ethiopian Yirgacheffe | Yirgacheffe, Ethiopia | Light | ₹1,576 |
| Colombian Supremo | Huila, Colombia | Medium | ₹1,369 |
| Midnight Velvet Blend | Brazil & Guatemala | Dark | ₹1,327 |
| Kenyan AA Peaberry | Nyeri, Kenya | Light | ₹1,908 |
| Morning Ritual Blend | Ethiopia & Costa Rica | Medium | ₹1,244 |
| Sumatra Mandheling | Sumatra, Indonesia | Dark | ₹1,452 |

### 🥪 Food & Beverages
| Product | Category | Price |
|---------|----------|-------|
| Paneer Tikka Sandwich | Sandwich | ₹497 |
| Club Sandwich | Sandwich | ₹539 |
| Butter Croissant | Pastry | ₹290 |
| Blueberry Muffin | Pastry | ₹331 |
| Iced Caramel Latte | Beverage | ₹414 |
| Masala Chai | Beverage | ₹290 |
| Avocado Toast | Snack | ₹456 |
| Chocolate Brownie | Pastry | ₹356 |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **localStorage** | Client-side data persistence |
| **Unsplash** | Product imagery |

---

## 📁 Project Structure

```
src/
├── backend/
│   ├── api.ts          # API layer with simulated delays
│   ├── database.ts     # localStorage database + seed data
│   ├── index.ts        # Barrel exports
│   └── models.ts       # TypeScript interfaces
├── hooks/
│   ├── useBackend.ts   # React hooks for API calls
│   └── useTheme.ts     # Dark/light theme management
├── App.tsx             # Main application component
├── main.tsx            # Entry point
└── index.css           # Global styles + CSS variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ember-and-brew.git
cd ember-and-brew

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎯 Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm install` | Install dependencies |

---

## 🌗 Theme System

The app supports both light and dark modes:

- **Light Mode** — Warm cream backgrounds with espresso text
- **Dark Mode** — Rich espresso backgrounds with cream text
- **Toggle** — Moon/sun icon in the header
- **Persistence** — Theme choice saved in localStorage
- **System Detection** — Auto-detects `prefers-color-scheme` on first visit

CSS custom properties power the theming system, ensuring smooth 300ms transitions between modes.

---

## 📍 About

**Ember & Brew** is a specialty coffee and café based in **Koregaon Park, Pune, India**. We source single-origin beans from around the world and pair them with artisanal food crafted fresh daily.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  Made with ☕ in Pune, India
</p>
