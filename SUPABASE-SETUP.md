# Supabase Setup Guide for Amazon Clone

This guide will help you set up Supabase as the database and authentication provider for the Amazon Clone project.

## Prerequisites

- A Supabase account (free tier available at https://supabase.com)
- Node.js installed on your machine

## Step 1: Create a Supabase Project

### Option A: Via Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Select or create an organization
4. Enter project details:
   - **Name**: `amazon-clone`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be provisioned

### Option B: Via CLI

First, find your organization ID:
```bash
supabase orgs list
```

Then create the project:
```bash
supabase projects create --org-id YOUR_ORG_ID --name "amazon-clone"
```

## Step 2: Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys")
   - **service_role key** (keep this secret! - for backend only)

4. Navigate to **Settings** → **Database**
5. Copy the following:
   - **Connection string** (for backend connection)

## Step 3: Set Up Environment Variables

### Frontend (.env)
Create/update `Frontend/.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Backend (.env)
Create `Backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

## Step 4: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase Auth)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(100),
    image_url TEXT,
    images TEXT[],
    rating_rate DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB,
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    image_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update products" ON products
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for cart
CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 5: Insert Sample Products

Run this SQL to add sample products:

```sql
INSERT INTO products (title, description, price, original_price, category, image_url, rating_rate, rating_count, stock, is_featured) VALUES
('Fjallraven - Foldsack No. 1 Backpack', 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.', 109.95, 129.95, 'bags', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', 3.9, 120, 50, true),
('Mens Casual Premium Slim Fit T-Shirts', 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric.', 22.30, 29.99, 'mens clothing', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 4.1, 259, 100, true),
('Mens Cotton Jacket', 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.', 55.99, 79.99, 'mens clothing', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', 4.7, 500, 75, false),
('John Hardy Legends Naga Bracelet', 'From our Legends Collection, inspired by the mythical water dragon.', 695.00, 850.00, 'jewelery', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg', 4.6, 400, 30, true),
('Solid Gold Petite Micropave Ring', 'Satisfaction Guaranteed. Return or exchange any order within 30 days.', 168.00, 199.00, 'jewelery', 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', 3.9, 70, 45, false),
('WD 2TB Elements Portable External Hard Drive', 'USB 3.0 and USB 2.0 compatibility. Data transfer up to 5Gbps.', 64.00, 89.99, 'electronics', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', 3.3, 203, 200, true),
('SanDisk SSD PLUS 1TB Internal SSD', 'Easy upgrade for faster boot up, shutdown, application load and response.', 109.00, 149.00, 'electronics', 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', 2.9, 470, 150, false),
('Silicon Power 256GB SSD', '3D NAND flash memory for higher performance and reliability.', 109.00, 139.00, 'electronics', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', 4.8, 319, 180, false),
('Rain Jacket Women Windbreaker', 'Lightweight perfect for trip or casual wear with adjustable drawstring waist.', 39.99, 59.99, 'womens clothing', 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', 3.8, 679, 90, true),
('MBJ Women Solid Short Sleeve Boat Neck V', '95% RAYON 5% SPANDEX, Made in USA, Lightweight fabric with great stretch.', 9.85, 15.99, 'womens clothing', 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', 4.7, 130, 120, false);
```

## Step 6: Install Dependencies

### Frontend
```bash
cd Frontend
npm install @supabase/supabase-js
```

### Backend
```bash
cd Backend
npm install @supabase/supabase-js
```

## Step 7: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider (enabled by default)
3. Optionally enable other providers:
   - Google
   - GitHub
   - Facebook
   - etc.

### For Google OAuth (Optional):
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## Step 8: Test Your Setup

After completing all steps, test your connection:

```javascript
// Test script
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-key'
)

// Test connection
const { data, error } = await supabase.from('products').select('*').limit(1)
console.log('Connection test:', error ? 'Failed' : 'Success', data)
```

## Troubleshooting

### "org_id is required" Error
This error occurs when using the Supabase CLI without specifying an organization. Solutions:
1. Use the dashboard to create projects (easiest)
2. List your organizations: `supabase orgs list`
3. Create with org ID: `supabase projects create --org-id YOUR_ORG_ID`

### Connection Refused
- Check that your SUPABASE_URL is correct
- Verify your API keys are valid
- Ensure your IP is not blocked (check Auth settings)

### RLS Policy Errors
- Make sure you're authenticated when accessing protected tables
- Check that RLS policies are correctly set up
- Use the service role key for admin operations (backend only)

## Next Steps

1. Update your frontend code to use Supabase client
2. Update your backend to use Supabase instead of Firebase Admin
3. Test authentication flow
4. Test CRUD operations for products and orders

## Useful Commands

```bash
# Start local Supabase (for development)
supabase start

# Stop local Supabase
supabase stop

# Generate TypeScript types from your database
supabase gen types typescript --project-id your-project-id > types/supabase.ts

# Push local changes to remote
supabase db push

# Reset local database
supabase db reset
```
