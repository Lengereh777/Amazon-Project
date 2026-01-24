const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Create payment intent endpoint
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { amount, currency } = req.body;

            // Validate input
            if (!amount || !currency) {
                return res.status(400).json({ error: 'Missing required payment information' });
            }

            // Create payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                payment_method_types: ['card'],
                metadata: {
                    integration_check: 'accept_a_payment'
                }
            });

            res.json({
                success: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret
            });

        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Payment processing endpoint
exports.processPayment = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { token, amount, items, userId, orderId } = req.body;

            // Validate input
            if (!token || !amount || !items || !userId) {
                return res.status(400).json({ error: 'Missing required payment information' });
            }

            // Create charge
            const charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: token.id,
                description: `Amazon Clone Order - ${orderId || 'New Order'}`,
                receipt_email: token.email
            });

            // Create order in Firestore
            const orderData = {
                userId: userId,
                items: items,
                total: amount,
                paymentId: charge.id,
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                shippingDetails: token.card
            };

            const orderRef = await db.collection('orders').add(orderData);

            res.json({
                success: true,
                orderId: orderRef.id,
                paymentId: charge.id,
                message: 'Payment processed successfully'
            });

        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get user orders endpoint
exports.getUserOrders = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'Missing userId parameter' });
            }

            const ordersSnapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const orders = [];
            ordersSnapshot.forEach((doc) => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.json({
                success: true,
                orders: orders
            });

        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Duplicate a product
exports.duplicateProduct = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { productId, newTitle, newPrice } = req.body;

            // Get the original product from Firestore
            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();

            if (!productDoc.exists) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const originalProduct = productDoc.data();

            // Create duplicate product with optional modifications
            const duplicateProduct = {
                ...originalProduct,
                title: newTitle || `Copy of ${originalProduct.title}`,
                price: newPrice || originalProduct.price,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                duplicatedFrom: productId,
                isDuplicate: true
            };

            // Remove the ID field to let Firestore generate a new one
            delete duplicateProduct.id;

            // Add the duplicate product to Firestore
            const newProductRef = await db.collection('products').add(duplicateProduct);

            res.json({
                success: true,
                productId: newProductRef.id,
                message: 'Product duplicated successfully'
            });
        } catch (error) {
            console.error('Error duplicating product:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get all products for admin management
exports.getProducts = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const productsSnapshot = await db.collection('products').get();

            const products = [];
            productsSnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.json({
                success: true,
                products: products
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Create a new product (for admin)
exports.createProduct = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const productData = req.body;

            // Add product to Firestore
            const productRef = await db.collection('products').add({
                ...productData,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.json({
                success: true,
                productId: productRef.id,
                message: 'Product created successfully'
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Update a product (for admin)
exports.updateProduct = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { productId, productData } = req.body;

            if (!productId || !productData) {
                return res.status(400).json({ error: 'Missing productId or productData' });
            }

            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();

            if (!productDoc.exists) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await productRef.update({
                ...productData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.json({
                success: true,
                productId: productId,
                message: 'Product updated successfully'
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Delete a product (for admin)
exports.deleteProduct = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'Missing productId' });
            }

            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();

            if (!productDoc.exists) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await productRef.delete();

            res.json({
                success: true,
                productId: productId,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get product by ID
exports.getProductById = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { productId } = req.query;

            if (!productId) {
                return res.status(400).json({ error: 'Missing productId parameter' });
            }

            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();

            if (!productDoc.exists) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({
                success: true,
                product: {
                    id: productDoc.id,
                    ...productDoc.data()
                }
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get products by category
exports.getProductsByCategory = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { category } = req.query;

            if (!category) {
                return res.status(400).json({ error: 'Missing category parameter' });
            }

            const productsSnapshot = await db.collection('products')
                .where('category', '==', category)
                .get();

            const products = [];
            productsSnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.json({
                success: true,
                products: products
            });
        } catch (error) {
            console.error('Error fetching products by category:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Search products
exports.searchProducts = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ error: 'Missing search query parameter' });
            }

            const productsSnapshot = await db.collection('products').get();
            const products = [];

            productsSnapshot.forEach((doc) => {
                const product = doc.data();
                const searchableText = `${product.title} ${product.category} ${product.description}`.toLowerCase();
                if (searchableText.includes(query.toLowerCase())) {
                    products.push({
                        id: doc.id,
                        ...product
                    });
                }
            });

            res.json({
                success: true,
                products: products
            });
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Get all categories
exports.getCategories = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const productsSnapshot = await db.collection('products').get();
            const categories = new Set();

            productsSnapshot.forEach((doc) => {
                const product = doc.data();
                if (product.category) {
                    categories.add(product.category);
                }
            });

            res.json({
                success: true,
                categories: Array.from(categories)
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: error.message });
        }
    });
});
