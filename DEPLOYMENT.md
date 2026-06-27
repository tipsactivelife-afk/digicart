# Vercel Deployment Guide

## 1. Push project to GitHub

```bash
git init
git add .
git commit -m "Launch-ready DigiCraft store"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Import in Vercel

- Go to https://vercel.com/new
- Import the GitHub repository
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

## 3. Add Environment Variables

Add everything from `.env.example` inside the Vercel dashboard.

Minimum recommended for launch:
- `VITE_SITE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_RESEND_FROM_EMAIL`
- `VITE_PLAUSIBLE_DOMAIN` or `VITE_GA4_MEASUREMENT_ID`

## 4. Configure Domain

- Add custom domain in Vercel
- Update `VITE_SITE_URL`
- Replace placeholder URLs in:
  - `public/sitemap.xml`
  - `public/robots.txt`
  - `src/seo.ts`

## 5. Payment Webhooks

For production, configure webhook endpoints using serverless functions or a backend service.

### Stripe webhook events
- `checkout.session.completed`
- `payment_intent.succeeded`
- `charge.refunded`

### Razorpay webhook events
- `payment.captured`
- `payment.failed`
- `refund.processed`

## 6. Email Automation

Trigger these emails after successful payment:
- Order confirmation + download link
- Welcome email
- Review request after 7 days
- Abandoned cart reminder after 24 hours

## 7. Final QA Before Go-Live

- [ ] Test checkout with Stripe test card
- [ ] Test Razorpay UPI flow
- [ ] Confirm order email is delivered
- [ ] Confirm download links open correctly
- [ ] Confirm discount codes work
- [ ] Confirm bundle pricing works
- [ ] Confirm analytics events fire
- [ ] Confirm legal pages are linked
- [ ] Confirm mobile nav/cart works
- [ ] Confirm support email and chat widget are active
