import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout/Layout";
import CurrencyFormat from "../../components/products/CurrencyFormat/CurrencyFormat";
import "./Cart.css";
import { FaTrash, FaPlus, FaMinus, FaCheck, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Proceed to checkout
    navigate("/payment");
  };

  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    // Add a small delay for visual feedback
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItem(null);
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
    }
  };

  const calculateTax = () => {
    // Calculate tax (8% of subtotal for demo purposes)
    return cartTotal * 0.08;
  };

  const calculateShipping = () => {
    // Free shipping for orders over $50
    return cartTotal > 50 ? 0 : 5.99;
  };

  const calculateGrandTotal = () => {
    return cartTotal + calculateTax() + calculateShipping();
  };

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

  return (
    <Layout title="Shopping Cart">
      <div className="cart-container">
        <div className="cart-main">
          <div className="cart-header">
            <h1>Shopping Cart ({cartCount} items)</h1>
            <button
              className="clear-cart-btn"
              onClick={handleClearCart}
              aria-label="Clear cart"
            >
              Clear Cart
            </button>
          </div>

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

                <div className="item-subtotal">
                  <p>Subtotal:</p>
                  <p className="subtotal-price">
                    <CurrencyFormat
                      amount={item.price * item.quantity}
                    />
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="remove-btn"
                  aria-label="Remove item from cart"
                  disabled={removingItem === item.id}
                >
                  {removingItem === item.id ? <FaCheck /> : <FaTrash />}
                  {removingItem === item.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-box">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal ({cartCount} items):</span>
              <span>
                <CurrencyFormat amount={cartTotal} />
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

            {cartTotal < 50 && (
              <div className="shipping-message">
                🚚 Add <CurrencyFormat amount={50 - cartTotal} /> more for free shipping
              </div>
            )}

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

            <button
              className="continue-shopping-btn"
              onClick={() => navigate('/')}
            >
              <FaArrowRight /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

