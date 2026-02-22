# Netlify Free Deployment Guide

## Netlify Free Plan Overview

Netlify offers a **free plan with 300 credits/month** for new accounts. Here's how credits work:

### Credit Usage Breakdown

| Feature | Credit Cost |
|---------|-------------|
| Production Deploy | 15 credits each |
| Deploy Previews | 0 credits (FREE) |
| Branch Deploys | 0 credits (FREE) |
| Bandwidth | 10 credits per GB |
| Web Requests | 3 credits per 10,000 requests |
| Form Submissions | 1 credit each |

### What This Means for Your Amazon Clone

With **300 free credits/month**, you can:
- **20 production deploys** (20 × 15 = 300 credits), OR
- **30 GB bandwidth** (30 × 10 = 300 credits), OR
- **1 million web requests** (100 × 3 = 300 credits)

**Realistic estimate for a small app:**
- 5 production deploys = 75 credits
- 10 GB bandwidth = 100 credits
- 300,000 requests = 90 credits
- **Total: 265 credits** (within free tier!)

---

## Step-by-Step Netlify Deployment

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign up" → Choose "GitHub"
3. Authorize Netlify to access your GitHub

### Step 2: Deploy Frontend

#### Option A: Connect via Netlify Dashboard
1. Click "Add new site" → "Import an existing project"
2. Select "GitHub" → Choose `Lengereh777/Amazon-Project`
3. Configure:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
4. Click "Deploy site"

#### Option B: Deploy via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from Frontend directory
cd Amazon-project/Frontend
netlify deploy --prod
```

### Step 3: Set Environment Variables

In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Add these variables:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | Your backend URL |
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### Step 4: Trigger New Deploy
After adding environment variables:
1. Go to "Deploys" tab
2. Click "Trigger Deploy" → "Deploy site"

---

## Backend Deployment Options

Netlify Functions can host your backend, but for a full Express server, use:

### Option 1: Render (Recommended - FREE)
- Free Web Service with 750 hours/month
- See [`FREE-DEPLOYMENT-GUIDE.md`](FREE-DEPLOYMENT-GUIDE.md) for details

### Option 2: Railway ($5/month)
- More reliable for backend services
- Better for production apps

### Option 3: Convert to Netlify Functions
If you want everything on Netlify, convert your Express routes to serverless functions:

```javascript
// netlify/functions/products.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});

exports.handler = serverless(app);
```

---

## Netlify Configuration File

The [`Frontend/netlify.toml`](Frontend/netlify.toml) file configures:
- Build settings
- SPA routing (redirects)
- Security headers
- Caching rules

---

## Monitoring Credit Usage

1. Go to Netlify Dashboard
2. Click on your team → "Billing"
3. View "Credit usage" section

You'll see:
- Credits used this month
- Breakdown by feature
- Projected usage

---

## Tips to Maximize Free Credits

1. **Minimize Production Deploys**
   - Use Deploy Previews for testing (FREE)
   - Only deploy to production when ready

2. **Optimize Assets**
   - Compress images
   - Use modern formats (WebP)
   - Enable Gzip/Brotli compression

3. **Use CDN for Large Files**
   - Host images on Supabase Storage
   - Use external CDNs for libraries

4. **Cache Aggressively**
   - The `netlify.toml` already sets 1-year cache for assets
   - This reduces bandwidth and requests

---

## Free Tier Comparison

| Feature | Netlify Free | Render Free | Vercel Free |
|---------|--------------|-------------|-------------|
| Frontend Hosting | ✅ 300 credits | ✅ Unlimited | ✅ Unlimited |
| Backend Hosting | ❌ Limited | ✅ 750 hrs | ❌ Limited |
| Database | ❌ | ❌ | ❌ |
| Best For | Frontend | Full Stack | Frontend |

**Recommendation**: Use **Netlify for Frontend** + **Render for Backend** + **Supabase for Database** = **100% FREE**

---

## Quick Deploy Commands

```bash
# Deploy to Netlify
cd Amazon-project/Frontend
netlify deploy --prod

# Or connect via dashboard and push to GitHub
git add .
git commit -m "Update site"
git push origin main
# Netlify auto-deploys!
```

---

## Troubleshooting

### Build Fails
1. Check build logs in Netlify dashboard
2. Verify `NODE_VERSION = "18"` in environment
3. Ensure all dependencies are in `package.json`

### Environment Variables Not Working
1. Variables must start with `VITE_` for frontend access
2. Rebuild after adding variables
3. Check variable names are exact (case-sensitive)

### Site Shows Blank Page
1. Check browser console for errors
2. Verify API URL is correct
3. Ensure backend is running and accessible

### Credits Running Out
1. Review usage in billing dashboard
2. Optimize images and assets
3. Consider upgrading to Personal plan ($19/month, 1000 credits)
