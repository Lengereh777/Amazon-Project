# 🚀 Free Forever Deployment Guide

This guide will help you deploy your Amazon Clone completely **FREE** with no credit card required.

---

## 📋 Prerequisites

- GitHub account (free)
- Render account (free) - https://render.com
- Supabase account (free) - https://supabase.com

---

## 🗺️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Supabase      │
│   (Render)      │     │   (Render)      │     │   (Database)    │
│   FREE          │     │   FREE          │     │   FREE          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Total Cost: $0/month**

---

## Step 1: Set Up Supabase (Database) - FREE

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 1.2 Create New Project
1. Click "New Project"
2. Name: `amazon-clone`
3. Database Password: (auto-generate or create your own)
4. Region: Choose closest to you
5. Click "Create new project"

### 1.3 Get Your Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_KEY` (keep secret!)

### 1.4 Create Database Tables
Go to SQL Editor and run:

```sql
-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image TEXT,
    rating_rate DECIMAL(2,1),
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
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

-- Cart table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (title, price, description, category, image, rating_rate, rating_count) VALUES
('Fjallraven Backpack', 109.95, 'Your perfect pack for everyday use', 'mens clothing', 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.png', 3.9, 120),
('Mens Casual T-Shirts', 22.30, 'Slim-fitting style, contrast raglan long sleeve', 'mens clothing', 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.png', 4.1, 259),
('Mens Cotton Jacket', 55.99, 'Great outerwear jackets for Spring/Autumn/Winter', 'mens clothing', 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.png', 4.7, 500),
('Gold Dragon Bracelet', 695.00, 'From our Legends Collection', 'jewelery', 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.png', 4.6, 400);
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already)
```bash
cd Amazon-project
git init
git add .
git commit -m "Initial commit - Amazon Clone"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `amazon-clone`
3. Make it **Public** (required for free Render)
4. Click "Create repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/amazon-clone.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend on Render - FREE

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 3.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `amazon-clone-backend`
   - **Region**: Oregon (or closest)
   - **Branch**: main
   - **Root Directory**: `Backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: FREE

### 3.3 Add Environment Variables
Click "Advanced" and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `SUPABASE_URL` | (your Supabase URL) |
| `SUPABASE_SERVICE_KEY` | (your Supabase service key) |

### 3.4 Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Note your backend URL: `https://amazon-clone-backend.onrender.com`

---

## Step 4: Deploy Frontend on Render - FREE

### 4.1 Create Static Site
1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `amazon-clone-frontend`
   - **Region**: Oregon (or closest)
   - **Branch**: main
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: FREE

### 4.2 Add Environment Variables
Click "Advanced" and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://amazon-clone-backend.onrender.com` |
| `VITE_SUPABASE_URL` | (your Supabase URL) |
| `VITE_SUPABASE_ANON_KEY` | (your Supabase anon key) |

### 4.3 Deploy
1. Click "Create Static Site"
2. Wait 2-3 minutes for deployment
3. Your app is live at: `https://amazon-clone-frontend.onrender.com`

---

## 🎉 You're Live!

Your Amazon Clone is now deployed completely FREE:

- **Frontend**: https://amazon-clone-frontend.onrender.com
- **Backend**: https://amazon-clone-backend.onrender.com
- **Database**: Supabase Dashboard

---

## 📊 Free Tier Limits

| Service | Limit | What Happens |
|---------|-------|--------------|
| Render Web Service | 750 hours/month | Service sleeps after 15 min inactivity |
| Render Static Site | Unlimited | Always available |
| Supabase | 500MB database | Upgrade if needed |

**Note**: Free backend "sleeps" after 15 minutes of inactivity. First request after sleep takes ~30 seconds to "wake up".

---

## 🔄 Auto-Deploy

Both services auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## 🛠️ Troubleshooting

### Backend Not Starting
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Make sure `PORT` is set to `5000`

### Frontend Shows Blank Page
1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` is correct
3. Make sure backend is running

### CORS Errors
The backend already has CORS enabled. If issues persist, add your frontend URL to the CORS origin list in `server.js`.

### Database Connection Issues
1. Verify Supabase credentials
2. Check if tables exist in Supabase dashboard
3. Ensure service_role key is used for backend

---

## 🚀 Alternative: One-Click Deploy with render.yaml

If you have the `render.yaml` file in your repo root:

1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your repository
4. Render will create both services automatically
5. Add your environment variables

---

## 📱 Quick Reference URLs

| Resource | URL |
|----------|-----|
| Render Dashboard | https://dashboard.render.com |
| Supabase Dashboard | https://supabase.com/dashboard |
| GitHub Repo | https://github.com/YOUR_USERNAME/amazon-clone |

---

## ✅ Deployment Checklist

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Credentials copied
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Frontend deployed on Render
- [ ] Frontend environment variables set
- [ ] App tested and working

---

## 💡 Pro Tips

1. **Keep Backend Awake**: Use a free service like UptimeRobot to ping your backend every 10 minutes
2. **Monitor Logs**: Check Render logs regularly for errors
3. **Database Backups**: Supabase provides free daily backups
4. **Custom Domain**: Add your own domain in Render settings (free)

---

## 🔐 Security Notes

- Never commit `.env` files to GitHub
- Keep `service_role` key secret
- Use `anon` key for frontend
- Enable Row Level Security in Supabase

---

## 📞 Support

- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Docs: https://docs.github.com
