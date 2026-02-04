import { useState } from 'react';
import Layout from '../Layout/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { processPayment } from '../../Api/stripe';
import './Payment.css';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const validateShipping = () => {
    const newErrors = {};

    if (!shippingDetails.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!shippingDetails.address.trim()) {
      newErrors.address = 'Please enter your address';
    }

    if (!shippingDetails.city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    if (!/^\d{5}$/.test(shippingDetails.postalCode)) {
      newErrors.postalCode = 'Please enter a valid postal code (5 digits)';
    }

    if (!/^\d{10}$/.test(shippingDetails.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
    }

    return newErrors;
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiry = (expiry) => {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    return expiryDate > now && month >= 1 && month <= 12;
  };

  const validateCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const validateCard = () => {
    const newErrors = {};

    if (!validateCardNumber(cardDetails.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!validateExpiry(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!validateCVV(cardDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
    }

    if (!validateName(cardDetails.cardholderName)) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }

    return newErrors;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shippingErrors = validateShipping();
    const cardErrors = validateCard();
    const allErrors = { ...shippingErrors, ...cardErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    setPaymentError('');

    try {
      // Process payment - Note: In a real application, you would use Stripe Elements or Payment Methods API
      // For this demo, we'll simulate a payment token
      const paymentResult = await processPayment({
        token: {
          id: 'tok_visa', // Stripe test token for Visa card
          email: user?.email || 'test@example.com',
          card: {
            brand: 'Visa',
            last4: '4242',
            exp_month: parseInt(cardDetails.expiryDate.split('/')[0]),
            exp_year: parseInt(cardDetails.expiryDate.split('/')[1]) + 2000
          }
        },
        amount: getCartTotal() * 100, // Convert to cents
        items: cartItems,
        userId: user?.uid || 'guest'
      });

      if (paymentResult.success) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setPaymentError(error.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="payment-container">
        <h2>Checkout</h2>
        {paymentError && <div className="payment-error">{paymentError}</div>}

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span className="item-name">{item.title}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: ${getCartTotal().toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Shipping Information</h3>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingDetails.fullName}
                onChange={handleShippingChange}
                placeholder="John Doe"
                required
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleShippingChange}
                placeholder="123 Main St"
                required
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingDetails.city}
                onChange={handleShippingChange}
                placeholder="New York"
                required
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={shippingDetails.postalCode}
                onChange={handleShippingChange}
                placeholder="10001"
                required
              />
              {errors.postalCode && <span className="error">{errors.postalCode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleShippingChange}
                placeholder="1234567890"
                required
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                required
              />
              {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                required
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                placeholder="123"
                required
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={cardDetails.cardholderName}
                onChange={handleCardChange}
                placeholder="John Doe"
                required
              />
              {errors.cardholderName && <span className="error">{errors.cardholderName}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading ? 'Processing Payment...' : 'Place Order'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Payment;
