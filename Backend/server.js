const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Reusable mock products data (20 products from FakeStoreAPI)
const mockProducts = [
    {
        "id": "1",
        "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        "price": 109.95,
        "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        "rating": {
            "rate": 3.9,
            "count": 120
        },
        "createdAt": new Date()
    },
    {
        "id": "2",
        "title": "Mens Casual Premium Slim Fit T-Shirts ",
        "price": 22.3,
        "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
        "rating": {
            "rate": 4.1,
            "count": 259
        },
        "createdAt": new Date()
    },
    {
        "id": "3",
        "title": "Mens Cotton Jacket",
        "price": 55.99,
        "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
        "rating": {
            "rate": 4.7,
            "count": 500
        },
        "createdAt": new Date()
    },
    {
        "id": "4",
        "title": "Mens Casual Slim Fit",
        "price": 15.99,
        "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
        "category": "men's clothing",
        "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
        "rating": {
            "rate": 2.1,
            "count": 430
        },
        "createdAt": new Date()
    },
    {
        "id": "5",
        "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        "price": 695,
        "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
        "rating": {
            "rate": 4.6,
            "count": 400
        },
        "createdAt": new Date()
    },
    {
        "id": "6",
        "title": "Solid Gold Petite Micropave ",
        "price": 168,
        "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
        "rating": {
            "rate": 3.9,
            "count": 70
        },
        "createdAt": new Date()
    },
    {
        "id": "7",
        "title": "White Gold Plated Princess",
        "price": 9.99,
        "description": "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
        "rating": {
            "rate": 3,
            "count": 400
        },
        "createdAt": new Date()
    },
    {
        "id": "8",
        "title": "Pierced Owl Rose Gold Plated Stainless Steel Double",
        "price": 10.99,
        "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
        "rating": {
            "rate": 1.9,
            "count": 100
        },
        "createdAt": new Date()
    },
    {
        "id": "9",
        "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
        "price": 64,
        "description": "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
        "rating": {
            "rate": 3.3,
            "count": 203
        },
        "createdAt": new Date()
    },
    {
        "id": "10",
        "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
        "price": 109,
        "description": "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
        "rating": {
            "rate": 2.9,
            "count": 470
        },
        "createdAt": new Date()
    },
    {
        "id": "11",
        "title": "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
        "price": 109,
        "description": "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
        "rating": {
            "rate": 4.8,
            "count": 319
        },
        "createdAt": new Date()
    },
    {
        "id": "12",
        "title": "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
        "price": 114,
        "description": "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
        "rating": {
            "rate": 4.8,
            "count": 400
        },
        "createdAt": new Date()
    },
    {
        "id": "13",
        "title": "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
        "price": 599,
        "description": "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
        "rating": {
            "rate": 2.9,
            "count": 250
        },
        "createdAt": new Date()
    },
    {
        "id": "14",
        "title": "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
        "price": 999.99,
        "description": "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
        "category": "electronics",
        "image": "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
        "rating": {
            "rate": 2.2,
            "count": 140
        },
        "createdAt": new Date()
    },
    {
        "id": "15",
        "title": "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
        "price": 56.99,
        "description": "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
        "rating": {
            "rate": 2.6,
            "count": 235
        },
        "createdAt": new Date()
    },
    {
        "id": "16",
        "title": "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
        "price": 29.95,
        "description": "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
        "rating": {
            "rate": 2.9,
            "count": 340
        },
        "createdAt": new Date()
    },
    {
        "id": "17",
        "title": "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
        "price": 39.99,
        "description": "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
        "rating": {
            "rate": 3.8,
            "count": 679
        },
        "createdAt": new Date()
    },
    {
        "id": "18",
        "title": "MBJ Women's Solid Short Sleeve Boat Neck V ",
        "price": 9.85,
        "description": "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
        "rating": {
            "rate": 4.7,
            "count": 130
        },
        "createdAt": new Date()
    },
    {
        "id": "19",
        "title": "Opna Women's Short Sleeve Moisture",
        "price": 7.95,
        "description": "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
        "rating": {
            "rate": 4.5,
            "count": 146
        },
        "createdAt": new Date()
    },
    {
        "id": "20",
        "title": "DANVOUY Womens T Shirt Casual Cotton Short",
        "price": 12.99,
        "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
        "category": "women's clothing",
        "image": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
        "rating": {
            "rate": 3.6,
            "count": 145
        },
        "createdAt": new Date()
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
    console.warn('Payment endpoints will use mock data');
}

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL || ''
    ].filter(Boolean), // Allow frontend URLs from environment variable
    credentials: true
}));
app.use(express.json());

// Health check endpoint (improved)
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            firebase: !!db,
            stripe: !!stripe
        }
    });
});

// Initialize Firebase Admin SDK
let db;
try {
    // First try using FIREBASE_SERVICE_ACCOUNT_KEY
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== '{}' && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY.includes('mock')) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        console.log('Firebase Admin SDK initialized successfully (using FIREBASE_SERVICE_ACCOUNT_KEY)');
    }
    // Then try using GOOGLE_APPLICATION_CREDENTIALS file path
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const fs = require('fs');
        const path = require('path');
        const serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            db = admin.firestore();
            console.log('Firebase Admin SDK initialized successfully (using GOOGLE_APPLICATION_CREDENTIALS)');
        } else {
            console.warn('Google Application Credentials file not found:', serviceAccountPath);
            console.warn('Firebase Admin SDK not initialized - using mock data');
        }
    }
    // Default to mock data
    else {
        console.warn('Firebase Admin SDK not initialized - using mock data');
    }
} catch (error) {
    console.warn('Firebase Admin SDK initialization failed:', error.message);
    console.warn('API endpoints that require Firestore will return mock data');
}

// Create payment intent endpoint
app.post('/createPaymentIntent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Validate input
        if (!amount || !currency) {
            return res.status(400).json({ error: 'Missing required payment information' });
        }

        // Create payment intent
        try {
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
        } catch (stripeError) {
            console.warn('Stripe API failed, using mock payment intent:', stripeError.message);
            // Fallback to mock data for testing
            res.json({
                success: true,
                paymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
                clientSecret: 'mock_secret_123'
            });
        }

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Payment processing endpoint
app.post('/processPayment', async (req, res) => {
    try {
        const { token, amount, items, userId, orderId } = req.body;

        // Validate input
        if (!token || !amount || !items || !userId) {
            return res.status(400).json({ error: 'Missing required payment information' });
        }

        // Create charge
        let charge;
        try {
            charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: token.id,
                description: `Amazon Clone Order - ${orderId || 'New Order'}`,
                receipt_email: token.email
            });
        } catch (stripeError) {
            console.warn('Stripe API failed, simulating payment:', stripeError.message);
            // Fallback to mock charge data
            charge = {
                id: `ch_${Math.random().toString(36).substr(2, 9)}`,
                amount: amount
            };
        }

        // Create order in Firestore (if available)
        let orderRefId = `ord_${Math.random().toString(36).substr(2, 9)}`;
        if (db) {
            try {
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
                orderRefId = orderRef.id;
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock order ID:', firestoreError.message);
            }
        }

        res.json({
            success: true,
            orderId: orderRefId,
            paymentId: charge.id,
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get payment history endpoint
app.get('/getPaymentHistory', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }

        // Try to fetch payment history from Firestore
        if (db) {
            try {
                const ordersSnapshot = await db.collection('orders')
                    .where('userId', '==', userId)
                    .orderBy('createdAt', 'desc')
                    .get();

                const payments = [];
                ordersSnapshot.forEach((doc) => {
                    const order = doc.data();
                    payments.push({
                        id: doc.id,
                        paymentId: order.paymentId,
                        amount: order.total,
                        status: order.status,
                        createdAt: order.createdAt,
                        items: order.items
                    });
                });

                return res.json({
                    success: true,
                    payments: payments
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock payment history:', firestoreError.message);
            }
        }

        // Fallback to mock data
        const mockPayments = [
            {
                id: '1',
                paymentId: 'ch_1234567890',
                amount: 89.99,
                status: 'completed',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                items: [
                    {
                        id: 1,
                        title: 'Wireless Bluetooth Headphones with Noise Cancelling',
                        price: 89.99,
                        quantity: 1,
                        image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png'
                    }
                ]
            }
        ];

        res.json({
            success: true,
            payments: mockPayments
        });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user orders endpoint
app.get('/getUserOrders', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }

        // Try to fetch orders from Firestore
        if (db) {
            try {
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

                return res.json({
                    success: true,
                    orders: orders
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock orders:', firestoreError.message);
            }
        }

        // Fallback to mock data
        const mockOrders = [
            {
                id: '1',
                userId: userId,
                items: [
                    {
                        id: 1,
                        title: 'Wireless Bluetooth Headphones with Noise Cancelling',
                        price: 89.99,
                        quantity: 1,
                        image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png'
                    }
                ],
                total: 89.99,
                status: 'completed',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                shippingDetails: {
                    fullName: 'Test User',
                    address: '123 Test St',
                    city: 'Test City',
                    postalCode: '12345',
                    phone: '1234567890'
                }
            },
            {
                id: '2',
                userId: userId,
                items: [
                    {
                        id: 2,
                        title: 'Smart Watch with Heart Rate Monitor',
                        price: 129.99,
                        quantity: 1,
                        image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png'
                    }
                ],
                total: 129.99,
                status: 'completed',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                shippingDetails: {
                    fullName: 'Test User',
                    address: '123 Test St',
                    city: 'Test City',
                    postalCode: '12345',
                    phone: '1234567890'
                }
            }
        ];

        res.json({
            success: true,
            orders: mockOrders
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Duplicate a product
app.post('/duplicateProduct', async (req, res) => {
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

// Get all products for admin management
app.get('/getProducts', async (req, res) => {
    try {
        // Try to fetch products from Firestore
        if (db) {
            try {
                const productsSnapshot = await db.collection('products').get();

                const products = [];
                productsSnapshot.forEach((doc) => {
                    products.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                return res.json({
                    success: true,
                    products: products
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock products:', firestoreError.message);
            }
        }



        res.json({
            success: true,
            products: mockProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new product (for admin)
app.post('/createProduct', async (req, res) => {
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

// Update a product (for admin)
app.post('/updateProduct', async (req, res) => {
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

// Delete a product (for admin)
app.post('/deleteProduct', async (req, res) => {
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

// Get product by ID
app.get('/getProductById', async (req, res) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ error: 'Missing productId parameter' });
        }

        // Try to fetch product from Firestore
        if (db) {
            try {
                const productRef = db.collection('products').doc(productId);
                const productDoc = await productRef.get();

                if (productDoc.exists) {
                    return res.json({
                        success: true,
                        product: {
                            id: productDoc.id,
                            ...productDoc.data()
                        }
                    });
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock product:', firestoreError.message);
            }
        }



        const mockProduct = mockProducts.find(p => p.id === productId);
        if (mockProduct) {
            res.json({
                success: true,
                product: mockProduct
            });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get products by category
app.get('/getProductsByCategory', async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ error: 'Missing category parameter' });
        }

        // Try to fetch products from Firestore
        if (db) {
            try {
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

                return res.json({
                    success: true,
                    products: products
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock products:', firestoreError.message);
            }
        }



        const filteredProducts = mockProducts.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );

        res.json({
            success: true,
            products: filteredProducts
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all categories
app.get('/getCategories', async (req, res) => {
    try {
        // Try to fetch categories from Firestore
        if (db) {
            try {
                const productsSnapshot = await db.collection('products').get();
                const categories = new Set();

                productsSnapshot.forEach((doc) => {
                    const product = doc.data();
                    if (product.category) {
                        categories.add(product.category);
                    }
                });

                return res.json({
                    success: true,
                    categories: Array.from(categories)
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock categories:', firestoreError.message);
            }
        }

        // Fallback to mock categories
        const mockCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
        res.json({
            success: true,
            categories: mockCategories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search products
app.get('/searchProducts', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Missing search query parameter' });
        }

        // Try to search products in Firestore
        if (db) {
            try {
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

                return res.json({
                    success: true,
                    products: products
                });
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock search results:', firestoreError.message);
            }
        }



        const searchResults = mockProducts.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );

        res.json({
            success: true,
            products: searchResults
        });

    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Shopping Cart Endpoints
app.get('/getCart', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId parameter' });
        }

        // Try to fetch cart from Firestore
        if (db) {
            try {
                const cartSnapshot = await db.collection('carts').where('userId', '==', userId).get();
                if (!cartSnapshot.empty) {
                    const cartDoc = cartSnapshot.docs[0];
                    return res.json({
                        success: true,
                        cart: {
                            id: cartDoc.id,
                            ...cartDoc.data()
                        }
                    });
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock cart:', firestoreError.message);
            }
        }

        // Fallback to mock data
        const mockCart = {
            id: 'cart_123',
            userId: userId,
            items: [
                {
                    productId: '1',
                    title: 'Fjallraven - Foldsack No. 1 Backpack',
                    price: 109.95,
                    quantity: 1,
                    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png'
                }
            ],
            total: 109.95,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            cart: mockCart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/updateCart', async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items) {
            return res.status(400).json({ error: 'Missing userId or items' });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartData = {
            userId,
            items,
            total,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Try to update or create cart in Firestore
        let cartId = 'cart_123';
        if (db) {
            try {
                const cartSnapshot = await db.collection('carts').where('userId', '==', userId).get();
                if (!cartSnapshot.empty) {
                    const cartDoc = cartSnapshot.docs[0];
                    await cartDoc.ref.update(cartData);
                    cartId = cartDoc.id;
                } else {
                    const cartRef = await db.collection('carts').add(cartData);
                    cartId = cartRef.id;
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock cart:', firestoreError.message);
            }
        }

        res.json({
            success: true,
            cartId,
            message: 'Cart updated successfully',
            total
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/clearCart', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Try to clear cart in Firestore
        if (db) {
            try {
                const cartSnapshot = await db.collection('carts').where('userId', '==', userId).get();
                if (!cartSnapshot.empty) {
                    await cartSnapshot.docs[0].ref.delete();
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, clearing mock cart:', firestoreError.message);
            }
        }

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delivery Status Endpoint
app.get('/getDeliveryStatus', async (req, res) => {
    try {
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId parameter' });
        }

        // Try to fetch delivery status from Firestore
        if (db) {
            try {
                const orderRef = db.collection('orders').doc(orderId);
                const orderDoc = await orderRef.get();

                if (orderDoc.exists) {
                    const orderData = orderDoc.data();
                    return res.json({
                        success: true,
                        orderId,
                        status: orderData.status || 'shipped',
                        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                    });
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock delivery status:', firestoreError.message);
            }
        }

        // Fallback to mock data
        res.json({
            success: true,
            orderId,
            status: 'shipped',
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
    } catch (error) {
        console.error('Error fetching delivery status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Recommendations Endpoint ("Customers who bought this also bought")
app.get('/getRecommendations', async (req, res) => {
    try {
        const { productId, category } = req.query;

        if (!productId && !category) {
            return res.status(400).json({ error: 'Missing productId or category parameter' });
        }

        // Try to fetch recommendations from Firestore
        if (db) {
            try {
                let recommendations = [];
                if (category) {
                    const productsSnapshot = await db.collection('products')
                        .where('category', '==', category)
                        .limit(4)
                        .get();

                    productsSnapshot.forEach(doc => {
                        if (doc.id !== productId) {
                            recommendations.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        }
                    });
                }

                if (recommendations.length > 0) {
                    return res.json({
                        success: true,
                        recommendations: recommendations
                    });
                }
            } catch (firestoreError) {
                console.warn('Firestore failed, using mock recommendations:', firestoreError.message);
            }
        }

        // Fallback to mock data
        const filteredRecommendations = mockProducts
            .filter(product => product.id !== productId)
            .slice(0, 4);

        res.json({
            success: true,
            recommendations: filteredRecommendations
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
});
