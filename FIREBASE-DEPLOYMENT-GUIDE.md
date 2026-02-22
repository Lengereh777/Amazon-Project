# Firebase Deployment Guide for Amazon Clone

## Current Deployment Status

### ✅ Frontend - Successfully Deployed
- **Live URL:** https://amanzon-clone-915c3.web.app
- **Alternative URL:** https://amanzon-clone-915c3.firebaseapp.com
- **Project ID:** amanzon-clone-915c3

### ⏳ Backend Functions - Requires Blaze Plan
Cloud Functions deployment requires the Firebase Blaze (pay-as-you-go) plan.

---

## Step-by-Step Deployment Instructions

### Part 1: Upgrade to Blaze Plan (Required for Functions)

1. Go to Firebase Console:
   https://console.firebase.google.com/project/amanzon-clone-915c3/usage/details

2. Click **"Upgrade"** or **"Modify plan"**

3. Select **"Blaze"** (pay-as-you-go) plan
   - Note: You get a free tier for Functions even on Blaze
   - You only pay for usage beyond the free tier

4. Set up billing with a credit card

5. Wait 2-5 minutes for the upgrade to propagate

---

### Part 2: Deploy Backend Functions

After upgrading to Blaze, run:

```bash
cd Amazon-project/Backend
firebase deploy --only functions
```

Your API will be available at:
```
https://us-central1-amanzon-clone-915c3.cloudfunctions.net/[function-name]
```

Available Functions:
- `createPaymentIntent` - Stripe payment intents
- `processPayment` - Process payments
- `getUserOrders` - Fetch user orders
- `duplicateProduct` - Duplicate products

---

### Part 3: Configure Stripe (Required for Payments)

Set your Stripe secret key:

```bash
firebase functions:config:set stripe.secret_key="sk_live_your_stripe_secret_key"
```

Then redeploy:
```bash
firebase deploy --only functions
```

---

### Part 4: Update Frontend Environment

After deploying functions, update your Frontend `.env`:

```env
VITE_API_BASE_URL=https://us-central1-amanzon-clone-915c3.cloudfunctions.net
```

Then rebuild and redeploy the frontend:
```bash
cd Amazon-project/Frontend
npm run build
firebase deploy --only hosting
```

---

## Quick Reference Commands

### Deploy Frontend Only
```bash
cd Amazon-project/Frontend
npm run build
firebase deploy --only hosting
```

### Deploy Backend Functions Only
```bash
cd Amazon-project/Backend
firebase deploy --only functions
```

### Deploy Everything from Backend
```bash
cd Amazon-project/Backend
firebase deploy
```

### View Function Logs
```bash
firebase functions:log
```

### Emulate Functions Locally
```bash
cd Amazon-project/Backend
firebase emulators:start --only functions
```

---

## Firebase Console Links

| Resource | URL |
|----------|-----|
| Project Overview | https://console.firebase.google.com/project/amanzon-clone-915c3/overview |
| Hosting | https://console.firebase.google.com/project/amanzon-clone-915c3/hosting |
| Functions | https://console.firebase.google.com/project/amanzon-clone-915c3/functions |
| Firestore | https://console.firebase.google.com/project/amanzon-clone-915c3/firestore |
| Usage & Billing | https://console.firebase.google.com/project/amanzon-clone-915c3/usage/details |

---

## Troubleshooting

### "Must be on Blaze plan" Error
- Complete the Blaze plan upgrade
- Wait 5 minutes for propagation
- Retry the deployment

### Build Errors
```bash
cd Amazon-project/Frontend
rm -rf node_modules
npm install
npm run build
```

### Functions Deployment Errors
```bash
cd Amazon-project/Backend/functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

### CORS Errors
Update the CORS settings in `Backend/functions/index.js` to include your hosting URL:
```javascript
const cors = require('cors')({ 
  origin: [
    'https://amanzon-clone-915c3.web.app',
    'https://amanzon-clone-915c3.firebaseapp.com'
  ],
  credentials: true 
});
```

---

## Files Created for Firebase Deployment

| File | Purpose |
|------|---------|
| `Frontend/firebase.json` | Hosting configuration |
| `Frontend/.firebaserc` | Project association |
| `Backend/.firebaserc` | Project association |
| `Backend/firebase.json` | Functions configuration |
| `Backend/functions/package.json` | Functions dependencies |
