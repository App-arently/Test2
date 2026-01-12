# FanMerch AI

Generate custom football merchandise using AI in 60 seconds. No design skills required.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Vercel Postgres + Prisma ORM
- **AI:** Google Vertex AI (Imagen 3)
- **Payments:** Stripe Checkout
- **Fulfillment:** Printful API
- **Email:** Nodemailer (SMTP)

## Getting Started

### Prerequisites

1. **Node.js** 18+ and npm
2. **Vercel Account** (for Postgres database)
3. **Google Cloud Account** (for Imagen 3 API)
4. **Stripe Account** (test mode is fine for development)
5. **Printful Account** (with API access)
6. **SMTP Email** (Gmail with App Password recommended)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see below for setup guides).

3. **Set up the database:**

```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Setup Guides

### 1. Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or use existing
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the connection strings:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### 2. Google Cloud Vertex AI (Imagen 3)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Vertex AI API**
4. Create a service account:
   - IAM & Admin → Service Accounts → Create
   - Grant role: **Vertex AI User**
5. Download JSON key file
6. Set environment variables:
   - `GOOGLE_CLOUD_PROJECT_ID`: Your project ID
   - `GOOGLE_APPLICATION_CREDENTIALS`: Path to JSON key file (for local dev)
   - For production: Upload JSON key as Vercel environment variable

### 3. Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from **Developers** → **API Keys**:
   - `STRIPE_SECRET_KEY`: Secret key (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Publishable key
3. Set up webhook:
   - **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

For local testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Printful

1. Go to [Printful Dashboard](https://www.printful.com/dashboard)
2. Navigate to **Settings** → **API**
3. Generate API key
4. Set `PRINTFUL_API_KEY` in `.env.local`

**Important:** Update the variant IDs in `lib/printful.ts` with your actual Printful product variant IDs.

### 5. Email (SMTP)

**Option A: Gmail**

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Set environment variables:
   - `SMTP_HOST`: smtp.gmail.com
   - `SMTP_PORT`: 587
   - `SMTP_USER`: your-email@gmail.com
   - `SMTP_PASSWORD`: your-app-password

**Option B: Other SMTP providers**

Use credentials from services like SendGrid, Mailgun, or AWS SES.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-image/    # AI image generation endpoint
│   │   ├── create-checkout/   # Stripe checkout session
│   │   └── webhooks/
│   │       └── stripe/        # Stripe webhook handler
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main app page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── ProductCreation.tsx   # Screen 1: Form
│   ├── LoadingState.tsx      # Screen 2: Loading
│   ├── Preview.tsx           # Screen 3: Preview
│   └── Confirmation.tsx      # Screen 5: Confirmation
├── lib/
│   ├── prisma.ts            # Database client
│   ├── product-config.ts    # Product, team, player data
│   ├── printful.ts          # Printful integration
│   ├── email.ts             # Email notifications
│   └── utils.ts             # Utilities
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Vercel production

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
npm run deploy
```

Or use the deployment script:

```bash
./scripts/deploy.sh
```

3. **Set environment variables in Vercel:**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables from `.env.local`.

4. **Set up webhook URL:**

Update your Stripe webhook endpoint to your production URL:
`https://your-domain.vercel.app/api/webhooks/stripe`

## Development Notes

### Content Filtering

Basic profanity/inappropriate content filtering is implemented in `/api/generate-image/route.ts`. Enhance this based on your needs.

### Printful Variant IDs

The current implementation uses placeholder variant IDs. You need to:

1. Fetch your actual Printful products: `GET /products`
2. Update the variant mapping in `lib/printful.ts`

### PWA Configuration

PWA manifest is referenced in `layout.tsx`. Create `/public/manifest.json` for installable app features (optional for MVP).

## Troubleshooting

### Database Connection Issues

```bash
npx prisma db push
npx prisma generate
```

### Stripe Webhook Not Working

Test locally with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Imagen 3 API Errors

- Verify Google Cloud project has Vertex AI enabled
- Check service account has proper permissions
- Ensure billing is enabled on Google Cloud project

## License

Private project - All rights reserved

## Support

For questions or issues, contact: support@fanmerchai.com
