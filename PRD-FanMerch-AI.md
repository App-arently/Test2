# FanMerch AI - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2026-01-12
**Status:** Draft
**Type:** MVP Engineering Specification
**Target:** Solo builder, 3-week timeline to first revenue

---

## Executive Summary

**Product Name:** FanMerch AI
**Category:** Mobile Commerce (PWA) + Generative AI
**Core Value Prop:** Generate custom football merchandise in 60 seconds using AI, no design skills required.

**Target Customer:** Football fans (18-45) in EU/UK who want unique, personalized merch but hate generic designs.

**Revenue Model:** Dropshipping with 2.2× markup on Printful base costs.
**Target Margin:** 50-55% after AI/fulfillment costs.

---

## 1. Business Model Canvas

### Customer Segments
- **Primary:** Football fans who engage with meme culture/social media
- **Secondary:** Gift buyers (birthdays, holidays)
- **Tertiary:** Supporters groups (bulk custom orders - Phase 2)

### Problem Statement
1. Official merch is expensive and generic ($80 for a basic jersey)
2. Custom design platforms (Printful, Custom Ink) require design skills
3. Etsy/Redbubble designs feel low-quality or copyright-risky

### Solution
AI-powered merch generator with guided prompts → instant mockups → 1-click checkout.

### Unique Value Proposition
**"Your idea. AI's design. Your hoodie. In 60 seconds."**

- No design skills needed
- Instant visualization (not "wait 3-5 days for mockup")
- Legal (user-generated, not using official IP)

### Revenue Streams
| Product | Printful Cost | Retail Price | Margin |
|---------|---------------|--------------|--------|
| T-Shirt | $12 | $26 | $14 (54%) |
| Hoodie | $25 | $55 | $30 (55%) |
| Cap | $15 | $33 | $18 (55%) |
| Poster | $8 | $18 | $10 (56%) |

**Target:** 100 orders/month = $3,000 gross profit at 50% conversion from generation to purchase.

### Key Metrics (Success Criteria)
- **Generation → Purchase conversion:** >15% (industry standard: 2-5%)
- **Average Order Value (AOV):** $45
- **Customer Acquisition Cost (CAC):** <$15 (via Meta ads)
- **Time to first order:** <3 weeks from launch

---

## 2. Feature Prioritization Matrix

### ✅ Must-Have (MVP Blockers)

| Feature | Why It's Critical | Effort |
|---------|-------------------|--------|
| Guided prompt builder | Core UX - prevents blank canvas paralysis | M |
| AI image generation | The product | L |
| Printful integration | Fulfillment | M |
| Stripe Checkout | Payment (PCI-compliant) | S |
| Mobile-responsive UI | 90% of traffic will be mobile | M |
| Order confirmation email | Legal requirement + UX | S |

**Total MVP Effort:** ~2.5 weeks

---

### 🟡 Should-Have (Launch Week)

| Feature | Why Important | When |
|---------|---------------|------|
| Loading states/progress bar | Image gen takes 8-12s | Day 3 |
| Error handling (API failures) | Graceful degradation | Day 5 |
| Basic analytics (Plausible) | Track conversion funnel | Day 7 |
| Terms of Service + Privacy | Legal compliance | Day 6 |
| Size/color selection | Printful supports this easily | Day 4 |

---

### 🔵 Nice-to-Have (Post-Revenue)

| Feature | Why Defer | Priority |
|---------|-----------|----------|
| User accounts | Adds complexity, low MVP value | P3 |
| Design history/favorites | Requires auth + storage | P3 |
| Social sharing | Virality feature but not core | P2 |
| Multiple image variants | Increases AI costs 3× | P4 |
| Team collaboration | B2B feature | P5 |

---

## 3. User Flow (Authoritative)

```
┌─────────────────────────────────────┐
│ Screen 1: Product Creation          │
│                                     │
│ [Dropdown] Product Type             │
│ [Buttons] Design Type               │
│ [Search] Subject (team/player)      │
│ [Text Input] Your Creative Prompt   │
│                                     │
│         [Generate Design]           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Screen 2: Generating...             │
│                                     │
│    [Animated Spinner]               │
│  "Creating your design..."          │
│   Progress: 8-12 seconds            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Screen 3: Preview                   │
│                                     │
│  [Product Mockup Image]             │
│                                     │
│  Size: [S] [M] [L] [XL]             │
│  Color: [Black] [White] [Gray]      │
│                                     │
│  Price: $55                         │
│                                     │
│  [Regenerate]  [Buy Now]            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Screen 4: Checkout (Stripe)         │
│                                     │
│  Hosted by Stripe Checkout          │
│  - Email                            │
│  - Shipping Address                 │
│  - Card Details                     │
│                                     │
│         [Complete Purchase]         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Screen 5: Confirmation              │
│                                     │
│  ✓ Order Confirmed!                 │
│                                     │
│  Order #12345                       │
│  Estimated Delivery: Jan 20-25      │
│                                     │
│  Check your email for details       │
│                                     │
│  [Create Another Design]            │
└─────────────────────────────────────┘
```

**Target Completion Time:** 60-90 seconds (excluding generation wait)

---

## 4. Technical Specification

### 4.1 Technology Stack

**Frontend:**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui components
- State Management: React Context (minimal, no Redux needed)
- PWA: next-pwa plugin

**Backend:**
- Runtime: Next.js API Routes (Node.js)
- Database: Vercel Postgres (for order tracking)
- Caching: Vercel Edge Cache

**Third-Party Services:**
- **AI:** Nano Banana API (primary) / Replicate (fallback)
- **Payments:** Stripe Checkout + Webhooks
- **Fulfillment:** Printful API
- **Email:** Resend (transactional emails)
- **Analytics:** Plausible (GDPR-compliant, lightweight)

**Infrastructure:**
- Hosting: Vercel (auto-deploy from GitHub)
- CDN: Vercel Edge Network
- SSL: Auto-provisioned by Vercel

---

### 4.2 Data Models

#### Order Schema
```typescript
interface Order {
  id: string; // UUID
  createdAt: Date;

  // Product Details
  productType: 'tshirt' | 'hoodie' | 'cap' | 'poster';
  designType: 'player' | 'team' | 'text';
  subject: string; // "Messi", "Barcelona", etc.
  userPrompt: string; // User's creative input
  generatedImageUrl: string;

  // Variants
  size: string;
  color: string;

  // Pricing
  retailPrice: number; // In cents
  printfulCost: number;

  // Customer
  customerEmail: string;
  shippingAddress: ShippingAddress;

  // External IDs
  stripeSessionId: string;
  printfulOrderId?: string; // Created after payment

  // Status
  status: 'pending' | 'paid' | 'fulfillment' | 'shipped' | 'cancelled';
}
```

#### Product Options Schema
```typescript
interface ProductOptions {
  productTypes: {
    id: string;
    name: string;
    basePrice: number; // Printful cost
    retailPrice: number; // Our price
    sizes: string[];
    colors: string[];
    printfulVariantId: string;
  }[];

  designTypes: {
    id: string;
    label: string;
    icon: string;
  }[];

  subjects: {
    teams: { id: string; name: string; }[];
    players: { id: string; name: string; team: string; }[];
  };
}
```

---

### 4.3 API Contracts

#### `POST /api/generate-image`

**Request:**
```json
{
  "productType": "hoodie",
  "designType": "player",
  "subject": "Messi",
  "userPrompt": "retro 90s style, neon colors"
}
```

**Response (Success):**
```json
{
  "success": true,
  "imageUrl": "https://cdn.nanoBanana.com/abc123.png",
  "metadata": {
    "generationTime": 9.2,
    "model": "nano-banana-v2"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Generation failed",
  "retryable": true
}
```

---

#### `POST /api/create-checkout`

**Request:**
```json
{
  "productType": "hoodie",
  "size": "L",
  "color": "black",
  "imageUrl": "https://...",
  "designMetadata": {
    "designType": "player",
    "subject": "Messi",
    "userPrompt": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_xxx",
  "sessionId": "cs_xxx"
}
```

---

#### `POST /api/webhooks/stripe`

**Stripe Event Types:**
- `checkout.session.completed` → Create Printful order
- `payment_intent.payment_failed` → Send failure email

**Logic:**
```typescript
1. Verify webhook signature
2. Extract session ID
3. Retrieve order from DB
4. Create Printful order with imageUrl
5. Update order status to 'fulfillment'
6. Send confirmation email
```

---

#### `POST /api/webhooks/printful`

**Printful Event Types:**
- `package_shipped` → Send tracking email

---

### 4.4 AI Prompt Construction

**System Prompt (Fixed):**
```
You are generating a print-ready design for custom merchandise.

Requirements:
- Centered composition
- High contrast (works on both light/dark fabrics)
- No text unless explicitly requested
- Style should be bold and eye-catching
- Isolated subject (minimal background)
- Square aspect ratio (1:1)
```

**User Prompt Assembly:**
```typescript
function buildPrompt(input: UserInput): string {
  const { productType, designType, subject, userPrompt } = input;

  return `
    Create a ${designType} design featuring ${subject}.
    Style: ${userPrompt}

    Format: Print-ready mockup for a ${productType}
    Composition: Centered, bold, high contrast
    Background: Minimal or transparent
  `.trim();
}
```

**Content Moderation:**
- Run generated image through Hive AI moderation API
- If flagged (>0.9 confidence), reject and show error
- Cost: $0.001/image

---

### 4.5 Security Checklist

| Threat | Mitigation |
|--------|-----------|
| API key exposure | Store in Vercel env vars, never commit to git |
| Payment fraud | Stripe Radar (auto-enabled) |
| SQL injection | Use Prisma ORM (parameterized queries) |
| Rate limiting | Vercel Edge Middleware (10 req/min per IP) |
| CORS issues | Next.js API routes (same-origin) |
| Webhook validation | Verify Stripe signature, validate Printful IP |

---

### 4.6 Error Handling Strategy

**Image Generation Failures:**
```typescript
1. Retry once automatically (transient API errors)
2. If second failure, show user-friendly error:
   "Our AI is taking a break. Please try again in a moment."
3. Log error to monitoring (Sentry)
```

**Payment Failures:**
```typescript
1. Stripe handles this (decline messages shown to user)
2. We log the session ID for debugging
3. No Printful order created = no fulfillment cost
```

**Printful Order Failures (after payment):**
```typescript
1. Catch error in webhook handler
2. Auto-refund via Stripe API
3. Send apology email with refund confirmation
4. Alert developer (email/Slack)
```

---

## 5. UI/UX Specification

### 5.1 Design System

**Color Palette (Dark Mode):**
```css
--background: #0a0a0a
--surface: #1a1a1a
--primary: #3b82f6 (blue-500)
--primary-hover: #2563eb
--text-primary: #ffffff
--text-secondary: #a3a3a3
--error: #ef4444
--success: #10b981
```

**Typography:**
```css
--font-sans: 'Inter', system-ui
--heading: 600 weight, tight leading
--body: 400 weight, relaxed leading
```

**Component Library:**
- Use shadcn/ui (pre-built, accessible components)
- Button: Solid primary, Ghost secondary, Destructive for errors
- Input: Dark mode styled, clear focus states
- Card: Subtle border, soft shadow

---

### 5.2 Screen-by-Screen Wireframes

**Screen 1: Product Creation**
```
┌────────────────────────────────────────┐
│  FanMerch AI                   [i]     │ <- Header
├────────────────────────────────────────┤
│                                        │
│  What do you want to create?          │
│                                        │
│  Product Type                          │
│  ┌──────────────────────────────────┐ │
│  │ T-Shirt ▼                        │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Design Type                           │
│  ┌─────┐ ┌─────┐ ┌─────┐             │
│  │👤   │ │⚽   │ │Aa   │             │
│  │Play-│ │Team │ │Text │             │
│  │ er  │ │Logo │ │Only │             │
│  └─────┘ └─────┘ └─────┘             │
│                                        │
│  Subject                               │
│  ┌──────────────────────────────────┐ │
│  │ Search teams or players...       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Your Creative Prompt                  │
│  ┌──────────────────────────────────┐ │
│  │ e.g., "retro 90s style, neon"    │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Generate Design             │ │ <- Primary CTA
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

**Screen 3: Preview**
```
┌────────────────────────────────────────┐
│  ← Back                                │
├────────────────────────────────────────┤
│                                        │
│    ┌──────────────────────────┐       │
│    │                          │       │
│    │   [Product Mockup]       │       │
│    │      Image Here          │       │
│    │                          │       │
│    └──────────────────────────┘       │
│                                        │
│  Size                                  │
│  ⚪ S  ⚪ M  ⚫ L  ⚪ XL               │
│                                        │
│  Color                                 │
│  ⚫ Black  ⚪ White  ⚪ Gray           │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ Price: $55                     │   │
│  │ Delivery: 7-10 days            │   │
│  └────────────────────────────────┘   │
│                                        │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ Regenerate   │ │   Buy Now    │   │ <- Split CTA
│  └──────────────┘ └──────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

---

### 5.3 Animations & Interactions

**Loading State:**
- Animated spinner (Tailwind spin)
- Progress text: "Creating your design..." (8s) → "Almost there..." (12s)

**Image Reveal:**
- Fade-in animation (0.3s ease-out)
- Subtle scale (0.95 → 1.0)

**Button States:**
- Hover: Lighten 10%
- Active: Scale 0.98
- Disabled: Opacity 50%, cursor not-allowed

---

## 6. Go-to-Market Strategy

### 6.1 Launch Plan (Week 4)

**Phase 1: Friends & Family (Days 1-3)**
- Send to 10 people in personal network
- Goal: 3 paid orders
- Collect feedback on UX

**Phase 2: Micro-Influencer Test (Days 4-7)**
- DM 5 football meme accounts (10k-50k followers)
- Offer free hoodie in exchange for Story post
- Track traffic via UTM codes

**Phase 3: Paid Ads (Days 8-14)**
- Budget: $200 ($100 Meta, $100 TikTok)
- Creative: Screen recording of generation flow
- Target: Football interest + 18-35 age

---

### 6.2 Ad Creative Strategy

**Hook (First 3 seconds):**
> "Turn your wildest football meme idea into real merch in 60 seconds."

**Demo (15 seconds):**
- Screen recording: Prompt input → AI generation → Preview → Buy

**CTA:**
> "Link in bio. No design skills needed."

**Target Metrics:**
- CTR: >3%
- CPC: <$0.50
- Conversion: >15%

---

### 6.3 Pricing Strategy

**Initial Pricing (Test):**
- T-Shirt: $26
- Hoodie: $55
- Cap: $33
- Poster: $18

**Discount Experiments:**
- "FIRST10" → 10% off first order (test conversion impact)
- "FREESHIP" → Free shipping over $50 (test AOV)

**Dynamic Pricing (Phase 2):**
- A/B test $49 vs $55 for hoodies
- Premium designs (+$10) for limited-edition prompts

---

### 6.4 Customer Acquisition Cost (CAC) Target

**Calculation:**
```
AOV: $45
Margin: 50% = $22.50 gross profit
Target CAC: $15 (67% of profit)
Allowable CPC: $0.50 (at 3% CTR)
```

**Scenario Analysis:**
| Orders/Month | Revenue | Profit | Ad Spend | ROI |
|--------------|---------|--------|----------|-----|
| 50 | $2,250 | $1,125 | $750 | 1.5× |
| 100 | $4,500 | $2,250 | $1,500 | 1.5× |
| 200 | $9,000 | $4,500 | $3,000 | 1.5× |

---

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low conversion (gen → purchase) | High | High | A/B test pricing, optimize preview screen UX |
| AI generates poor quality | Medium | High | Add "Regenerate" button, improve prompt engineering |
| High CAC (>$20) | Medium | High | Focus on organic (SEO, Reddit, meme accounts) |
| Printful fulfillment delays | Low | Medium | Show realistic delivery estimates (7-10 days) |
| Copyright issues (official logos) | Low | Critical | Add content moderation, clear ToS (user-generated) |
| Stripe account hold | Low | Critical | Start with test mode, ensure ToS compliance |

---

## 8. Success Metrics (OKRs)

### Launch Sprint (Weeks 1-4)
- ✅ Deploy live app on custom domain
- ✅ Process first paid order within 7 days
- 🎯 10 paid orders by end of Week 4

### Month 1
- **Revenue:** $2,000
- **Orders:** 50
- **Conversion Rate:** >12%
- **CAC:** <$18

### Month 3
- **Revenue:** $10,000
- **Orders:** 250
- **Conversion Rate:** >15%
- **CAC:** <$15
- **Repeat Customers:** >10%

---

## 9. Open Questions (To Resolve)

1. **Team/Player Lists:** Do we hard-code top 50 teams/players, or allow free text?
   - **Decision:** Hard-code top 30 teams + top 50 players for MVP (prevents misspellings)

2. **Printful Shipping:** Flat rate or calculated?
   - **Decision:** Flat rate $5.99 (simpler), free over $50

3. **Image Generation Cost:** Nano Banana pricing?
   - **Research:** Confirm <$0.05/image, else switch to Replicate

4. **Refund Policy:** Automated or manual?
   - **Decision:** Manual for MVP (email support@fanmerchai.com)

5. **Mobile Install Prompt:** When to show "Add to Home Screen"?
   - **Decision:** After first successful generation (high intent signal)

---

## 10. Development Checklist

### Pre-Development
- [ ] Register domain (fanmerchai.com)
- [ ] Create Vercel account
- [ ] Create Stripe account (test mode)
- [ ] Create Printful account + API key
- [ ] Create Nano Banana API account
- [ ] Set up GitHub repo

### Week 1: Foundation
- [ ] Next.js project scaffold
- [ ] Tailwind + shadcn/ui setup
- [ ] Create 5 screen components (no logic)
- [ ] Mock data flow (no APIs)
- [ ] Deploy to Vercel staging

### Week 2: Integrations
- [ ] Nano Banana API integration
- [ ] Printful API (create draft order)
- [ ] Stripe Checkout integration
- [ ] Webhook handlers (Stripe + Printful)
- [ ] Email setup (Resend)

### Week 3: Polish
- [ ] Error states + loading animations
- [ ] Mobile responsiveness testing
- [ ] PWA manifest + icons
- [ ] Terms of Service + Privacy Policy pages
- [ ] Analytics (Plausible) setup
- [ ] Production deployment

### Week 4: Launch
- [ ] Send to 10 friends
- [ ] Fix critical bugs
- [ ] First paid ad campaign
- [ ] Monitor metrics daily

---

## 11. Post-Launch Roadmap (Backlog)

### Phase 2 (Month 2-3)
- [ ] User accounts (save designs)
- [ ] Social sharing (Twitter/IG story cards)
- [ ] Bulk orders (10+ items, discount)
- [ ] Design gallery (community showcase)

### Phase 3 (Month 4-6)
- [ ] Android/iOS native wrapper (if PWA limits discovered)
- [ ] Advanced prompt editor (style presets)
- [ ] NFT minting (own your design as NFT)
- [ ] Affiliate program (refer & earn)

---

## Appendix A: Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Edge |
|------------|-----------|------------|----------|
| Printful Direct | Established, reliable | No AI, requires design upload | Instant generation |
| Redbubble | Large marketplace | Generic designs, high fees | Personalized |
| Custom Ink | Team orders | Minimums required, slow | Single-item, fast |
| Etsy Sellers | Unique designs | Quality varies, long delivery | Consistent quality |

---

## Appendix B: Legal Considerations

**Terms of Service Key Points:**
- User owns generated designs
- No official affiliation with teams/players
- User responsible for copyright compliance
- No refunds after Printful production starts

**GDPR Compliance:**
- Email only collected at checkout
- No tracking cookies (Plausible is compliant)
- Clear data retention policy (30 days)

---

## Appendix C: Tech Debt to Accept (MVP)

These shortcuts are OK for MVP, fix later:

1. **No database transactions** - Risk: Payment succeeds but Printful fails (manual refund)
2. **No retry logic** - If Printful API fails, order lost (acceptable at <10 orders/day)
3. **Hard-coded product catalog** - Not synced with Printful (update manually monthly)
4. **No monitoring/alerting** - Just check errors in Vercel dashboard daily
5. **No tests** - Manual QA only (add tests after product-market fit)

---

**End of PRD**

---

## Next Actions

1. **Review & Feedback:** Read through, note any concerns/changes
2. **Tech Setup:** Create accounts (Vercel, Stripe, Printful, Nano Banana)
3. **Begin Development:** Start with Week 1 checklist
4. **Iterate:** Update this doc as we learn from user feedback

**Questions for discussion:**
- Does the 3-week timeline feel realistic?
- Any features in "Must-Have" that feel over-scoped?
- Pricing strategy - should we start with lower prices to test demand?
