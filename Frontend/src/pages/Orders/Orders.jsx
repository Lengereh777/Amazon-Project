import { useState, useEffect } from 'react';
import Layout from "../Layout/Layout";
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../Api/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const { data, error: fetchError } = await getUserOrders(user.uid);

          if (fetchError) {
            setError('Error fetching orders: ' + fetchError.message);
          } else if (data.success) {
            // Convert Firestore timestamps to JavaScript dates
            const formattedOrders = data.orders.map(order => ({
              ...order,
              orderDate: order.orderDate?.toDate?.() || order.orderDate
            }));
            setOrders(formattedOrders);
          } else {
            setError(data.error);
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Failed to fetch orders');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Please login to view your orders');
      }
    };

    fetchData();
  }, [user]);



  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  if (loading) {
    return (
      <Layout title="Your Orders">
        <div className="orders-loading">Loading your orders...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Your Orders">
        <div className="orders-error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Orders">
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to create your first order!</p>
          </div>
        ) : (
          <div className="orders-list">
            <h2>Your Order History</h2>
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p>Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className={`order-status ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-items">
                  {order.products.map(product => (
                    <div key={product.id} className="order-item">
                      <div className="item-info">
                        <h4>{product.title}</h4>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <div className="total-amount">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="order-shipping">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>

                <div className="order-actions">
                  <button className="track-order-btn">
                    Track Order
                  </button>
                  <button className="reorder-btn">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
