const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Supabase helpers
const {
    supabase,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getUserById,
    updateUser,
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getUserFromToken,
} = require('./config/supabase');

// Reusable mock products data (fallback when Supabase is not configured)
const mockProducts = [
    {
        id: '1',
        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
        price: 109.95,
        description: 'Your perfect pack for everyday use and walks in the forest.',
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
        rating: { rate: 3.9, count: 120 }
    },
    {
        id: '2',
        title: 'Mens Casual Premium Slim Fit T-Shirts',
        price: 22.3,
        description: 'Slim-fitting style, contrast raglan long sleeve.',
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
        rating: { rate: 4.1, count: 259 }
    },
    {
        id: '3',
        title: 'Mens Cotton Jacket',
        price: 55.99,
        description: 'Great outerwear jackets for Spring/Autumn/Winter.',
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
        rating: { rate: 4.7, count: 500 }
    }
];

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Stripe with proper error handling
let stripe;
try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_1234567890') {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        console.log('Stripe API initialized successfully');
    } else {
        console.warn('Stripe API not initialized - using mock data');
    }
} catch (error) {
    console.warn('Stripe API initialization failed:', error.message);
}

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            supabase: !!supabase,
            stripe: !!stripe
        }
    });
});

// ============ PRODUCTS ROUTES ============

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { category, featured, limit, search } = req.query;

        if (supabase) {
            const { data, error } = await getProducts({ category, featured, limit, search });
            if (error) throw error;
            return res.json(data || []);
        }

        // Fallback to mock data
        let products = [...mockProducts];
        if (category) {
            products = products.filter(p => p.category === category);
        }
        if (search) {
            products = products.filter(p =>
                p.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (supabase) {
            const { data, error } = await getProductById(id);
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(data);
        }

        // Fallback to mock data
        const product = mockProducts.find(p => p.id === id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create product (admin only)
app.post('/api/products', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const productData = req.body;

        if (supabase) {
            const { data, error } = await createProduct(productData);
            if (error) throw error;
            return res.status(201).json(data);
        }

        // Fallback mock response
        const newProduct = {
            id: Date.now().toString(),
            ...productData,
            created_at: new Date().toISOString()
        };
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product (admin only)
app.put('/api/products/:id', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const updates = req.body;

        if (supabase) {
            const { data, error } = await updateProduct(id, updates);
            if (error) throw error;
            return res.json(data);
        }

        // Fallback mock response
        res.json({ id, ...updates, updated_at: new Date().toISOString() });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product (admin only)
app.delete('/api/products/:id', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;

        if (supabase) {
            const { error } = await deleteProduct(id);
            if (error) throw error;
        }

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ============ CART ROUTES ============

// Get cart items
app.get('/api/cart', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (supabase) {
            const { data, error } = await getCartItems(user.id);
            if (error) throw error;
            return res.json(data || []);
        }

        // Fallback empty cart
        res.json([]);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to cart
app.post('/api/cart', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { productId, quantity = 1 } = req.body;

        if (supabase) {
            const { data, error } = await addToCart(user.id, productId, quantity);
            if (error) throw error;
            return res.json(data);
        }

        // Fallback mock response
        res.json({
            id: Date.now().toString(),
            user_id: user.id,
            product_id: productId,
            quantity
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Update cart item
app.put('/api/cart/:itemId', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { itemId } = req.params;
        const { quantity } = req.body;

        if (supabase) {
            const { data, error } = await updateCartItem(itemId, quantity);
            if (error) throw error;
            return res.json(data || { success: true });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove from cart
app.delete('/api/cart/:itemId', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { itemId } = req.params;

        if (supabase) {
            const { error } = await removeFromCart(itemId);
            if (error) throw error;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// Clear cart
app.delete('/api/cart', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (supabase) {
            const { error } = await clearCart(user.id);
            if (error) throw error;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

// ============ ORDERS ROUTES ============

// Get user orders
app.get('/api/orders', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (supabase) {
            const { data, error } = await getOrders(user.id);
            if (error) throw error;
            return res.json(data || []);
        }

        // Fallback empty orders
        res.json([]);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get single order
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { orderId } = req.params;

        if (supabase) {
            const { data, error } = await getOrderById(orderId, user.id);
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Order not found' });
            }
            return res.json(data);
        }

        res.status(404).json({ error: 'Order not found' });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { items, shippingAddress, paymentIntentId } = req.body;
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderData = {
            user_id: user.id,
            total,
            shipping_address: shippingAddress,
            payment_intent_id: paymentIntentId,
            status: 'pending'
        };

        if (supabase) {
            const { data, error } = await createOrder(orderData, items);
            if (error) throw error;

            // Clear cart after successful order
            await clearCart(user.id);

            return res.status(201).json(data);
        }

        // Fallback mock response
        const order = {
            id: Date.now().toString(),
            ...orderData,
            items,
            created_at: new Date().toISOString()
        };
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        if (supabase) {
            const { data, error } = await updateOrderStatus(orderId, status);
            if (error) throw error;
            return res.json(data);
        }

        res.json({ success: true, status });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// ============ PAYMENT ROUTES ============

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { amount } = req.body;

        if (stripe) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    user_id: user.id
                }
            });

            return res.json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });
        }

        // Mock payment intent
        res.json({
            clientSecret: 'mock_client_secret_' + Date.now(),
            paymentIntentId: 'mock_payment_intent_' + Date.now()
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

// ============ USER ROUTES ============

// Get current user profile
app.get('/api/user/profile', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (supabase) {
            const { data, error } = await getUserById(user.id);
            if (error) throw error;
            return res.json(data || user);
        }

        // Return basic user info from token
        res.json({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
app.put('/api/user/profile', async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updates = req.body;

        if (supabase) {
            const { data, error } = await updateUser(user.id, updates);
            if (error) throw error;
            return res.json(data);
        }

        res.json({ id: user.id, ...updates });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// ============ CATEGORIES ROUTES ============

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('products')
                .select('category')
                .order('category');

            if (error) throw error;

            // Get unique categories
            const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
            return res.json(categories);
        }

        // Fallback mock categories
        const categories = [...new Set(mockProducts.map(p => p.category))];
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// ============ SEARCH ROUTE ============

// Search products
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.json([]);
        }

        if (supabase) {
            const { data, error } = await getProducts({ search: q });
            if (error) throw error;
            return res.json(data || []);
        }

        // Fallback search in mock data
        const results = mockProducts.filter(p =>
            p.title.toLowerCase().includes(q.toLowerCase()) ||
            p.description.toLowerCase().includes(q.toLowerCase())
        );
        res.json(results);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Supabase configured: ${!!supabase}`);
    console.log(`Stripe configured: ${!!stripe}`);
});

module.exports = app;
