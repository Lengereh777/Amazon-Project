# Amazon Clone Frontend - Complete Guide

## Introduction

This is a comprehensive frontend guide for the Amazon clone project. The frontend is built with React 18.2.0, Vite 5.0.8, and React Router DOM 6.20.0. It features a modern UI with responsive design, shopping cart functionality, user authentication, and product management.

### Project Structure

```
Frontend/
├── src/
│   ├── Api/                    # API integration files
│   ├── assets/                 # Static assets (images, logos)
│   ├── components/             # Reusable components
│   │   ├── Carousel/          # Image carousel
│   │   ├── Category/          # Category display
│   │   ├── Footer/            # Footer component
│   │   ├── Header/            # Header component with navigation
│   │   ├── products/          # Product-related components
│   │   └── ProtectedRoute/    # Authentication protection
│   ├── config/                # Configuration files
│   ├── context/               # React Context API for state management
│   └── pages/                 # Page components
├── index.html                 # Entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── .gitignore                 # Git ignore configuration
```

### Key Dependencies

- **React 18.2.0**: UI library
- **React Router DOM 6.20.0**: Routing
- **react-responsive-carousel**: Image carousel
- **react-icons/fa**: Font Awesome icons
- **Vite 5.0.8**: Build tool

## Header Component

**File**: [`Frontend/src/components/Header/Header.jsx`](Frontend/src/components/Header/Header.jsx)

The Header component is the primary navigation bar for the application, featuring:

### Key Features

1. **Logo and Branding**: Amazon logo that links to home page
2. **Delivery Location**: Displays "Deliver to Ethiopia" with map marker icon
3. **Search Functionality**:
   - Search bar with category filter (All, Electronics, Books)
   - Search button with magnifying glass icon
   - Form submission that navigates to search results page
4. **Account Menu**:
   - Displays user email (if logged in) or "Sign in"
   - Dropdown menu with logout option for authenticated users
5. **Navigation Links**:
   - Returns & Orders
   - Cart (with item count indicator)
6. **Bottom Navigation Bar**:
   - All menu (hamburger icon)
   - Today's Deals
   - Customer Service
   - Registry
   - Gift Cards
   - Sell

### Technical Implementation

```javascript
// State management
const [searchQuery, setSearchQuery] = useState("");
const [accountMenuOpen, setAccountMenuOpen] = useState(false);

// Search handler
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }
};
```

### Styling

Located in [`Header.css`](Frontend/src/components/Header/Header.css), featuring:
- Responsive design
- Sticky positioning
- Dropdown menus
- Icon integration

## Carousel Effect

**File**: [`Frontend/src/components/Carousel/CarouselEffec.jsx`](Frontend/src/components/Carousel/CarouselEffec.jsx)

The carousel component uses `react-responsive-carousel` library to create an automatic slideshow:

### Features

- Auto-play with 5-second interval
- Infinite loop
- Swipeable on touch devices
- No thumbnails or indicators
- Smooth transitions
- Overlay for better text readability

### Implementation

```javascript
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carousel.module.css";
import { images } from "./img/data";

function CarouselEffect() {
  return (
    <section className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-12">
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
        </div>
      </div>
    </section>
  );
}

export default CarouselEffect;
```

### Images

Images are stored in the `img/` directory and configured in `data.js`:

```javascript
// data.js
export const images = [
  '10001.jpg',
  '10002.jpg',
  '10003.jpg',
  '10004.jpg',
  '10005.jpg'
].map(img => `/src/components/Carousel/img/${img}`);
```

## Category Component

**File**: [`Frontend/src/components/Category/Category.jsx`](Frontend/src/components/Category/Category.jsx)

The Category component displays product categories in a grid layout:

### Implementation

```javascript
import CategoryCard from "./CategoryCard";
import categoryInfos from "./CategoryInfos";
import "./Category.css";

function Category() {
  return (
    <section className="category-section">
      <div className="category-container">
        {categoryInfos.map((category) => (
          <CategoryCard key={category.id} data={category} />
        ))}
      </div>
    </section>
  );
}

export default Category;
```

### Category Data

Categories are defined in [`CategoryInfos.js`](Frontend/src/components/Category/CategoryInfos.js):

```javascript
// Sample category data
export default [
  {
    id: 1,
    name: "Electronics",
    image: "electronics.jpg",
    description: "Latest gadgets and devices"
  },
  {
    id: 2,
    name: "Books",
    image: "books.jpg",
    description: "Best-selling books"
  },
  // Additional categories...
];
```

### Category Card

**File**: [`CategoryCard.jsx`](Frontend/src/components/Category/CategoryCard.jsx)

Displays individual category with image and description:

```javascript
function CategoryCard({ data }) {
  return (
    <div className="category-card">
      <img src={data.image} alt={data.name} className="category-image" />
      <div className="category-content">
        <h3>{data.name}</h3>
        <p>{data.description}</p>
        <Link to={`/category/${data.name.toLowerCase()}`} className="category-link">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
```

## Single Product Component

**File**: [`Frontend/src/components/products/ProductCard.jsx`](Frontend/src/components/products/ProductCard.jsx)

The ProductCard component displays individual product information:

### Key Features

1. **Product Image**: Displays product image with proper dimensions
2. **Rating System**: Star rating with count of reviews
3. **Product Title**: Truncated to 60 characters with ellipsis
4. **Price Display**: Formatted currency (USD)
5. **Prime Badge**: Indicates Prime eligible products
6. **Add to Cart Button**:
   - Animated button with feedback
   - Click handler that adds product to cart
   - Visual confirmation when item is added

### Implementation

```javascript
function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const [isClicked, setIsClicked] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  // Format product title
  const formatTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  };

  // Generate star rating
  const renderStars = (ratingValue) => {
    // Star rendering logic...
  };

  return (
    <div className={classes['amz-product-card']}>
      {/* Product content */}
    </div>
  );
}
```

### Styling

Located in [`ProductCard.module.css`](Frontend/src/components/products/ProductCard.module.css), featuring:
- Card layout with shadows
- Responsive grid layout
- Hover effects
- Button animations

## Header Routing

**File**: [`Frontend/src/pages/Routing/Routing.jsx`](Frontend/src/pages/Routing/Routing.jsx)

The routing system uses React Router DOM to manage navigation:

### Main Routes

```javascript
import { Routes, Route } from "react-router-dom";
import Landing from "../Landing/Landing";
import Payment from "../Payment/Payment";
import Orders from "../Orders/Orders";
import Results from "../Results/Results";
import Auth from "../Auth/Auth";
import Cart from "../Cart/Cart";
import ProductDetail from "../ProductDetail/ProductDetail";
// Additional imports...

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/pro-preview" element={<ProPreview />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/service" element={<Service />} />
      <Route path="/registry" element={<Registry />} />
      <Route path="/gift-cards" element={<GiftCards />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/location" element={<Ethiopia />} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/category/:categoryName" element={<Results />} />
      <Route path="/search" element={<Results />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    </Routes>
  );
}

export default Routing;
```

### Protected Routes

Some routes require authentication:

```javascript
// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

## Category Routing

Category pages are handled by the Results component:

**File**: [`Frontend/src/pages/Results/Results.jsx`](Frontend/src/pages/Results/Results.jsx)

### Implementation

```javascript
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductsByCategory, searchProducts } from "../../Api/api";
import ProductCard from "../../components/products/ProductCard";
import "./Results.module.css";

function Results() {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data;
        if (searchQuery) {
          data = await searchProducts(searchQuery);
        } else if (categoryName) {
          data = await getProductsByCategory(categoryName);
        }
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, searchQuery]);

  return (
    <div className="results-container">
      {/* Product grid */}
    </div>
  );
}

export default Results;
```

## Detail Page Routing

Product detail pages display comprehensive product information:

**File**: [`Frontend/src/pages/ProductDetail/ProductDetail.jsx`](Frontend/src/pages/ProductDetail/ProductDetail.jsx)

### Key Features

1. **Loading State**: Displays "Loading product..." while fetching data
2. **Error Handling**: Shows error message if product not found
3. **Product Images**:
   - Main image with zoom functionality
   - Thumbnail navigation
4. **Product Information**:
   - Rating and review count
   - Title
   - Price (formatted with dollar and cents)
   - Prime eligibility
   - Condition (New)
   - Shipping information
5. **Variations**:
   - Size selection (S, M, L, XL, XXL)
   - Color selection
6. **Purchasing Options**:
   - Quantity selector (1-5, 10+)
   - Add to Cart button with feedback
   - Buy Now button
7. **Prime Benefits**:
   - Free 2-day shipping
   - Delivery timing
   - 30-day return guarantee
8. **Tabs**:
   - Product Description
   - Specifications
   - Customer Reviews (with sample reviews)
9. **Related Products**: Shows similar products

### Implementation

```javascript
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../Api/api";
import CurrencyFormat from "../../components/products/CurrencyFormat/CurrencyFormat";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");

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
    }
  };

  return (
    <Layout>
      <div className="amz-product-detail">
        {/* Product content */}
      </div>
    </Layout>
  );
}

export default ProductDetail;
```

## Loading Functionality Integration

Loading states are implemented using React hooks:

### Product Detail Loading

```javascript
if (loading) {
  return (
    <Layout>
      <div className="product-detail-loading">
        <p>Loading product...</p>
      </div>
    </Layout>
  );
}
```

### Error Handling

```javascript
if (error) {
  return (
    <Layout>
      <div className="product-detail-error">
        <p>{error}</p>
      </div>
    </Layout>
  );
}
```

### Results Page Loading

```javascript
{loading ? (
  <div className="loading-container">
    <p>Loading products...</p>
  </div>
) : (
  /* Product grid */
)}
```

## Detail Page Styling and Addition of Description on Single Product

**File**: [`Frontend/src/pages/ProductDetail/ProductDetail.css`](Frontend/src/pages/ProductDetail/ProductDetail.css)

Key styling features:

### Layout

```css
.amz-product-detail {
  background: #f3f3f3;
  min-height: 100vh;
  padding: 20px 0;
}

.product-detail-main {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
}
```

### Product Images

```css
.product-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-image-zoom {
  overflow: hidden;
  border-radius: 4px;
  background: white;
  padding: 20px;
}

.product-main-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-main-image:hover {
  transform: scale(1.1);
}
```

### Product Info

```css
.product-info {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Tabs

```css
.product-tabs {
  grid-column: 1 / -1;
  background: white;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-nav {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  border-bottom-color: #007185;
  color: #007185;
  font-weight: 600;
}
```

### Related Products

```css
.related-products {
  grid-column: 1 / -1;
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
```

## useReducer Hook and UseContextAPI Explanation and Example

**File**: [`Frontend/src/context/CartContext.jsx`](Frontend/src/context/CartContext.jsx)

### useReducer Hook

`useReducer` is a React Hook that allows for complex state management. It is similar to useState but is better suited for states that have multiple sub-values or require complex transitions.

```javascript
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
      
      // Validate product data
      if (!product || !product.id || !product.title || typeof product.price !== "number") {
        console.error("Invalid product data:", product);
        return state;
      }

      // Check if product already exists in cart
      const existingItem = state.cartItems.find(item => item.id === product.id);
      const quantityToAdd = product.quantity || 1;

      if (existingItem) {
        // Increase quantity if item exists
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          )
        };
      }

      // Add new item to cart
      return {
        ...state,
        cartItems: [...state.cartItems, { ...product, quantity: quantityToAdd }]
      };
    }

    case REMOVE_FROM_CART: {
      const { productId } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== productId)
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
          item.id === productId ? { ...item, quantity: quantity } : item
        )
      };
    }

    case CLEAR_CART: {
      return {
        ...state,
        cartItems: []
      };
    }

    default:
      return state;
  }
};
```

### useContextAPI

`useContext` allows components to access context values without having to pass props through every level of the component tree.

```javascript
import { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  cartItems: [],
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          dispatch({ type: CLEAR_CART });
          parsedCart.forEach(item => {
            dispatch({ type: ADD_TO_CART, payload: { product: item } });
          });
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Cart operations
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

  // Derived state
  const cartTotal = state.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartCount = state.cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  const getCartCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Context value
  const value = {
    cartItems: state.cartItems,
    cartTotal,
    cartCount,
    getCartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

### Usage Example

```javascript
import { useCart } from "./context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card">
      {/* Product content */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

## Add to Cart Functionality

Add to cart functionality is implemented in both ProductCard and ProductDetail components.

### ProductCard Implementation

```javascript
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isClicked, setIsClicked] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div className={classes['amz-product-card']}>
      {/* Product content */}
      <button
        className={`${classes['add-to-cart']} ${isClicked ? classes['clicked'] : ""}`}
        onClick={handleAddToCart}
      >
        <span className={classes['cart-icon']}>
          {isClicked ? "✓" : "🛒"}
        </span>
        <span className={classes['button-text']}>
          {isClicked ? "Added to Cart" : "Add to Cart"}
        </span>
      </button>
    </div>
  );
}
```

### ProductDetail Implementation

```javascript
function ProductDetail() {
  const { addToCart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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
    }
  };

  return (
    <div className="product-purchasing">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <select
          id="quantity"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
          <option value={10}>10+</option>
        </select>
      </div>

      <div className="product-actions">
        <button
          className={`add-to-cart-btn ${isClicked ? "clicked" : ""}`}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

## Header Sticky Part Implementation

**File**: [`Frontend/src/components/Header/Header.css`](Frontend/src/components/Header/Header.css)

### Sticky Header

```css
.amz-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #131921;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.amz-header-top {
  padding: 10px 0;
  background: #131921;
  border-bottom: 1px solid #333;
}

.amz-header-bottom {
  background: #232f3e;
  padding: 10px 0;
  color: white;
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .amz-header {
    position: relative;
  }
  
  .amz-search-container {
    order: 3;
    grid-column: 1 / -1;
    margin-top: 10px;
  }
  
  .amz-right-nav {
    order: 2;
  }
}
```

### Navigation Links

```css
.amz-right-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-box {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  color: white;
  text-decoration: none;
}

.nav-box:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.amz-cart {
  position: relative;
}

.cart-icon-container {
  position: relative;
  font-size: 24px;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f08804;
  color: black;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
}
```

## Cart Page - Part One

**File**: [`Frontend/src/pages/Cart/Cart.jsx`](Frontend/src/pages/Cart/Cart.jsx)

### Cart Empty State

```javascript
if (cartItems.length === 0) {
  return (
    <Layout title="Shopping Cart">
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart.</p>
        <Link to="/" className="continue-shopping-btn">
          <FaArrowRight /> Continue Shopping
        </Link>
      </div>
    </Layout>
  );
}
```

### Cart Header

```javascript
<div className="cart-header">
  <h1>Shopping Cart ({getCartCount()} items)</h1>
  <button
    className="clear-cart-btn"
    onClick={handleClearCart}
    aria-label="Clear cart"
  >
    Clear Cart
  </button>
</div>
```

### Cart Items List

```javascript
<div className="cart-items">
  {cartItems.map((item) => (
    <div
      key={item.id}
      className={`cart-item ${removingItem === item.id ? 'removing' : ''}`}
    >
      <Link to={`/product/${item.id}`} className="item-image-link">
        <img src={item.image} alt={item.title} className="item-image" />
      </Link>

      <div className="item-details">
        <Link to={`/product/${item.id}`} className="item-title-link">
          <h3>{item.title}</h3>
        </Link>
        <div className="item-meta">
          <span className="item-condition">Condition: New</span>
          <span className="item-shipping">✓ Free shipping</span>
        </div>
        <p className="item-price">
          Price: <CurrencyFormat amount={item.price} />
        </p>
      </div>
      {/* Quantity and remove button */}
    </div>
  ))}
</div>
```

## Cart Page - Part Two

### Quantity Management

```javascript
<div className="item-quantity">
  <label htmlFor={`qty-${item.id}`}>Qty:</label>
  <button
    onClick={() =>
      updateQuantity(item.id, item.quantity - 1)
    }
    className="qty-btn"
    aria-label="Decrease quantity"
    disabled={item.quantity <= 1}
  >
    <FaMinus />
  </button>
  <input
    id={`qty-${item.id}`}
    type="number"
    value={item.quantity}
    onChange={(e) => {
      const newQty = parseInt(e.target.value) || 1;
      if (newQty > 0) {
        updateQuantity(item.id, newQty);
      }
    }}
    min="1"
    max="99"
    className="qty-input"
  />
  <button
    onClick={() =>
      updateQuantity(item.id, item.quantity + 1)
    }
    className="qty-btn"
    aria-label="Increase quantity"
    disabled={item.quantity >= 99}
  >
    <FaPlus />
  </button>
</div>
```

### Remove Item Functionality

```javascript
<button
  onClick={() => handleRemoveItem(item.id)}
  className="remove-btn"
  aria-label="Remove item from cart"
  disabled={removingItem === item.id}
>
  {removingItem === item.id ? <FaCheck /> : <FaTrash />}
  {removingItem === item.id ? 'Removing...' : 'Remove'}
</button>
```

### Remove Handler

```javascript
const [removingItem, setRemovingItem] = useState(null);

const handleRemoveItem = async (itemId) => {
  setRemovingItem(itemId);
  setTimeout(() => {
    removeFromCart(itemId);
    setRemovingItem(null);
  }, 300);
};
```

## Cart Page - Part Three

### Order Summary

```javascript
<div className="cart-summary">
  <div className="summary-box">
    <h3>Order Summary</h3>
    <div className="summary-line">
      <span>Subtotal ({getCartCount()} items):</span>
      <span>
        <CurrencyFormat amount={getCartTotal()} />
      </span>
    </div>
    <div className="summary-line">
      <span>Shipping:</span>
      <span>
        {calculateShipping() === 0 ? 'FREE' : <CurrencyFormat amount={calculateShipping()} />}
      </span>
    </div>
    <div className="summary-line">
      <span>Estimated Tax:</span>
      <span>
        <CurrencyFormat amount={calculateTax()} />
      </span>
    </div>
    <hr />
    <div className="summary-total">
      <span>Total:</span>
      <span>
        <CurrencyFormat amount={calculateGrandTotal()} />
      </span>
    </div>
```

### Shipping and Tax Calculation

```javascript
const calculateTax = () => {
  return getCartTotal() * 0.08;
};

const calculateShipping = () => {
  return getCartTotal() > 50 ? 0 : 5.99;
};

const calculateGrandTotal = () => {
  return getCartTotal() + calculateTax() + calculateShipping();
};
```

### Checkout Button

```javascript
{!user && (
  <div className="login-message">
    Sign in to your account to checkout securely
  </div>
)}

<button
  className="checkout-btn"
  onClick={handleCheckout}
>
  {user ? "Proceed to Checkout" : "Sign in to Checkout"}
</button>
```

### Checkout Handler

```javascript
const handleCheckout = () => {
  if (!user) {
    navigate("/auth");
    return;
  }
  navigate("/payments");
};
```

## Live Session

### Development Setup

1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run dev`
3. **Build for Production**: `npm run build`
4. **Preview Production Build**: `npm run preview`

### API Integration

The frontend connects to the backend API for product data and user authentication:

**File**: [`Frontend/src/Api/api.js`](Frontend/src/Api/api.js)

```javascript
const API_BASE_URL = 'http://localhost:3000';

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Additional API methods...
```

### Firebase Authentication

Firebase is used for user authentication:

**File**: [`Frontend/src/config/firebaseConfig.js`](Frontend/src/config/firebaseConfig.js)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Protected Routes

Protected routes ensure certain pages are only accessible to authenticated users:

**File**: [`Frontend/src/components/ProtectedRoute/ProtectedRoute.jsx`](Frontend/src/components/ProtectedRoute/ProtectedRoute.jsx)

```javascript
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

## Conclusion

This Amazon clone frontend provides a complete e-commerce experience with:

1. **Responsive design** that works on desktop and mobile devices
2. **Product management** including browsing, searching, and filtering
3. **Shopping cart functionality** with quantity management and persistence
4. **User authentication** using Firebase
5. **Checkout process** with shipping and tax calculations
6. **Product detail pages** with comprehensive information
7. **Category browsing** and search functionality
8. **Prime eligibility indicators** and benefits
9. **Loading states and error handling** for better user experience
10. **Modern UI with smooth animations** and transitions

The application uses React hooks for state management, React Router for navigation, and Context API for global state, resulting in a scalable and maintainable codebase.
