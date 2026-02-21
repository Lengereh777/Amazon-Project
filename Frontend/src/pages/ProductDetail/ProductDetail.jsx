import { useEffect, useState } from "react";
import "./ProductDetail.css";
import Layout from "../Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../Api/api";
import CurrencyFormat from "../../components/products/CurrencyFormat/CurrencyFormat";
import { useCart } from "../../context/CartContext";
import { FaCheck, FaStar, FaStarHalf, FaRegStar, FaShippingFast, FaClock, FaUndo, FaShare, FaQuestionCircle } from "react-icons/fa";

function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", productId);
        const result = await getProductById(productId);
        console.log("Product data received:", result);

        if (result.error) {
          setError(result.message);
        } else {
          setProduct(result.data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
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
      // Add product with selected quantity
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (product) {
      // Clear cart and add only this product to prepare for checkout
      clearCart();
      const productWithQuantity = {
        ...product,
        quantity: selectedQuantity,
        size: selectedSize,
        color: selectedColor
      };
      addToCart(productWithQuantity);
      // Navigate to checkout
      navigate("/payment");
    }
  };

  // Generate star rating icons
  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-full" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="star-half" />);
    }

    const emptyStars = 5 - Math.ceil(ratingValue);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={5 - i} className="star-empty" />);
    }

    return stars;
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Blue", value: "blue", hex: "#0066cc" },
    { name: "Red", value: "red", hex: "#cc0000" },
    { name: "Green", value: "green", hex: "#009933" }
  ];

  const relatedProducts = [
    { id: 1, title: "Related Product 1", price: 29.99, image: "https://via.placeholder.com/150" },
    { id: 2, title: "Related Product 2", price: 39.99, image: "https://via.placeholder.com/150" },
    { id: 3, title: "Related Product 3", price: 49.99, image: "https://via.placeholder.com/150" }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="product-detail-loading">
          <p>Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="product-detail-error">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="amz-product-detail">
        {product && (
          <div className="amz-container">
            {/* Product Breadcrumb */}
            <div className="amz-breadcrumb">
              <a href="/">Amazon</a>
              <span className="breadcrumb-separator">›</span>
              <a href={`/category/${product.category}`}>{product.category}</a>
              <span className="breadcrumb-separator">›</span>
              <span>{product.title.substring(0, 50)}...</span>
            </div>

            <div className="product-detail-main">
              {/* Product Images */}
              <div className="product-images">
                <div className="product-image-zoom">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-main-image"
                  />
                </div>
                <div className="product-image-thumbnails">
                  <div className="thumbnail">
                    <img src={product.image} alt="Product view 1" />
                  </div>
                  <div className="thumbnail">
                    <img src={product.image} alt="Product view 2" />
                  </div>
                  <div className="thumbnail">
                    <img src={product.image} alt="Product view 3" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-meta">
                  <div className="product-rating-section">
                    <div className="rating-stars">
                      {renderStars(product.rating?.rate || 0)}
                    </div>
                    <span className="rating-count">
                      ({product.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <h1 className="product-title">{product.title}</h1>

                  <div className="product-price-section">
                    <div className="price-symbol">$</div>
                    <div className="price-dollars">{Math.floor(product.price)}</div>
                    <div className="price-cents">{(product.price % 1 * 100).toFixed(0).padStart(2, '0')}</div>
                  </div>

                  <div className="prime-badge">
                    <span className="prime-icon">⚡</span>
                    <span className="prime-text">Prime</span>
                  </div>
                </div>

                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">Condition:</span>
                    <span className="detail-value">New</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Shipping:</span>
                    <span className="detail-value">Free shipping</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Delivery:</span>
                    <span className="detail-value">2-4 business days</span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="product-variations">
                  <div className="variation-section">
                    <label className="variation-label">Size:</label>
                    <div className="size-options">
                      {sizes.map(size => (
                        <button
                          key={size}
                          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <button
                      className="size-guide-btn"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                    >
                      <FaQuestionCircle /> Size Guide
                    </button>
                  </div>

                  {/* Color Selection */}
                  <div className="variation-section">
                    <label className="variation-label">Color:</label>
                    <div className="color-options">
                      {colors.map(color => (
                        <button
                          key={color.value}
                          className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                          onClick={() => setSelectedColor(color.value)}
                          style={{
                            backgroundColor: color.hex,
                            borderColor: selectedColor === color.value ? '#007185' : '#ddd'
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

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
                      {isClicked ? (
                        <>
                          <FaCheck /> Added to Cart
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>

                    <button
                      className="buy-now-btn"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="prime-benefits">
                    <div className="benefit-item">
                      <span className="benefit-icon">🚚</span>
                      <span className="benefit-text">Free 2-day shipping</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">⏰</span>
                      <span className="benefit-text">Order within 12h 34m for delivery tomorrow</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">✓</span>
                      <span className="benefit-text">30-day return guarantee</span>
                    </div>
                  </div>

                  <div className="product-share">
                    <FaShare /> Share this product
                  </div>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="product-tabs">
                <div className="tab-nav">
                  <button
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Product Description
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Customer Reviews ({product.rating?.count || 0})
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'description' && (
                    <div className="tab-panel">
                      <h2>Product Description</h2>
                      <p>{product.description}</p>
                      <div className="product-highlights">
                        <h3>Key Features:</h3>
                        <ul>
                          <li>High quality materials</li>
                          <li>Durable construction</li>
                          <li>Modern design</li>
                          <li>Easy to use</li>
                          <li>1-year warranty</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="tab-panel">
                      <h2>Specifications</h2>
                      <div className="specs-grid">
                        <div className="spec-item">
                          <span className="spec-label">Category:</span>
                          <span className="spec-value">{product.category}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Product ID:</span>
                          <span className="spec-value">{product.id}</span>
                        </div>
                        {product.specifications?.ingredients && (
                          <div className="spec-item">
                            <span className="spec-label">Ingredients:</span>
                            <span className="spec-value">{product.specifications.ingredients}</span>
                          </div>
                        )}
                        {product.specifications?.allergens && (
                          <div className="spec-item">
                            <span className="spec-label">Allergens:</span>
                            <span className="spec-value">{product.specifications.allergens}</span>
                          </div>
                        )}
                        {product.specifications?.shelfLife && (
                          <div className="spec-item">
                            <span className="spec-label">Shelf Life:</span>
                            <span className="spec-value">{product.specifications.shelfLife}</span>
                          </div>
                        )}
                        {product.specifications?.weight && (
                          <div className="spec-item">
                            <span className="spec-label">Weight:</span>
                            <span className="spec-value">{product.specifications.weight}</span>
                          </div>
                        )}
                        {product.specifications?.productionMethod && (
                          <div className="spec-item">
                            <span className="spec-label">Production Method:</span>
                            <span className="spec-value">{product.specifications.productionMethod}</span>
                          </div>
                        )}
                        {product.specifications?.certifications && (
                          <div className="spec-item">
                            <span className="spec-label">Certifications:</span>
                            <span className="spec-value">{product.specifications.certifications}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="tab-panel">
                      <h2>Customer Reviews</h2>
                      <div className="review-summary">
                        <div className="overall-rating">
                          <div className="rating-score">{product.rating?.rate || 0}</div>
                          <div className="rating-stars">{renderStars(product.rating?.rate || 0)}</div>
                          <div className="rating-count">{product.rating?.count || 0} reviews</div>
                        </div>
                      </div>

                      <div className="reviews-list">
                        {/* Sample reviews */}
                        {[1, 2, 3].map(review => (
                          <div key={review} className="review-item">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <div className="reviewer-avatar">User{review}</div>
                                <div className="reviewer-details">
                                  <div className="reviewer-name">Customer {review}</div>
                                  <div className="review-date">January {10 + review}, 2024</div>
                                </div>
                              </div>
                              <div className="review-rating">{renderStars(4 + (review % 2))}</div>
                            </div>
                            <div className="review-content">
                              <h4>Great product!</h4>
                              <p>This product exceeded my expectations. The quality is excellent and it's very durable. Highly recommend!</p>
                            </div>
                            <div className="review-helpful">
                              <button className="helpful-btn">👍 Helpful</button>
                              <span className="helpful-count">12 people found this helpful</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="write-review-btn-container">
                        <button className="write-review-btn">Write a Customer Review</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Products */}
              <div className="related-products">
                <h2>Related Products</h2>
                <div className="related-products-grid">
                  {relatedProducts.map(relatedProduct => (
                    <div key={relatedProduct.id} className="related-product-card">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.title}
                        className="related-product-image"
                      />
                      <h3 className="related-product-title">{relatedProduct.title}</h3>
                      <div className="related-product-price">
                        <CurrencyFormat amount={relatedProduct.price} />
                      </div>
                      <button className="related-add-to-cart-btn">Add to Cart</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ProductDetail;
