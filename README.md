# DigiCraft Store 🚀

Complete, production-ready digital product e-commerce platform with **Full Admin Panel**, **AI Chatbot**, and **Real-time Integrations**.

## ✨ Features

### 🛒 Storefront
- Premium landing page with hero, stats, countdown timer
- Product catalog with filters, search, sorting
- Detailed product pages with image carousel
- Shopping cart with discount codes & bundle pricing
- Checkout flow with payment options
- User dashboard with purchase history
- Legal pages (Terms, Privacy, Refund)

### 🤖 AI Chatbot
- OpenAI, Google Gemini, Claude support
- Customizable system prompt & personality
- Quick replies, welcome messages
- Color theming & positioning
- Real-time chat with typing indicators

### 👨‍💼 Admin Panel (Full Control)

| Module | Features |
|--------|----------|
| **Dashboard** | Revenue stats, order trends, top products, quick actions |
| **Products** | Create, edit, delete, toggle active, manage images & details |
| **Orders** | View all orders, update status, payment status, send emails |
| **Customers** | View users, order history, block/unblock, add notes |
| **Coupons** | Create percentage/fixed coupons, set limits, expiry dates |
| **AI Chatbot** | Configure provider, API key, prompts, appearance |
| **Payments** | Razorpay + Stripe setup, test/live mode, webhook secrets |
| **Integrations** | Supabase, Email (Resend/Loops), Analytics (Plausible/GA4) |

### 🔧 Technical Features
- React 19 + TypeScript + Tailwind CSS v4
- State management with Context + useReducer
- LocalStorage persistence for settings & data
- Dynamic SEO with JSON-LD schema
- Responsive design (mobile-first)
- Smooth animations & micro-interactions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Admin Access

Navigate to: **More → Admin Panel** (in header dropdown)

**Demo Password:** `digicraft2024`

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app with routing
├── store.tsx               # Global state (products, orders, users, coupons)
├── types.ts                # TypeScript definitions
├── seo.ts                  # Dynamic meta tags
├── data.ts                 # Initial product data
├── lib/
│   └── supabase.ts         # Supabase client & API helpers
└── components/
    ├── admin/
    │   ├── AdminDashboard.tsx
    │   ├── ProductManager.tsx
    │   ├── OrderManager.tsx
    │   ├── UserManager.tsx
    │   ├── CouponManager.tsx
    │   ├── ChatbotSettings.tsx
    │   ├── PaymentSettings.tsx
    │   └── IntegrationSettings.tsx
    ├── AdminPanel.tsx
    ├── AdminLogin.tsx
    ├── AIChatbot.tsx
    ├── Hero.tsx
    ├── ProductCard.tsx
    ├── ProductListing.tsx
    ├── ProductDetail.tsx
    ├── Checkout.tsx
    └── ...

supabase/
└── schema.sql              # Complete database schema

public/
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── og-image.svg
```

## 🔌 Integrations

### Payment Gateways
- **Razorpay** - UPI, cards, wallets (India)
- **Stripe** - International cards, Apple Pay, Google Pay

### Database & Auth
- **Supabase** - PostgreSQL database, user authentication

### AI Chatbot
- **OpenAI** - GPT-4o, GPT-4o-mini, GPT-3.5-turbo
- **Google Gemini** - Gemini 1.5 Pro, Flash
- **Anthropic Claude** - Claude 3.5 Sonnet, Haiku

### Email
- **Resend** - Transactional emails
- **Loops.so** - Marketing automation

### Analytics
- **Plausible** - Privacy-friendly analytics
- **Google Analytics 4** - Full-featured analytics

## 📋 Admin Panel Guide

### Products Management
1. Go to Admin → Products
2. Click "Add Product"
3. Fill in name, price, category, images
4. Add "What's Included", "Who This Is For"
5. Set download URL for delivery
6. Toggle Featured/Bestseller badges
7. Save product

### Coupon Management
1. Go to Admin → Coupons
2. Click "Create Coupon"
3. Choose percentage or fixed discount
4. Set min order amount, max discount
5. Set valid dates
6. Optionally limit to categories
7. Save coupon

### AI Chatbot Setup
1. Go to Admin → AI Chatbot
2. Choose provider (OpenAI recommended)
3. Paste API key
4. Select model
5. Customize system prompt
6. Set welcome message
7. Add quick replies
8. Save and test

## 🗄️ Database Setup (Supabase)

1. Create Supabase project at https://app.supabase.com
2. Go to SQL Editor
3. Run `supabase/schema.sql`
4. Copy Project URL and Anon Key
5. Paste in Admin → Integrations → Supabase
6. Enable Supabase toggle
7. Save settings

## 💳 Payment Setup

### Razorpay
1. Create account at https://razorpay.com
2. Get Key ID and Key Secret from Dashboard
3. Paste in Admin → Payments → Razorpay
4. Toggle Test Mode for testing
5. Configure webhook URL

### Stripe
1. Create account at https://stripe.com
2. Get Publishable and Secret keys
3. Paste in Admin → Payments → Stripe
4. Toggle Test Mode for testing
5. Configure webhook endpoint

## 📧 Email Setup (Resend)

1. Create account at https://resend.com
2. Verify domain
3. Get API key
4. Paste in Admin → Integrations → Email
5. Set From email and name
6. Enable email templates

## 📊 Analytics Setup

### Plausible
1. Create account at https://plausible.io
2. Add your domain
3. Paste domain in Admin → Integrations
4. Enable Plausible toggle

### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXX)
3. Paste in Admin → Integrations
4. Enable GA4 toggle

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Framework: Vite
4. Build command: `npm run build`
5. Output: `dist`
6. Add environment variables (optional)
7. Deploy!

## 📝 Environment Variables (Optional)

Create `.env` file:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

## 🎯 Launch Checklist

- [ ] Configure Supabase database
- [ ] Set up Razorpay live keys
- [ ] Set up Stripe live keys
- [ ] Configure email provider
- [ ] Add AI chatbot API key
- [ ] Set up analytics
- [ ] Test checkout flow
- [ ] Test download delivery
- [ ] Verify mobile responsiveness
- [ ] Check legal pages content
- [ ] Connect custom domain

## 📄 License

MIT License - Free for personal and commercial use.

---

Built with ❤️ for digital creators and entrepreneurs.
