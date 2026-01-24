# Backend Folder Structure and Files

## Overview
The backend for the Amazon clone project is a Node.js/Express server with Firebase Admin SDK integration for Firestore database and Stripe API for payment processing. It provides RESTful API endpoints for managing products, orders, and payments.

## Backend Files

### 1. package.json
**Path:** `Backend/package.json`
- Project metadata and dependencies
- Scripts for starting, developing, linting, and deploying
- Dependencies: Express, CORS, Firebase Admin, Stripe, dotenv
- DevDependencies: Nodemon, ESLint

### 2. server.js (Main Express Server)
**Path:** `Backend/server.js`
- Express server configuration
- Firebase Admin SDK initialization
- Stripe API integration
- RESTful API endpoints
- Error handling with mock data fallback
- CORS and JSON middleware

### 3. index.js (Firebase Functions)
**Path:** `Backend/index.js`
- Firebase Cloud Functions implementation
- Duplicate functionality of server.js but optimized for Firebase Functions environment
- Uses Firebase Functions API and Firestore directly

### 4. .env
**Path:** `Backend/.env`
- Environment variables file (not version controlled)
- Contains sensitive information like Stripe secret key and Firebase service account key

### 5. .env.example
**Path:** `Backend/.env.example`
- Template for environment variables
- Shows required fields without sensitive data

### 6. .gitignore
**Path:** `Backend/.gitignore`
- Specifies files and directories to be ignored by Git
- Excludes node_modules, .env, and other temporary files

### 7. README.md
**Path:** `Backend/README.md`
- Project documentation
- Setup and deployment instructions

### 8. backend_files_summary.txt
**Path:** `Backend/backend_files_summary.txt`
- Summary of backend file structure and purposes

## API Endpoints

### Payment Endpoints
- `POST /createPaymentIntent`: Creates a Stripe payment intent
- `POST /processPayment`: Processes payments and creates orders

### Order Endpoints
- `GET /getUserOrders`: Retrieves all orders for a specific user

### Product Endpoints
- `GET /getProducts`: Gets all products (admin)
- `POST /createProduct`: Creates a new product (admin)
- `POST /updateProduct`: Updates an existing product (admin)
- `POST /deleteProduct`: Deletes a product (admin)
- `GET /getProductById`: Gets a single product by ID
- `GET /getProductsByCategory`: Gets products by category
- `GET /getCategories`: Gets all unique categories
- `POST /duplicateProduct`: Duplicates a product with optional modifications
- `GET /searchProducts`: Searches products by title, category, or description

## Key Features

### Payment Processing
- Integration with Stripe API
- Payment intent creation
- Payment confirmation and order creation
- Fallback to mock data for testing

### Product Management
- Full CRUD operations for products
- Product duplication with modifications
- Category-based filtering
- Admin-only endpoints

### Order Management
- Order creation on successful payment
- User order history retrieval
- Order data includes items, total, status, and shipping details

### Firebase Integration
- Firestore database for data storage
- Firebase Admin SDK for server-side operations
- Environment variable configuration for service account

### Error Handling
- Input validation
- Error logging
- Mock data fallback for API failures
- Comprehensive error responses

## Deployment Options

### 1. Firebase Cloud Functions
- Serverless deployment
- Automatic scaling
- Firebase Hosting integration
- Command: `npm run deploy:firebase`

### 2. Traditional Server Deployment (Render, Heroku, etc.)
- Express server running on Node.js
- Requires environment variable configuration
- Command: `npm start`

### 3. Local Development
- Nodemon for automatic restart
- Command: `npm run dev`
- Runs on port 5000 (or custom port from .env)

## Environment Variables

Required variables in .env file:
```
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key_json
```

## Dependencies

### Core
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **Firebase Admin**: Server-side Firebase integration
- **Stripe**: Payment processing API
- **dotenv**: Environment variable management

### Development
- **Nodemon**: Automatic server restart
- **ESLint**: Code linting
- **ESLint Config Google**: ESLint configuration

## Project Structure

```
Backend/
├── index.js              # Firebase Functions implementation
├── server.js             # Express server implementation
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Dependency lock file
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
└── backend_files_summary.txt  # File structure summary
```

## Usage

### Installation
```bash
cd Backend
npm install
```

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
# Firebase Functions
npm run deploy:firebase

# Traditional server
npm start
```

## Integration with Frontend

The backend API is called from the frontend using the API methods defined in:
- `Frontend/src/Api/api.js`: Generic API calls
- `Frontend/src/Api/stripe.js`: Stripe-specific API calls

All API endpoints follow RESTful conventions and return JSON responses with `success` status and data payloads.
