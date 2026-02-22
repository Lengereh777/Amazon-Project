# Complete Deployment Guide for Amazon Clone

## Current Status Analysis

### Issues Identified:
1. **Firebase Project Paused**: The project `amanzon-clone-915c3` appears to be paused
2. **Mock Authentication**: Frontend uses mock auth instead of real Firebase
3. **Placeholder Credentials**: `.env` files contain placeholder values
4. **Backend Requirements**: Firebase Functions require Blaze (paid) plan

---

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

#### Frontend Deployment on Render

1. **Create a Render account** at https://render.com

2. **Create a new Static Site**:
   - Connect your GitHub repository
   - Select the `Amazon-project/Frontend` directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variables in Render dashboard

3. **Environment Variables for Frontend**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

#### Backend Deployment on Render

1. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `Amazon-project/Backend` directory
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select "Free" tier

2. **Environment Variables for Backend**:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NODE_ENV=production
   ```

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy from Frontend directory**:
   ```bash
   cd Amazon-project/Frontend
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

#### Backend on Render
Follow the same steps as Option 1 for backend deployment.

---

### Option 3: Railway (Full Stack)

1. **Create Railway account** at https://railway.app

2. **Deploy Backend**:
   - Create new project from GitHub
   - Select Backend directory
   - Add environment variables

3. **Deploy Frontend**:
   - Create new project from GitHub
   - Select Frontend directory
   - Set build and start commands

---

## Setting Up Supabase (Recommended Database)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon/service keys

### Step 2: Set Up Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url TEXT,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Cart table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Policies for orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
```

---

## Quick Start Deployment (Render)

### Step 1: Prepare Frontend

Create `render.yaml` in the root directory:

```yaml
services:
  - type: web
    name: amazon-clone-backend
    env: node
    buildCommand: cd Backend && npm install
    startCommand: cd Backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false

  - type: static
    name: amazon-clone-frontend
    buildCommand: cd Frontend && npm install && npm run build
    staticPublishPath: Frontend/dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://amazon-clone-backend.onrender.com
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create services
5. Add your environment variables

---

## Environment Variables Checklist

### Frontend (.env.production)
- [ ] `VITE_API_BASE_URL` - Backend URL
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Backend (.env)
- [ ] `PORT` - Server port (usually 5000)
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_SERVICE_KEY` - Supabase service role key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `NODE_ENV` - Set to "production"

---

## Testing Deployment

### Test Frontend
```bash
curl https://your-frontend.onrender.com
```

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

### Test API Endpoints
```bash
# Get products
curl https://your-backend.onrender.com/api/products

# Health check
curl https://your-backend.onrender.com/health
```

---

## Troubleshooting

### Build Fails
1. Check Node.js version compatibility (use Node 18)
2. Verify all dependencies are in package.json
3. Check build logs for specific errors

### CORS Errors
Update backend CORS settings to include your frontend URL:
```javascript
app.use(cors({
    origin: ['https://your-frontend.onrender.com'],
    credentials: true
}));
```

### Environment Variables Not Working
1. Verify variables are set in hosting dashboard
2. Rebuild/redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Database Connection Issues
1. Verify Supabase credentials
2. Check if IP is whitelisted (if applicable)
3. Ensure tables exist and RLS policies are correct

---

## Cost Comparison

| Platform | Frontend | Backend | Database |
|----------|----------|---------|----------|
| Render | Free | Free | Supabase Free |
| Vercel + Render | Free | Free | Supabase Free |
| Railway | $5/month | $5/month | Included |
| Firebase | Free | Blaze Plan Required | Free tier |

**Recommended**: Render + Supabase (completely free for development/small apps)

---

## Next Steps

1. Choose your deployment platform
2. Set up Supabase database
3. Configure environment variables
4. Deploy backend first
5. Update frontend API URL
6. Deploy frontend
7. Test all functionality

For detailed platform-specific instructions, see the individual guides:
- `RENDER-DEPLOYMENT.md` (to be created)
- `VERCEL-DEPLOYMENT.md` (to be created)
