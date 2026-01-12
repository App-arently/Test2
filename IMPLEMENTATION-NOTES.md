# FanMerch AI - Implementation Notes

## Implementation Summary

The MVP has been successfully implemented according to the PRD specifications. All core features are in place and ready for configuration and testing.

---

## What's Been Built

### ✅ Frontend (5 Screens)

1. **Screen 1: Product Creation** (`components/ProductCreation.tsx`)
   - Product type selection (T-Shirt, Hoodie, Cap, Poster)
   - Design type buttons (Player, Team, Text)
   - Searchable subject dropdown (30 teams, 50 players)
   - Creative prompt textarea
   - Form validation

2. **Screen 2: Loading State** (`components/LoadingState.tsx`)
   - Animated spinner
   - Progress bar (simulated 8-12 seconds)
   - Dynamic messages

3. **Screen 3: Preview** (`components/Preview.tsx`)
   - Generated image display
   - Size selection (S, M, L, XL, 2XL)
   - Color selection (Black, White, Gray/Navy)
   - Price display
   - Regenerate & Buy Now buttons

4. **Screen 4: Stripe Checkout**
   - Handled by Stripe Checkout hosted page
   - Redirects to Stripe's secure payment form

5. **Screen 5: Confirmation** (`components/Confirmation.tsx`)
   - Success message
   - Order ID display
   - Delivery estimate
   - "Create Another Design" button

### ✅ Backend APIs

1. **POST /api/generate-image**
   - Integrates with Google Vertex AI (Imagen 3)
   - Constructs optimized prompts for merchandise
   - Basic content filtering
   - Returns base64-encoded image

2. **POST /api/create-checkout**
   - Creates Stripe Checkout session
   - Stores order metadata
   - Creates pending order in database
   - Returns checkout URL

3. **POST /api/webhooks/stripe**
   - Verifies webhook signature
   - Handles `checkout.session.completed`
   - Triggers Printful order creation
   - Sends confirmation email
   - Updates order status

### ✅ Database

- **Prisma Schema** (`prisma/schema.prisma`)
  - Order model with all required fields
  - Indexed for performance
  - PostgreSQL compatible

### ✅ Integrations

1. **Google Vertex AI (Imagen 3)**
   - Image generation with custom prompts
   - Optimized for merchandise designs
   - Error handling and retries

2. **Stripe**
   - Checkout session creation
   - Webhook handling
   - Payment processing

3. **Printful**
   - Order creation after payment
   - Variant mapping
   - Fulfillment automation

4. **Email (Nodemailer)**
   - Order confirmation emails
   - HTML + plain text templates
   - SMTP configuration

### ✅ Configuration

- **Product Catalog** (`lib/product-config.ts`)
  - 4 product types with pricing
  - 30 top football teams
  - 50 popular players (current stars + legends)
  - Size and color options

- **Environment Setup**
  - `.env.example` template
  - Comprehensive documentation
  - Security best practices

---

## What You Need to Do

### 🔧 Configuration Required

1. **Set Up All API Keys** (see SETUP.md)
   - Google Cloud (Imagen 3)
   - Stripe
   - Printful
   - SMTP Email
   - Vercel Postgres

2. **Update Printful Variant IDs**
   - File: `lib/printful.ts`
   - Function: `getVariantId()`
   - Get real IDs from Printful API
   - Map to your actual products

3. **Add PWA Icons**
   - Create icon-192.png
   - Create icon-512.png
   - Place in `/public/` directory

4. **Google Cloud Service Account**
   - Download JSON key
   - Place as `service-account-key.json` in root
   - Or configure as environment variable for production

### 🧪 Testing Checklist

- [ ] Test image generation with various prompts
- [ ] Verify content filtering works
- [ ] Test Stripe checkout flow
- [ ] Verify webhook receives events
- [ ] Check database orders are created
- [ ] Test Printful order creation
- [ ] Verify confirmation emails are sent
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Test error handling

### 🚀 Deployment Steps

1. Run `./scripts/deploy.sh` or `vercel --prod`
2. Set all environment variables in Vercel Dashboard
3. Update Stripe webhook URL to production domain
4. Test production flow end-to-end
5. Monitor Vercel logs for any errors

---

## Architecture Decisions

### Why Imagen 3?
- High-quality image generation
- Google Cloud integration
- Reasonable pricing
- Good for merchandise designs

### Why Stripe Checkout?
- PCI compliance handled
- Reduces complexity
- Professional checkout experience
- Built-in fraud protection

### Why Printful?
- No inventory needed
- Automatic fulfillment
- Wide product selection
- Good quality

### Why Vercel Postgres?
- Seamless Vercel integration
- Serverless architecture
- Automatic scaling
- Connection pooling built-in

---

## Known Limitations (MVP)

### Accepted for Now

1. **No User Accounts**
   - Email-based order tracking only
   - Can't view order history
   - No saved designs

2. **No Advanced Error Handling**
   - Basic error messages
   - Manual refunds if Printful fails
   - No retry logic for failed orders

3. **Hard-coded Product Catalog**
   - Not synced with Printful
   - Manual updates required
   - No dynamic pricing

4. **Basic Content Moderation**
   - Simple keyword filtering only
   - No AI moderation service
   - Manual review may be needed

5. **No Analytics Dashboard**
   - Manual metrics tracking
   - Vercel logs for debugging
   - No conversion funnel visualization

### To Add Post-MVP

- User authentication (NextAuth.js)
- Design history and favorites
- Social sharing features
- Advanced analytics (Plausible)
- A/B testing framework
- Automated refund logic
- Multi-language support
- Bundle discount UI

---

## Cost Estimates (Per Order)

| Service | Cost | Notes |
|---------|------|-------|
| Imagen 3 | ~$0.02-0.05 | Per image generation |
| Stripe | 2.9% + $0.30 | Payment processing |
| Printful | $12-25 | Base product cost |
| Email | ~$0.001 | SMTP/SendGrid |
| Database | ~$0.001 | Vercel Postgres |
| Hosting | Free tier | Vercel hobby plan |

**Example: Hoodie at $69**
- Revenue: $69.00
- Printful: -$25.00
- Stripe: -$2.30
- AI/Other: -$0.10
- **Net Profit: ~$41.60 (60% margin)** ✅

---

## Security Considerations

### Implemented

- ✅ Environment variables for secrets
- ✅ Webhook signature verification
- ✅ Content filtering
- ✅ Stripe Radar (automatic)
- ✅ HTTPS enforced by Vercel
- ✅ SQL injection protection (Prisma ORM)

### To Monitor

- Rate limiting (use Vercel Edge Middleware if needed)
- DDoS protection (Vercel provides basic protection)
- Image content moderation (consider adding Hive AI)
- Fraud detection (monitor Stripe Radar alerts)

---

## Performance Optimizations

### Already Implemented

- Next.js App Router (React Server Components)
- Vercel Edge Network (CDN)
- Database connection pooling
- Image optimization (Next.js Image component)
- Lazy loading components

### To Consider Later

- Redis caching for product catalog
- Image CDN (Cloudinary/Imgix)
- Background job queue (BullMQ)
- Edge Functions for API routes
- ISR (Incremental Static Regeneration)

---

## Database Schema

```prisma
model Order {
  id                 String   @id @default(uuid())
  createdAt          DateTime @default(now())

  // Product details
  productType        String
  designType         String
  subject            String
  userPrompt         String
  generatedImageUrl  String

  // Variants
  size               String
  color              String

  // Pricing (in cents)
  retailPrice        Int
  printfulCost       Int

  // Customer
  customerEmail      String
  shippingAddress    Json

  // External IDs
  stripeSessionId    String   @unique
  printfulOrderId    String?

  // Status
  status             String

  @@index([stripeSessionId])
  @@index([status])
}
```

---

## API Endpoints

### Public Endpoints

- `POST /api/generate-image` - Generate design with AI
- `POST /api/create-checkout` - Create Stripe checkout session

### Webhook Endpoints

- `POST /api/webhooks/stripe` - Stripe payment events

---

## Environment Variables Reference

See `.env.example` for the complete list. Required variables:

**Database:**
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

**AI:**
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_LOCATION`
- `GOOGLE_APPLICATION_CREDENTIALS`

**Payments:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Fulfillment:**
- `PRINTFUL_API_KEY`

**Email:**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`

**App:**
- `NEXT_PUBLIC_BASE_URL`
- `NODE_ENV`

---

## Common Issues & Solutions

### Issue: Image Generation Fails

**Causes:**
- Google Cloud quota exceeded
- Invalid service account credentials
- Billing not enabled

**Solutions:**
- Check Google Cloud Console quotas
- Verify service account permissions
- Enable billing on project

### Issue: Stripe Webhook Not Working

**Causes:**
- Incorrect webhook secret
- Stripe CLI not running (local dev)
- Webhook URL not configured

**Solutions:**
- Verify webhook secret matches
- Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check Vercel logs for errors

### Issue: Printful Order Creation Fails

**Causes:**
- Invalid API key
- Incorrect variant IDs
- Image URL not accessible

**Solutions:**
- Verify Printful API key
- Update variant IDs in `lib/printful.ts`
- Ensure image URLs are publicly accessible

---

## Next Steps

1. **Complete Setup** (see SETUP.md)
   - Configure all API keys
   - Initialize database
   - Test locally

2. **Customize**
   - Update Printful variant IDs
   - Add your logo/branding
   - Adjust pricing if needed

3. **Test Thoroughly**
   - End-to-end order flow
   - Mobile responsiveness
   - Error scenarios

4. **Deploy**
   - Run deployment script
   - Configure production webhooks
   - Test production environment

5. **Launch**
   - Announce to test users
   - Monitor errors and performance
   - Iterate based on feedback

---

## Support & Resources

- **PRD:** See `PRD-FanMerch-AI.md`
- **Setup Guide:** See `SETUP.md`
- **README:** See `README.md`

---

## Questions to Answer

Before going live, ensure you can answer:

1. ✅ Do I have all API keys configured?
2. ✅ Have I tested the complete order flow?
3. ✅ Are Printful variant IDs correct?
4. ✅ Is the webhook URL configured correctly?
5. ✅ Have I tested on mobile devices?
6. ✅ Do confirmation emails work?
7. ✅ Is error handling adequate?
8. ✅ Have I reviewed Stripe test mode vs live mode?
9. ✅ Is the database backed up?
10. ✅ Do I have monitoring in place?

---

**Built with ❤️ according to PRD-FanMerch-AI.md**

Good luck with your launch! 🚀
