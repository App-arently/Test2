# FanMerch AI - Complete Setup Guide

This guide will walk you through setting up all the required services for FanMerch AI.

## Prerequisites

- Node.js 18+ installed
- Git installed
- A credit card (for Vercel, Google Cloud - free tiers available)

---

## Step 1: Initial Project Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

---

## Step 2: Database Setup (Vercel Postgres)

### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/signup
2. Create an account or sign in
3. Click "Add New..." → "Project"
4. Import your Git repository (or skip for now)
5. Go to the "Storage" tab
6. Click "Create Database"
7. Select "Postgres"
8. Click "Continue"
9. Copy the environment variables shown:
   ```
   POSTGRES_PRISMA_URL="..."
   POSTGRES_URL_NON_POOLING="..."
   ```
10. Paste these into your `.env.local` file

### Option B: Local Development (PostgreSQL)

If you prefer local development:

```bash
# Install PostgreSQL locally
# Then set:
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/fanmerch"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/fanmerch"
```

### Initialize Database

```bash
npx prisma generate
npx prisma db push
```

---

## Step 3: Google Cloud Setup (Imagen 3)

### Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it "fanmerch-ai"
4. Click "Create"

### Enable Vertex AI API

1. In the search bar, type "Vertex AI API"
2. Click "Enable"
3. Wait for enablement to complete

### Enable Billing

1. Go to "Billing" in the left menu
2. Link a billing account (free tier available - $300 credit)

### Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name: `fanmerch-ai-service`
4. Click "Create and Continue"
5. Role: Select "Vertex AI User"
6. Click "Continue" → "Done"

### Download Credentials

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Save the file as `service-account-key.json` in your project root

### Set Environment Variables

Add to `.env.local`:
```bash
GOOGLE_CLOUD_PROJECT_ID="fanmerch-ai"  # Your project ID
GOOGLE_CLOUD_LOCATION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
```

**Important:** Never commit `service-account-key.json` to git!

### Verify Setup

Test the API:
```bash
# This will be tested when you run the app
npm run dev
```

---

## Step 4: Stripe Setup

### Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Create an account
3. You'll start in "Test Mode" (perfect for development)

### Get API Keys

1. Go to "Developers" → "API Keys"
2. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

Add to `.env.local`:
```bash
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Set Up Webhook (for local development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
   ```bash
   # Mac
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret shown (starts with `whsec_`)

Add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Set Up Webhook (for production)

After deploying to Vercel:

1. Go to Stripe Dashboard → "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the signing secret
7. Add to Vercel environment variables

---

## Step 5: Printful Setup

### Create Printful Account

1. Go to https://www.printful.com/
2. Sign up for an account
3. Complete the onboarding process

### Get API Key

1. Go to "Settings" → "Stores"
2. Click "Add Store" → "Manual order platform / API"
3. Name it "FanMerch AI"
4. Click "Connect"
5. Go to "Settings" → "API"
6. Click "Generate API Key"
7. Copy the key

Add to `.env.local`:
```bash
PRINTFUL_API_KEY="your-api-key-here"
```

### Get Product Variant IDs

You need to map your products to Printful's variant IDs:

1. Use Printful API to list products:
   ```bash
   curl -X GET "https://api.printful.com/products" \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

2. Find your products (e.g., "Unisex Heavy Cotton Tee")
3. Get variant IDs for each size/color combination
4. Update `lib/printful.ts` with real variant IDs

**Example response:**
```json
{
  "code": 200,
  "result": [
    {
      "id": 71,
      "type": "T-SHIRT",
      "title": "Unisex Heavy Cotton Tee"
    }
  ]
}
```

Get variants for a product:
```bash
curl -X GET "https://api.printful.com/products/71" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Step 6: Email Setup (SMTP)

### Option A: Gmail (Easiest for MVP)

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and your device
4. Click "Generate"
5. Copy the 16-character password

Add to `.env.local`:
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
SMTP_FROM_EMAIL="your-email@gmail.com"
```

### Option B: SendGrid (Production Ready)

1. Sign up at https://sendgrid.com/
2. Create API key
3. Verify your sender identity

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM_EMAIL="noreply@yourdomain.com"
```

---

## Step 7: Final Configuration

Add the base URL to `.env.local`:

```bash
# For local development
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# For production (after deploying)
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
```

---

## Step 8: Run the App

```bash
# Start development server
npm run dev
```

Open http://localhost:3000

---

## Step 9: Test the Flow

1. Fill out the product creation form
2. Click "Generate Design"
   - This will call Imagen 3 API
3. Preview the design
4. Click "Buy Now"
   - This will create Stripe checkout session
5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
6. Complete checkout
7. Webhook should trigger:
   - Order created in database
   - Printful order created
   - Confirmation email sent

### Verify Each Step:

**Check database:**
```bash
npx prisma studio
```

**Check Stripe dashboard:**
- Go to "Payments" to see test payment

**Check Printful dashboard:**
- Go to "Orders" to see draft order

**Check email:**
- You should receive confirmation email

---

## Step 10: Deploy to Production

### Using the Deploy Script

```bash
./scripts/deploy.sh
```

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project
2. Go to "Settings" → "Environment Variables"
3. Add all variables from `.env.local`
4. For `GOOGLE_APPLICATION_CREDENTIALS`:
   - Copy the JSON content
   - Create a variable with the raw JSON string
   - Update the API code to use JSON from env instead of file

### Update Webhook URLs

1. **Stripe:** Update webhook endpoint to production URL
2. **Printful:** Configure webhook URL if needed

---

## Troubleshooting

### Database Errors

```bash
# Reset database
npx prisma db push --force-reset

# Regenerate Prisma Client
npx prisma generate
```

### Imagen API Errors

- Check Google Cloud Console for quota limits
- Verify service account has correct permissions
- Check billing is enabled

### Stripe Webhook Not Receiving Events

- For local: Ensure `stripe listen` is running
- For production: Check Vercel logs
- Verify webhook secret matches

### Printful Order Creation Fails

- Check API key is valid
- Verify variant IDs are correct
- Check Printful dashboard for error messages

### Email Not Sending

- Gmail: Verify app password, not regular password
- Check SMTP settings are correct
- Look for errors in terminal/Vercel logs

---

## Next Steps

1. Add real PWA icons to `/public/` (icon-192.png, icon-512.png)
2. Update Printful variant IDs with real products
3. Test end-to-end order flow
4. Set up monitoring (Sentry, LogRocket)
5. Configure custom domain in Vercel
6. Launch! 🚀

---

## Support

For issues or questions:
- Check README.md
- Review PRD-FanMerch-AI.md
- Contact: support@fanmerchai.com
