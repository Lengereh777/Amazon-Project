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
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
              alt="Amazon Logo"
              className="amz-logo-img"
            />
          </Link>

          {/* Delivery Location */}
          <div className="nav-box amz-location">
            <FaMapMarkerAlt className="location-icon" />
            <div className="nav-text-stack">
              <span className="nav-line-1">Deliver to</span>
              <span className="nav-line-2">Ethiopia</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="amz-search-container">
            <select className="amz-search-select">
              <option>All</option>
              <option>Electronics</option>
              <option>Books</option>
            </select>
            <form onSubmit={handleSearch} className="amz-search-form">
              <input
                type="text"
                className="amz-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon"
              />
              <button type="submit" className="amz-search-btn">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="amz-right-nav">
            <div
              className="nav-box amz-account"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            >
              <span className="nav-line-1">
                Hello, {user ? user.email.split('@')[0] : 'Sign in'}
              </span>
              <span className="nav-line-2">
                Account & Lists <FaChevronDown className="chevron" />
              </span>

              {accountMenuOpen && user && (
                <div className="amz-dropdown">
                  <button onClick={logout} className="logout-btn">Sign Out</button>
                </div>
              )}
            </div>

            <Link to="/orders" className="nav-box">
              <span className="nav-line-1">Returns</span>
              <span className="nav-line-2">& Orders</span>
            </Link>

            <Link to="/cart" className="nav-box amz-cart">
              <div className="cart-icon-container">
                <span className="cart-count">{getCartCount()}</span>
                <FaShoppingCart className="cart-icon" />
              </div>
              <span className="nav-line-2 cart-label">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="amz-header-bottom">
        <div className="nav-box all-menu">
          <FaBars /> <span>All</span>
        </div>
        <nav className="bottom-nav-links">
          <Link to="/deals">Today's Deals</Link>
          <Link to="/service">Customer Service</Link>
          <Link to="/registry">Registry</Link>
          <Link to="/gift-cards">Gift Cards</Link>
          <Link to="/sell">Sell</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;