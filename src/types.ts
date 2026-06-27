// ============================================================
// DigiCraft Store - Complete Type Definitions
// ============================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  category: ProductCategory;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  limitedOffer: boolean;
  stockLeft?: number;
  whatsIncluded: string[];
  whoIsFor: string[];
  howToUse: string[];
  fileFormat: string;
  fileSize: string;
  instantDownload: boolean;
  downloadUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ProductCategory =
  | 'notion-templates'
  | 'canva-templates'
  | 'ai-prompts'
  | 'course-bundles'
  | 'design-assets';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'bestselling' | 'newest' | 'rating';
  searchQuery: string;
}

export type Page =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'checkout'
  | 'thank-you'
  | 'dashboard'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'admin';

// ============================================================
// Order Management Types
// ============================================================

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  downloadUrl?: string;
  downloadCount: number;
  downloadExpiry?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerCountry: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProvider: 'razorpay' | 'stripe';
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================
// User/Customer Types
// ============================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  country: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
  isBlocked: boolean;
  notes?: string;
}

// ============================================================
// Coupon Management Types
// ============================================================

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percentage (0-100) or fixed amount
  minOrderAmount?: number;
  maxDiscount?: number; // for percentage coupons
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableProducts: string[]; // product IDs or 'all'
  applicableCategories: ProductCategory[];
  description?: string;
  createdAt: string;
}

// ============================================================
// AI Chatbot Types
// ============================================================

export type AIProvider = 'openai' | 'gemini' | 'claude' | 'custom';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatbotSettings {
  enabled: boolean;
  provider: AIProvider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  welcomeMessage: string;
  placeholderText: string;
  maxTokens: number;
  temperature: number;
  primaryColor: string;
  position: 'left' | 'right';
  showOnPages: string[];
  quickReplies: string[];
  offlineMessage: string;
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: { day: string; start: string; end: string; enabled: boolean }[];
  };
}

export interface PaymentSettings {
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    webhookSecret: string;
    testMode: boolean;
  };
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    testMode: boolean;
  };
}

export interface SupabaseSettings {
  enabled: boolean;
  projectUrl: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface EmailSettings {
  provider: 'resend' | 'loops' | 'smtp';
  apiKey: string;
  fromEmail: string;
  fromName: string;
  templates: {
    orderConfirmation: boolean;
    downloadLink: boolean;
    welcomeEmail: boolean;
    abandonedCart: boolean;
    reviewRequest: boolean;
  };
}

export interface AnalyticsSettings {
  plausible: {
    enabled: boolean;
    domain: string;
  };
  ga4: {
    enabled: boolean;
    measurementId: string;
  };
}

export interface StoreSettings {
  storeName: string;
  storeUrl: string;
  supportEmail: string;
  currency: string;
  taxRate: number;
  enableGuestCheckout: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface AdminSettings {
  chatbot: ChatbotSettings;
  payments: PaymentSettings;
  supabase: SupabaseSettings;
  email: EmailSettings;
  analytics: AnalyticsSettings;
  store: StoreSettings;
  lastUpdated: string;
}

export const defaultAdminSettings: AdminSettings = {
  chatbot: {
    enabled: true,
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
    systemPrompt: `You are DigiCraft's friendly AI assistant. Help customers with:
- Product recommendations
- Order inquiries
- Technical support for digital products
- Pricing and discount questions
- Download and access issues

Be helpful, concise, and professional. If you don't know something, direct them to support@digicraft.store.`,
    welcomeMessage: 'Hi! 👋 I\'m DigiCraft AI. How can I help you today?',
    placeholderText: 'Ask me anything about our products...',
    maxTokens: 500,
    temperature: 0.7,
    primaryColor: '#7c3aed',
    position: 'right',
    showOnPages: ['home', 'products', 'product-detail'],
    quickReplies: [
      'What products do you offer?',
      'How do downloads work?',
      'Do you have discounts?',
      'I need help with my order',
    ],
    offlineMessage: 'We\'re currently offline. Please email support@digicraft.store',
    businessHours: {
      enabled: false,
      timezone: 'Asia/Kolkata',
      schedule: [
        { day: 'Monday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Tuesday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Wednesday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Thursday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Friday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Saturday', start: '10:00', end: '14:00', enabled: true },
        { day: 'Sunday', start: '00:00', end: '00:00', enabled: false },
      ],
    },
  },
  payments: {
    razorpay: {
      enabled: true,
      keyId: '',
      keySecret: '',
      webhookSecret: '',
      testMode: true,
    },
    stripe: {
      enabled: true,
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      testMode: true,
    },
  },
  supabase: {
    enabled: false,
    projectUrl: '',
    anonKey: '',
    serviceRoleKey: '',
  },
  email: {
    provider: 'resend',
    apiKey: '',
    fromEmail: 'no-reply@digicraft.store',
    fromName: 'DigiCraft Store',
    templates: {
      orderConfirmation: true,
      downloadLink: true,
      welcomeEmail: true,
      abandonedCart: true,
      reviewRequest: true,
    },
  },
  analytics: {
    plausible: {
      enabled: false,
      domain: '',
    },
    ga4: {
      enabled: false,
      measurementId: '',
    },
  },
  store: {
    storeName: 'DigiCraft Store',
    storeUrl: 'https://digicraft.store',
    supportEmail: 'support@digicraft.store',
    currency: 'INR',
    taxRate: 18,
    enableGuestCheckout: true,
    enableReviews: true,
    enableWishlist: false,
    socialLinks: {},
  },
  lastUpdated: new Date().toISOString(),
};

// ============================================================
// Admin Dashboard Stats
// ============================================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueToday: number;
  ordersToday: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: { id: string; name: string; sales: number; revenue: number }[];
  recentOrders: Order[];
  revenueByDay: { date: string; revenue: number }[];
}
