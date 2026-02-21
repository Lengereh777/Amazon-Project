# Amazon Clone - Complete Learning Guide

A comprehensive documentation covering the Amazon Clone project built with React (Frontend) and Node.js/Firebase (Backend).

---

## Table of Contents

### Part 1: Frontend Development
1. [Introduction](#introduction)
2. [Header Component](#header-component)
3. [Carousel Effect](#carousel-effect)
4. [Category Component](#category-component)
5. [Single Product Component](#single-product-component)
6. [Header Routing](#header-routing)
7. [Category Routing](#category-routing)
8. [Detail Page Routing](#detail-page-routing)
9. [Loading Functionality Integration](#loading-functionality-integration)
10. [Detail Page Styling](#detail-page-styling)
11. [useReducer Hook and UseContext API](#usereducer-hook-and-usecontext-api)
12. [Add to Cart Functionality](#add-to-cart-functionality)
13. [Header Sticky Implementation](#header-sticky-implementation)
14. [Cart Page](#cart-page)

### Part 2: Backend Development
1. [Setting Up Firebase](#setting-up-firebase)
2. [Enabling Firebase Authentication](#enabling-firebase-authentication)
3. [Building Auth Page UI](#building-auth-page-ui)
4. [Authentication Functionality](#authentication-functionality)
5. [Sign Out, Loading and Error States](#sign-out-loading-and-error-states)
6. [Setting Up Stripe](#setting-up-stripe)
7. [Installing Firebase Tools CLI](#installing-firebase-tools-cli)
8. [Backend Payment API with Firebase Functions](#backend-payment-api-with-firebase-functions)
9. [Refactoring Backend Payment API](#refactoring-backend-payment-api)
10. [Building Payment Page UI](#building-payment-page-ui)
11. [Client Side Payment Functionality](#client-side-payment-functionality)
12. [Route Protection](#route-protection)
13. [Orders Page](#orders-page)
14. [Deployment Guides](#deployment-guides)

---

# Part 1: Frontend Development

## Introduction

This Amazon Clone is a full-stack e-commerce application that mimics the core functionality of Amazon's shopping experience. The frontend is built with React, utilizing modern hooks and context API for state management.

### Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header/          # Navigation header
│   │   ├── Carousel/        # Image carousel/slider
│   │   ├── Category/        # Product categories
│   │   ├── products/        # Product-related components
│   │   └── ProtectedRoute/  # Route protection
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── CartContext.jsx  # Shopping cart state
│   ├── pages/               # Page components
│   │   ├── Auth/            # Login/Register
│   │   ├── Cart/            # Shopping cart
│   │   ├── Payment/         # Checkout
│   │   ├── Orders/          # Order history
│   │   └── ProductDetail/   # Product details
│   ├── Api/                 # API integration
│   └── config/              # Configuration files
```

### Key Technologies
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **React Icons** - Icon library
- **Material UI** - Rating components
- **react-responsive-carousel** - Image carousel
- **Vite** - Build tool

---

## Header Component

The Header component is the main navigation bar that appears at the top of every page. It provides search functionality, user account access, and cart information.

### File Location
[`Frontend/src/components/Header/Header.jsx`](Amazon-project/Frontend/src/components/Header/Header.jsx)

### Key Features

1. **Logo and Branding** - Amazon logo with home link
2. **Delivery Location** - Shows delivery destination
3. **Search Bar** - Product search with category filter
4. **Account Menu** - User authentication status and dropdown
5. **Cart Icon** - Shopping cart with item count
6. **Navigation Links** - Secondary navigation menu

### Code Implementation

```jsx
import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaBars, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="amz-header">
      {/* Top Navigation */}
      <div className="amz-header-top">
        <div className="amz-container">
          {/* Logo */}
          <Link to="/" className="nav-box amz-logo">
            <img src="https://pngimg.com/uploads/amazon/amazon_PNG25.png" alt="Amazon Logo" />
          </Link>

          {/* Search Bar */}
          <div className="amz-search-container">
            <select className="amz-search-select">
              <option>All</option>
              <option>Electronics</option>
              <option>Books</option>
            </select>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon"
              />
              <button type="submit"><FaSearch /></button>
            </form>
          </div>

          {/* Account & Cart */}
          <div className="amz-right-nav">
            <div className="nav-box amz-account" onClick={() => setAccountMenuOpen(!accountMenuOpen)}>
              <span>Hello, {user ? user.email.split('@')[0] : 'Sign in'}</span>
              <span>Account & Lists <FaChevronDown /></span>
              {accountMenuOpen && user && (
                <div className="amz-dropdown">
                  <button onClick={logout}>Sign Out</button>
                </div>
              )}
            </div>
            <Link to="/cart" className="nav-box amz-cart">
              <span className="cart-count">{getCartCount()}</span>
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| `useState` | Manages local component state for search query and menu toggle |
| `useNavigate` | Programmatic navigation for search results |
| `useCart` | Custom hook to access cart context |
| `useAuth` | Custom hook to access authentication context |
| Conditional Rendering | Shows different UI based on user authentication status |

---

## Carousel Effect

The Carousel component displays a rotating banner of promotional images on the homepage.

### File Location
[`Frontend/src/components/Carousel/CarouselEffec.jsx`](Amazon-project/Frontend/src/components/Carousel/CarouselEffec.jsx)

### Implementation

```jsx
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carousel.module.css";
import { images } from "./img/data";

function CarouselEffect() {
  return (
    <section className="container-fluid p-0">
      <div className={styles.wrapper}>
        <Carousel
          autoPlay
          infiniteLoop
          interval={5000}
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          swipeable
          emulateTouch
        >
          {images.map((img, index) => (
            <div key={index} className={styles.slide}>
              <img src={img} alt={`slide-${index}`} className={styles.image} />
              <div className={styles.overlay}></div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
```

### Carousel Props Explained

| Prop | Value | Purpose |
|------|-------|---------|
| `autoPlay` | true | Automatically advances slides |
| `infiniteLoop` | true | Continues from start after last slide |
| `interval` | 5000 | Time between slide transitions (5 seconds) |
| `showThumbs` | false | Hides thumbnail navigation |
| `showIndicators` | false | Hides dot indicators |
| `swipeable` | true | Enables touch/swipe navigation |
| `emulateTouch` | true | Enables mouse drag navigation |

### CSS Module Styling

```css
/* Carousel.module.css */
.wrapper {
  position: relative;
  width: 100%;
}

.slide {
  position: relative;
}

.image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
}
```

---

## Category Component

The Category component displays product category cards on the homepage, allowing users to browse by category.

### File Location
[`Frontend/src/components/Category/Category.jsx`](Amazon-project/Frontend/src/components/Category/Category.jsx)

### Implementation

```jsx
import React from 'react';
import { categoryInfos } from './CategoryInfos';
import CategoryCard from './CategoryCard';
import './Category.css';

function Category() {
  return (
    <section className="category__container">
      {categoryInfos.map((infos) => (
        <CategoryCard key={infos.title} data={infos} />
      ))}
    </section>
  );
}
```

### CategoryCard Component

```jsx
// CategoryCard.jsx
function CategoryCard({ data }) {
  const { title, image, categoryLink } = data;
  
  return (
    <div className="category-card">
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <Link to={categoryLink}>Shop now</Link>
    </div>
  );
}
```

### Category Data Structure

```javascript
// CategoryInfos.js
export const categoryInfos = [
  {
    title: "Electronics",
    image: "electronics.jpg",
    categoryLink: "/category/electronics"
  },
  {
    title: "Books",
    image: "books.jpg",
    categoryLink: "/category/books"
  },
  // ... more categories
];
```

---

## Single Product Component

The ProductCard component displays individual product information in a card format.

### File Location
[`Frontend/src/components/products/ProductCard.jsx`](Amazon-project/Frontend/src/components/products/ProductCard.jsx)

### Implementation

```jsx
import React from 'react';
import Rating from '@mui/material/Rating';
import CurrencyFormat from './CurrencyFormat/CurrencyFormat';
import classes from './ProductCard.module.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const { image, title, id, rating, price } = product;
    const { addToCart, clearCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({
            id,
            title,
            price,
            image,
            rating,
            quantity: 1
        });
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        clearCart();
        addToCart({ id, title, price, image, rating, quantity: 1 });
        navigate("/payment");
    };

    const handleProductClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div className={classes.card__container}>
            <a href="" onClick={handleProductClick}>
                <img src={image} alt={title} />
            </a>
            <div>
                <h3>{title}</h3>
                <div className={classes.rating}>
                    <Rating value={rating.rate} precision={0.1} readOnly />
                    <small>{rating.count}</small>
                </div>
                <CurrencyFormat amount={price} />
                <div className={classes.buttonContainer}>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    <button onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}
```

### Key Features

| Feature | Description |
|---------|-------------|
| Product Image | Clickable image linking to product details |
| Star Rating | Material UI Rating component with precision |
| Currency Formatting | Custom component for price display |
| Add to Cart | Adds product to shopping cart |
| Buy Now | Bypasses cart, goes directly to checkout |

---

## Header Routing

The Header component includes navigation links that use React Router's `Link` component for client-side routing.

### Navigation Links Implementation

```jsx
// In Header.jsx
<nav className="bottom-nav-links">
  <Link to="/deals">Today's Deals</Link>
  <Link to="/service">Customer Service</Link>
  <Link to="/registry">Registry</Link>
  <Link to="/gift-cards">Gift Cards</Link>
  <Link to="/sell">Sell</Link>
</nav>
```

### Search Routing

```jsx
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    // Navigate to search results with query parameter
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }
};
```

### Why Use `Link` Instead of `<a>` Tags?

| `<a>` tag | `Link` component |
|-----------|------------------|
| Full page reload | Client-side navigation |
| Loses React state | Preserves React state |
| Slower navigation | Instant navigation |
| HTTP request to server | No server request needed |

---

## Category Routing

Category routing allows users to browse products by category.

### Route Definition

```jsx
// In Routing.jsx
<Route path="/category/:categoryName" element={<Results />} />
```

### Accessing Route Parameters

```jsx
// In Results.jsx
import { useParams } from 'react-router-dom';

function Results() {
  const { categoryName } = useParams();
  
  // Fetch products by category
  useEffect(() => {
    if (categoryName) {
      fetchProductsByCategory(categoryName);
    }
  }, [categoryName]);
  
  return (
    <div>
      <h2>{categoryName} Products</h2>
      {/* Product listings */}
    </div>
  );
}
```

---

## Detail Page Routing

Product detail pages use dynamic routing with the product ID as a parameter.

### Route Definition

```jsx
// In Routing.jsx
<Route path="/product/:productId" element={<ProductDetail />} />
```

### ProductDetail Component

```jsx
// ProductDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../Api/api";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(productId);
        if (result.error) {
          setError(result.message);
        } else {
          setProduct(result.data);
        }
      } catch (err) {
        setError("Product could not be loaded");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Render product details...
}
```

---

## Loading Functionality Integration

Loading states provide visual feedback during asynchronous operations.

### Implementation Pattern

```jsx
function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getProductById(productId);
        setProduct(result.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return <ProductView product={product} />;
}
```

### Loading Component Example

```jsx
// LoadingSpinner.jsx
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

```css
/* Loading.css */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #febd69;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## Detail Page Styling

The ProductDetail page includes comprehensive styling for product information display.

### Key Styling Areas

1. **Product Image Gallery** - Main image with thumbnails
2. **Product Information** - Title, price, rating, description
3. **Purchase Options** - Add to cart, buy now buttons
4. **Product Details** - Specifications, features
5. **Reviews Section** - Customer reviews and ratings

### CSS Structure

```css
/* ProductDetail.css */
.product-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-image-section {
  position: sticky;
  top: 100px;
}

.product-info-section {
  padding: 1rem;
}

.product-title {
  font-size: 1.5rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.product-price {
  font-size: 1.8rem;
  color: #B12704;
  margin: 1rem 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.add-to-cart-btn {
  background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
  border: 1px solid #a88734;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.buy-now-btn {
  background: linear-gradient(to bottom, #f6c45c, #e2a03a);
  border: 1px solid #9c7e31;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
```

---

## useReducer Hook and UseContext API

This project uses `useReducer` combined with `useContext` for complex state management, particularly for the shopping cart.

### Why useReducer + useContext?

| Scenario | useState | useReducer |
|----------|----------|------------|
| Simple state | ✅ Good | Overkill |
| Complex state logic | Difficult | ✅ Better |
| Multiple related values | Tedious | ✅ Organized |
| Predictable state changes | Manual | ✅ Action-based |

### CartContext Implementation

```jsx
// CartContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
    cartItems: [],
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";

// Reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { product } = action.payload;
            const existingItem = state.cartItems.find(item => item.id === product.id);

            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }

            return {
                ...state,
                cartItems: [...state.cartItems, { ...product, quantity: 1 }]
            };
        }

        case REMOVE_FROM_CART: {
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.productId)
            };
        }

        case UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            if (quantity === 0) {
                return {
                    ...state,
                    cartItems: state.cartItems.filter(item => item.id !== productId)
                };
            }
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            };
        }

        case CLEAR_CART: {
            return { ...state, cartItems: [] };
        }

        default:
            return state;
    }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Action creators
    const addToCart = (product) => {
        dispatch({ type: ADD_TO_CART, payload: { product } });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: REMOVE_FROM_CART, payload: { productId } });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: CLEAR_CART });
    };

    // Derived values
    const cartTotal = state.cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );

    const cartCount = state.cartItems.reduce((count, item) => 
        count + item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems: state.cartItems,
            cartTotal,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
```

### Reducer Pattern Explained

```
┌─────────────────┐
│   Component     │
│  (dispatches)   │
└────────┬────────┘
         │ Action
         ▼
┌─────────────────┐
│    Reducer      │
│ (pure function) │
└────────┬────────┘
         │ New State
         ▼
┌─────────────────┐
│   New State     │
│  (immutable)    │
└─────────────────┘
```

---

## Add to Cart Functionality

The add to cart feature allows users to add products to their shopping cart.

### Implementation Flow

```
User Click → handleAddToCart → dispatch(ADD_TO_CART) → Reducer → New State → UI Update
```

### ProductCard Add to Cart

```jsx
const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
        id,
        title,
        price,
        image,
        rating,
        quantity: 1
    });
};
```

### ProductDetail Add to Cart

```jsx
const handleAddToCart = (e) => {
    e.preventDefault();
    if (product) {
        const productWithQuantity = {
            ...product,
            quantity: selectedQuantity,
            size: selectedSize,
            color: selectedColor
        };
        addToCart(productWithQuantity);
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 2000);
    }
};
```

### LocalStorage Persistence

```jsx
// Load cart from localStorage on mount
useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(item => {
            dispatch({ type: ADD_TO_CART, payload: { product: item } });
        });
    }
}, []);

// Save cart to localStorage on change
useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartItems));
}, [state.cartItems]);
```

---

## Header Sticky Implementation

The header uses CSS positioning to stay fixed at the top of the page during scrolling.

### CSS Implementation

```css
/* Header.css */
.amz-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #131921;
}

.amz-header-top {
  background: #131921;
  padding: 10px 20px;
}

.amz-header-bottom {
  background: #232f3e;
  padding: 8px 20px;
}
```

### Key CSS Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `position` | sticky | Sticks to viewport when scrolling |
| `top` | 0 | Position at top of viewport |
| `z-index` | 1000 | Ensures header is above other content |
| `background` | #131921 | Amazon dark blue color |

---

## Cart Page

The Cart page displays all items in the shopping cart with quantity controls and checkout functionality.

### File Location
[`Frontend/src/pages/Cart/Cart.jsx`](Amazon-project/Frontend/src/pages/Cart/Cart.jsx)

### Cart Page Structure

```jsx
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/payment");
  };

  const calculateTax = () => cartTotal * 0.08;
  const calculateShipping = () => cartTotal > 50 ? 0 : 5.99;
  const calculateGrandTotal = () => cartTotal + calculateTax() + calculateShipping();

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Layout title="Shopping Cart">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <Link to="/">Continue Shopping</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart">
      <div className="cart-container">
        <div className="cart-main">
          <h1>Shopping Cart ({cartCount} items)</h1>
          
          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>${item.price}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <input value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div>Subtotal: ${cartTotal.toFixed(2)}</div>
          <div>Shipping: {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping()}`}</div>
          <div>Tax: ${calculateTax().toFixed(2)}</div>
          <div>Total: ${calculateGrandTotal().toFixed(2)}</div>
          <button onClick={handleCheckout}>
            {user ? "Proceed to Checkout" : "Sign in to Checkout"}
          </button>
        </div>
      </div>
    </Layout>
  );
};
```

### Cart Features

| Feature | Description |
|---------|-------------|
| Item List | Displays all cart items with images |
| Quantity Controls | Increment/decrement buttons |
| Remove Item | Delete individual items |
| Clear Cart | Remove all items |
| Price Summary | Subtotal, shipping, tax, total |
| Free Shipping | Orders over $50 ship free |
| Auth Check | Redirects to login if not authenticated |

---

# Part 2: Backend Development

## Setting Up Firebase

Firebase provides backend services including authentication, database, and cloud functions.

### Installation

```bash
npm install firebase
```

### Firebase Configuration

```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Environment Variables

```env
# .env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## Enabling Firebase Authentication

Firebase Authentication provides secure user authentication.

### Authentication Methods

1. **Email/Password** - Traditional email and password login
2. **Google Sign-In** - OAuth authentication
3. **Phone Authentication** - SMS verification

### Enable in Firebase Console

1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. Configure authorized domains

---

## Building Auth Page UI

The Auth page provides login and registration forms.

### File Location
[`Frontend/src/pages/Auth/Auth.jsx`](Amazon-project/Frontend/src/pages/Auth/Auth.jsx)

### Implementation

```jsx
import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const { login, register, loading } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignIn) {
        const result = await login(email, password);
        if (!result.success) setError(result.error);
      } else {
        const result = await register(email, password);
        if (!result.success) setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login">
      <Link to="/">
        <img className="login__logo" src="amazon-logo.png" alt="Amazon Logo" />
      </Link>

      <div className="login__container">
        <h1>{isSignIn ? "Sign In" : "Create Account"}</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleAuth}>
          <div>
            <label>E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : (isSignIn ? "Sign In" : "Create Account")}
          </button>
        </form>

        <button onClick={() => setIsSignIn(!isSignIn)}>
          {isSignIn ? "Create your Amazon Account" : "Already have an account? Sign In"}
        </button>
      </div>
    </section>
  );
}
```

---

## Authentication Functionality

The AuthContext manages authentication state across the application.

### File Location
[`Frontend/src/context/AuthContext.jsx`](Amazon-project/Frontend/src/context/AuthContext.jsx)

### Implementation

```jsx
import { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuthState, loginUser, registerUser, logoutUser } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to auth state changes
    useEffect(() => {
        const unsubscribe = subscribeToAuthState((authUser) => {
            if (authUser) {
                setUser({
                    uid: authUser.uid,
                    email: authUser.email,
                    displayName: authUser.displayName,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        const result = await loginUser(email, password);
        if (result.success) {
            setUser(result.user);
        } else {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    const register = async (email, password) => {
        setLoading(true);
        const result = await registerUser(email, password);
        if (result.success) {
            setUser(result.user);
        }
        setLoading(false);
        return result;
    };

    const logout = async () => {
        const result = await logoutUser();
        if (result.success) setUser(null);
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

---

## Sign Out, Loading and Error States

### Sign Out Implementation

```jsx
// In Header.jsx
const { user, logout } = useAuth();

// Dropdown menu with logout
{accountMenuOpen && user && (
  <div className="amz-dropdown">
    <button onClick={logout}>Sign Out</button>
  </div>
)}
```

### Loading States

```jsx
// Button with loading state
<button type="submit" disabled={loading}>
  {loading ? "Loading..." : "Sign In"}
</button>

// Page loading state
if (loading) {
  return <div className="loading">Loading...</div>;
}
```

### Error Handling

```jsx
// Display error message
{error && <div className="error-message">{error}</div>}

// Error handling in async function
try {
  const result = await login(email, password);
  if (!result.success) {
    setError(result.error);
  }
} catch (err) {
  setError("An unexpected error occurred");
}
```

---

## Setting Up Stripe

Stripe handles payment processing in the application.

### Installation

```bash
npm install stripe
```

### Backend Stripe Setup

```javascript
// Backend/index.js
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret_key);

// Create payment intent
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Stripe Configuration

```bash
# Set Stripe secret key in Firebase
firebase functions:config:set stripe.secret_key=sk_test_your_key
```

---

## Installing Firebase Tools CLI

The Firebase CLI allows deployment and management of Firebase projects.

### Installation

```bash
npm install -g firebase-tools
```

### Login

```bash
firebase login
```

### Initialize Project

```bash
firebase init
```

### Select Features
- Functions
- Firestore
- Hosting (optional)

---

## Backend Payment API with Firebase Functions

### File Location
[`Backend/index.js`](Amazon-project/Backend/index.js)

### Payment Processing Endpoint

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.processPayment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { token, amount, items, userId } = req.body;

            // Create charge
            const charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: token.id,
                description: `Amazon Clone Order`,
                receipt_email: token.email
            });

            // Create order in Firestore
            const orderData = {
                userId: userId,
                items: items,
                total: amount,
                paymentId: charge.id,
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const orderRef = await db.collection('orders').add(orderData);

            res.json({
                success: true,
                orderId: orderRef.id,
                paymentId: charge.id
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});
```

---

## Refactoring Backend Payment API

### Standalone Express Server

```javascript
// Backend/server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/processPayment', async (req, res) => {
    try {
        const { token, amount, items, userId } = req.body;

        const charge = await stripe.charges.create({
            amount,
            currency: 'usd',
            source: token.id,
            receipt_email: token.email
        });

        res.json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
```

---

## Building Payment Page UI

### File Location
[`Frontend/src/pages/Payment/Payment.jsx`](Amazon-project/Frontend/src/pages/Payment/Payment.jsx)

### Implementation

```jsx
import { useState } from 'react';
import Layout from '../Layout/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { processPayment } from '../../Api/stripe';

function Payment() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '', address: '', city: '', postalCode: '', phone: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '', expiryDate: '', cvv: '', cardholderName: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentResult = await processPayment({
        token: { id: 'tok_visa', email: user?.email },
        amount: getCartTotal() * 100,
        items: cartItems,
        userId: user?.uid
      });

      if (paymentResult.success) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="payment-container">
        <h2>Checkout</h2>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            Total: ${getCartTotal().toFixed(2)}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Shipping Information */}
          <div className="form-section">
            <h3>Shipping Information</h3>
            <input placeholder="Full Name" required
              value={shippingDetails.fullName}
              onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})} />
            <input placeholder="Address" required
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} />
            {/* More fields... */}
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h3>Payment Information</h3>
            <input placeholder="Card Number" required
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})} />
            {/* More fields... */}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
```

---

## Client Side Payment Functionality

### File Location
[`Frontend/src/Api/stripe.js`](Amazon-project/Frontend/src/Api/stripe.js)

### Implementation

```javascript
// Stripe API integration
export const processPayment = async (paymentData) => {
    try {
        const response = await fetch('http://localhost:5000/processPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Payment processing failed' };
    }
};

export const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const response = await fetch('http://localhost:5000/createPaymentIntent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Failed to create payment intent' };
    }
};
```

---

## Route Protection

Protected routes ensure only authenticated users can access certain pages.

### File Location
[`Frontend/src/components/ProtectedRoute/ProtectedRoute.jsx`](Amazon-project/Frontend/src/components/ProtectedRoute/ProtectedRoute.jsx)

### Implementation

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### Usage in Routing

```jsx
// Routing.jsx
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/payment" element={
        <ProtectedRoute><Payment /></ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute><Orders /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><Admin /></ProtectedRoute>
      } />
    </Routes>
  );
}
```

---

## Orders Page

The Orders page displays the user's order history.

### File Location
[`Frontend/src/pages/Orders/Orders.jsx`](Amazon-project/Frontend/src/pages/Orders/Orders.jsx)

### Implementation

```jsx
import { useState, useEffect } from 'react';
import Layout from "../Layout/Layout";
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../Api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data } = await getUserOrders(user.uid);
        if (data.success) {
          setOrders(data.orders);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout title="Your Orders">
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Yet</h2>
            <p>Start shopping to create your first order!</p>
          </div>
        ) : (
          <div className="orders-list">
            <h2>Your Order History</h2>
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <span>{item.title}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  Total: ${order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
```

---

## Deployment Guides

### Backend Deployment with Firebase Functions

```bash
# Deploy functions
firebase deploy --only functions
```

### Backend Deployment with Render

1. Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: amazon-clone-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: STRIPE_SECRET_KEY
        sync: false
```

2. Connect GitHub repository to Render
3. Configure environment variables
4. Deploy

### Frontend Deployment with Netlify

1. Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect GitHub repository to Netlify
3. Configure build settings
4. Set environment variables
5. Deploy

### Environment Variables for Production

```env
# Frontend (.env.production)
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Backend (.env)
STRIPE_SECRET_KEY=sk_live_your_key
FIREBASE_PROJECT_ID=your_project_id
```

---

## Summary

This Amazon Clone project demonstrates:

| Frontend | Backend |
|----------|---------|
| React Components | Firebase Authentication |
| React Router | Firestore Database |
| Context API | Stripe Payments |
| useReducer | Cloud Functions |
| CSS Modules | Express.js Server |
| Responsive Design | REST API |

### Key Learning Outcomes

1. **Component Architecture** - Building reusable, modular components
2. **State Management** - Using Context API and useReducer for complex state
3. **Routing** - Client-side navigation with React Router
4. **Authentication** - Firebase Auth integration
5. **Payments** - Stripe payment processing
6. **Database** - Firestore for data persistence
7. **Deployment** - Multiple deployment options

---

*This documentation covers all sections of the Amazon Clone project as outlined in the class videos.*
