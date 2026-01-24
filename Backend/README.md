# Backend for Amazon Clone

This directory contains the backend server for the Amazon Clone application. It supports both Firebase Functions and standalone Node.js server deployment (for platforms like Render).

## Server Options

### Option 1: Standalone Node.js Server (Recommended for Render/VPS)
A complete Express.js server with all API endpoints

### Option 2: Firebase Functions
Serverless deployment on Firebase Cloud Functions

## Installation

1. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in `.env` with your own values:
   - Firebase Service Account Key (from Firebase Console)
   - Stripe API Keys (from Stripe Dashboard)

## Standalone Server Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server will run on port 5000 by default. Health check endpoint: `http://localhost:5000/health`

## Firebase Functions Usage

### Set up Firebase configuration:
```bash
firebase login
firebase init functions
```

### Set Stripe secret key in Firebase config:
```bash
firebase functions:config:set stripe.secret_key="your_stripe_secret_key"
```

### Development (Local Emulator)
```bash
npm run serve:firebase
```

### Deployment to Firebase
```bash
npm run deploy:firebase
```

## API Endpoints

### Payment Endpoints

#### Create Payment Intent
- **Endpoint**: `/createPaymentIntent`
- **Method**: POST
- **Body**: `{ amount: number, currency: string }`
- **Response**: `{ success: boolean, paymentIntentId: string, clientSecret: string }`

#### Process Payment
- **Endpoint**: `/processPayment`
- **Method**: POST
- **Body**: `{ token: object, amount: number, items: array, userId: string, orderId?: string }`
- **Response**: `{ success: boolean, orderId: string, paymentId: string, message: string }`

### Order Endpoints

#### Get User Orders
- **Endpoint**: `/getUserOrders`
- **Method**: GET
- **Query Params**: `userId`
- **Response**: `{ success: boolean, orders: array }`

### Product Management Endpoints (Admin)

#### Get All Products
- **Endpoint**: `/getProducts`
- **Method**: GET
- **Response**: `{ success: boolean, products: array }`

#### Get Product by ID
- **Endpoint**: `/getProductById`
- **Method**: GET
- **Query Params**: `productId`
- **Response**: `{ success: boolean, product: object }`

#### Get Products by Category
- **Endpoint**: `/getProductsByCategory`
- **Method**: GET
- **Query Params**: `category`
- **Response**: `{ success: boolean, products: array }`

#### Get All Categories
- **Endpoint**: `/getCategories`
- **Method**: GET
- **Response**: `{ success: boolean, categories: array }`

#### Create Product
- **Endpoint**: `/createProduct`
- **Method**: POST
- **Body**: `{ title: string, price: number, description: string, category: string, image: string, rating?: object }`
- **Response**: `{ success: boolean, productId: string, message: string }`

#### Update Product
- **Endpoint**: `/updateProduct`
- **Method**: POST
- **Body**: `{ productId: string, productData: object }`
- **Response**: `{ success: boolean, productId: string, message: string }`

#### Delete Product
- **Endpoint**: `/deleteProduct`
- **Method**: POST
- **Body**: `{ productId: string }`
- **Response**: `{ success: boolean, productId: string, message: string }`

#### Duplicate Product
- **Endpoint**: `/duplicateProduct`
- **Method**: POST
- **Body**: `{ productId: string, newTitle?: string, newPrice?: number }`
- **Response**: `{ success: boolean, productId: string, message: string }`

### Shopping Cart Endpoints

#### Get Cart
- **Endpoint**: `/getCart`
- **Method**: GET
- **Query Params**: `userId`
- **Response**: `{ success: boolean, cart: object }`

#### Update Cart
- **Endpoint**: `/updateCart`
- **Method**: POST
- **Body**: `{ userId: string, items: array }`
- **Response**: `{ success: boolean, cartId: string, message: string, total: number }`

#### Clear Cart
- **Endpoint**: `/clearCart`
- **Method**: POST
- **Body**: `{ userId: string }`
- **Response**: `{ success: boolean, message: string }`

### Delivery Status Endpoint

#### Get Delivery Status
- **Endpoint**: `/getDeliveryStatus`
- **Method**: GET
- **Query Params**: `orderId`
- **Response**: `{ success: boolean, orderId: string, status: string, estimatedDelivery: string, trackingNumber: string }`

### Recommendations Endpoint ("Customers who bought this also bought")

#### Get Recommendations
- **Endpoint**: `/getRecommendations`
- **Method**: GET
- **Query Params**: `productId` (optional), `category` (optional)
- **Response**: `{ success: boolean, recommendations: array }`

### Health Check
- **Endpoint**: `/health`
- **Method**: GET
- **Response**: `{ success: boolean, message: string, timestamp: string }`

## Firestore Structure

### Carts Collection
```
carts/
├── {cartId}/
│   ├── userId: string
│   ├── items: array
│   ├── total: number
│   └── updatedAt: timestamp
```

### Products Collection
```
products/
├── {productId}/
│   ├── title: string
│   ├── price: number
│   ├── description: string
│   ├── category: string
│   ├── image: string
│   ├── rating: object (rate, count)
│   ├── createdAt: timestamp
│   ├── updatedAt?: timestamp
│   ├── duplicatedFrom?: string
│   └── isDuplicate?: boolean
```

### Orders Collection
```
orders/
├── {orderId}/
│   ├── userId: string
│   ├── items: array
│   ├── total: number
│   ├── paymentId: string
│   ├── status: string (completed)
│   ├── createdAt: timestamp
│   └── shippingDetails: object
```

## Deployment Options

### Option 1: Render (Recommended)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Option 2: Firebase Cloud Functions
1. Deploy using `npm run deploy:firebase`
2. Functions will be available at: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/functionName`

## Environment Variables

The following environment variables are required:
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON string
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `PORT` - Server port (default: 5000)

For Firebase Functions, use `firebase functions:config:set` to set environment variables.

