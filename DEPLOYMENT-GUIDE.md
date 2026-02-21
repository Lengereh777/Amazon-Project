# Amazon Clone - Deployment Guide

This guide covers deploying the Amazon Clone application to production.

## Prerequisites

- GitHub account with repository access
- Netlify account (https://app.netlify.com)
- Firebase account with a project set up
- Stripe account for payment processing

---

## Part 1: Push Code to GitHub

Your code is now pushed to: https://github.com/Lengereh777/Amazon-Project

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Connect GitHub to Netlify

1. Go to https://app.netlify.com/teams/lengereh777/projects
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" as the source
4. Authorize Netlify to access your GitHub repositories
5. Select the repository: `Lengereh777/Amazon-Project`

### Step 2: Configure Build Settings

Configure the following settings:

| Setting | Value |
|---------|-------|
| Base directory | `Frontend` |
| Build command | `npm run build` |
| Publish directory | `Frontend/dist` |
| Node version | 18 |

### Step 3: Set Environment Variables

In Netlify dashboard, go to Site settings → Environment variables and add:

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at: `https://your-site-name.netlify.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed

---

## Part 3: Deploy Backend to Firebase Functions

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase (if not already done)

```bash
cd Backend
firebase init
```

Select:
- Functions
- Hosting (optional)
- Use existing project or create new

### Step 4: Set Environment Variables

Set secrets for your Firebase functions:

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY
```

Or set environment config:

```bash
firebase functions:config:set stripe.secret_key="your_stripe_secret_key"
firebase functions:config:set frontend.url="https://your-netlify-site.netlify.app"
```

### Step 5: Deploy to Firebase

```bash
cd Backend
npm run deploy:firebase
```

Or manually:

```bash
firebase deploy --only functions
```

### Step 6: Get Your Backend URL

After deployment, your API will be available at:
```
https://us-central1-your-project-id.cloudfunctions.net/app
```

Update your frontend's `VITE_API_BASE_URL` in Netlify environment variables.

---

## Part 4: Configure CORS

Make sure your backend allows requests from your Netlify domain.

In `Backend/server.js` or `Backend/functions/index.js`, update CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site-name.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

---

## Part 5: Update Frontend API URL

After deploying your backend, update the frontend environment variable:

1. Go to Netlify → Site settings → Environment variables
2. Update `VITE_API_BASE_URL` to your Firebase Functions URL
3. Trigger a new deploy

---

## Continuous Deployment

With Netlify connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- You can configure branch deploys for testing

---

## Troubleshooting

### Build Fails on Netlify

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility

### API Connection Issues

1. Check CORS configuration on backend
2. Verify `VITE_API_BASE_URL` is correct
3. Check browser console for errors

### Firebase Functions Deployment Fails

1. Ensure you're logged in: `firebase login`
2. Check Firebase project quota
3. Verify all environment variables are set

---

## Quick Reference

| Service | URL |
|---------|-----|
| GitHub Repo | https://github.com/Lengereh777/Amazon-Project |
| Netlify Dashboard | https://app.netlify.com/teams/lengereh777/projects |
| Firebase Console | https://console.firebase.google.com |
| Stripe Dashboard | https://dashboard.stripe.com |

---

## Environment Variables Checklist

### Frontend (Netlify)
- [ ] VITE_API_BASE_URL
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_FIREBASE_MEASUREMENT_ID
- [ ] VITE_STRIPE_PUBLISHABLE_KEY

### Backend (Firebase Functions)
- [ ] STRIPE_SECRET_KEY
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY
- [ ] FRONTEND_URL