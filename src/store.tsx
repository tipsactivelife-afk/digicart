// ============================================================
// DigiCraft Store - Global State Management (React Context)
// ============================================================

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import {
  CartItem,
  FilterState,
  Page,
  Product,
  ChatMessage,
  AdminSettings,
  defaultAdminSettings,
  Order,
  User,
  Coupon,
} from './types';
import { products as initialProducts } from './data';
import { initSupabase } from './lib/supabase';

// ── State Shape ──────────────────────────────────────────────
interface StoreState {
  currentPage: Page;
  selectedProductId: string | null;
  cart: CartItem[];
  filters: FilterState;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  discountCode: string;
  discountApplied: boolean;
  showExitPopup: boolean;
  showCookieConsent: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  checkoutEmail: string;
  checkoutName: string;
  checkoutCountry: string;
  orderCompleted: boolean;
  searchOpen: boolean;
  // Admin & Chatbot
  adminSettings: AdminSettings;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isChatLoading: boolean;
  isAdminAuthenticated: boolean;
  // Data Management
  products: Product[];
  orders: Order[];
  users: User[];
  coupons: Coupon[];
  isDataLoading: boolean;
}

const STORAGE_KEY = 'digicraft_admin_settings';
const ADMIN_AUTH_KEY = 'digicraft_admin_auth';
const PRODUCTS_KEY = 'digicraft_products';
const ORDERS_KEY = 'digicraft_orders';
const USERS_KEY = 'digicraft_users';
const COUPONS_KEY = 'digicraft_coupons';

function loadAdminSettings(): AdminSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings = { ...defaultAdminSettings, ...JSON.parse(stored) };
      // Initialize Supabase if configured
      if (settings.supabase.enabled && settings.supabase.projectUrl && settings.supabase.anonKey) {
        initSupabase(settings.supabase.projectUrl, settings.supabase.anonKey);
      }
      return settings;
    }
  } catch (e) {
    console.error('Failed to load admin settings:', e);
  }
  return defaultAdminSettings;
}

function saveAdminSettings(settings: AdminSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Update Supabase connection
    if (settings.supabase.enabled && settings.supabase.projectUrl && settings.supabase.anonKey) {
      initSupabase(settings.supabase.projectUrl, settings.supabase.anonKey);
    }
  } catch (e) {
    console.error('Failed to save admin settings:', e);
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

// Demo orders for testing
const demoOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'DC-XYZ123',
    customerEmail: 'priya@example.com',
    customerName: 'Priya Sharma',
    customerCountry: 'India',
    items: [
      {
        id: 'item-1',
        productId: 'prod-001',
        productName: 'Ultimate Notion Life OS',
        productImage: 'https://images.pexels.com/photos/5706032/pexels-photo-5706032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        unitPrice: 799,
        quantity: 1,
        downloadCount: 2,
      },
    ],
    subtotal: 799,
    discountAmount: 0,
    taxAmount: 144,
    totalAmount: 799,
    currency: 'INR',
    status: 'completed',
    paymentStatus: 'paid',
    paymentProvider: 'razorpay',
    paymentReference: 'pay_xyz123',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'DC-ABC456',
    customerEmail: 'rahul@example.com',
    customerName: 'Rahul Mehta',
    customerCountry: 'India',
    items: [
      {
        id: 'item-2',
        productId: 'prod-002',
        productName: 'Canva Social Media Kit Pro',
        productImage: 'https://images.pexels.com/photos/5706035/pexels-photo-5706035.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        unitPrice: 1299,
        quantity: 1,
        downloadCount: 1,
      },
      {
        id: 'item-3',
        productId: 'prod-003',
        productName: 'ChatGPT Prompt Engineering Bible',
        productImage: 'https://images.pexels.com/photos/8533601/pexels-photo-8533601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        unitPrice: 499,
        quantity: 1,
        downloadCount: 0,
      },
    ],
    subtotal: 1798,
    discountAmount: 180,
    discountCode: 'WELCOME10',
    taxAmount: 291,
    totalAmount: 1618,
    currency: 'INR',
    status: 'completed',
    paymentStatus: 'paid',
    paymentProvider: 'stripe',
    paymentReference: 'pi_abc456',
    createdAt: '2024-03-20T14:45:00Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'DC-DEF789',
    customerEmail: 'ananya@example.com',
    customerName: 'Ananya Gupta',
    customerCountry: 'USA',
    items: [
      {
        id: 'item-4',
        productId: 'prod-004',
        productName: 'Digital Marketing Mastery Course',
        productImage: 'https://images.pexels.com/photos/12883029/pexels-photo-12883029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        unitPrice: 2999,
        quantity: 1,
        downloadCount: 3,
      },
    ],
    subtotal: 2999,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 2999,
    currency: 'INR',
    status: 'processing',
    paymentStatus: 'paid',
    paymentProvider: 'stripe',
    createdAt: '2024-03-22T09:15:00Z',
  },
];

// Demo users
const demoUsers: User[] = [
  {
    id: 'user-001',
    email: 'priya@example.com',
    fullName: 'Priya Sharma',
    country: 'India',
    totalOrders: 3,
    totalSpent: 4597,
    lastOrderAt: '2024-03-15T10:30:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    isBlocked: false,
  },
  {
    id: 'user-002',
    email: 'rahul@example.com',
    fullName: 'Rahul Mehta',
    country: 'India',
    totalOrders: 2,
    totalSpent: 1618,
    lastOrderAt: '2024-03-20T14:45:00Z',
    createdAt: '2024-02-05T12:00:00Z',
    isBlocked: false,
  },
  {
    id: 'user-003',
    email: 'ananya@example.com',
    fullName: 'Ananya Gupta',
    country: 'USA',
    totalOrders: 1,
    totalSpent: 2999,
    lastOrderAt: '2024-03-22T09:15:00Z',
    createdAt: '2024-03-22T09:10:00Z',
    isBlocked: false,
  },
  {
    id: 'user-004',
    email: 'vikram@example.com',
    fullName: 'Vikram Singh',
    country: 'India',
    phone: '+91 98765 43210',
    totalOrders: 5,
    totalSpent: 8999,
    lastOrderAt: '2024-03-18T16:30:00Z',
    createdAt: '2023-12-01T10:00:00Z',
    isBlocked: false,
  },
];

// Demo coupons
const demoCoupons: Coupon[] = [
  {
    id: 'coup-001',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 500,
    usageLimit: 1000,
    usedCount: 234,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
    description: 'Welcome discount for new customers',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'coup-002',
    code: 'BUNDLE20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 2000,
    maxDiscount: 1000,
    usageLimit: 500,
    usedCount: 89,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
    description: 'Bundle discount for orders above ₹2000',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'coup-003',
    code: 'NOTION500',
    type: 'fixed',
    value: 500,
    minOrderAmount: 1500,
    usageLimit: 100,
    usedCount: 45,
    validFrom: '2024-03-01T00:00:00Z',
    validUntil: '2024-06-30T23:59:59Z',
    isActive: true,
    applicableProducts: [],
    applicableCategories: ['notion-templates'],
    description: '₹500 off on Notion templates',
    createdAt: '2024-03-01T00:00:00Z',
  },
];

const initialState: StoreState = {
  currentPage: 'home',
  selectedProductId: null,
  cart: [],
  filters: {
    category: 'all',
    priceRange: [0, 5000],
    sortBy: 'bestselling',
    searchQuery: '',
  },
  isCartOpen: false,
  isMobileMenuOpen: false,
  discountCode: '',
  discountApplied: false,
  showExitPopup: false,
  showCookieConsent: true,
  notification: null,
  checkoutEmail: '',
  checkoutName: '',
  checkoutCountry: 'India',
  orderCompleted: false,
  searchOpen: false,
  adminSettings: loadAdminSettings(),
  chatMessages: [],
  isChatOpen: false,
  isChatLoading: false,
  isAdminAuthenticated: localStorage.getItem(ADMIN_AUTH_KEY) === 'true',
  products: loadFromStorage(PRODUCTS_KEY, initialProducts),
  orders: loadFromStorage(ORDERS_KEY, demoOrders),
  users: loadFromStorage(USERS_KEY, demoUsers),
  coupons: loadFromStorage(COUPONS_KEY, demoCoupons),
  isDataLoading: false,
};

// ── Actions ──────────────────────────────────────────────────
type Action =
  | { type: 'NAVIGATE'; page: Page; productId?: string }
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'CLOSE_MOBILE_MENU' }
  | { type: 'SET_FILTER'; filters: Partial<FilterState> }
  | { type: 'SET_DISCOUNT_CODE'; code: string }
  | { type: 'APPLY_DISCOUNT' }
  | { type: 'SHOW_EXIT_POPUP' }
  | { type: 'HIDE_EXIT_POPUP' }
  | { type: 'DISMISS_COOKIE_CONSENT' }
  | { type: 'SET_NOTIFICATION'; notification: StoreState['notification'] }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'SET_CHECKOUT_FIELD'; field: string; value: string }
  | { type: 'COMPLETE_ORDER' }
  | { type: 'TOGGLE_SEARCH' }
  // Admin & Chatbot
  | { type: 'UPDATE_ADMIN_SETTINGS'; settings: Partial<AdminSettings> }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'SET_CHAT_LOADING'; loading: boolean }
  | { type: 'CLEAR_CHAT' }
  | { type: 'ADMIN_LOGIN' }
  | { type: 'ADMIN_LOGOUT' }
  // Product Management
  | { type: 'SET_PRODUCTS'; products: Product[] }
  | { type: 'CREATE_PRODUCT'; product: Omit<Product, 'id' | 'createdAt'> }
  | { type: 'UPDATE_PRODUCT'; id: string; updates: Partial<Product> }
  | { type: 'DELETE_PRODUCT'; id: string }
  // Order Management
  | { type: 'SET_ORDERS'; orders: Order[] }
  | { type: 'UPDATE_ORDER'; id: string; updates: Partial<Order> }
  | { type: 'CREATE_ORDER'; order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'> }
  // User Management
  | { type: 'SET_USERS'; users: User[] }
  | { type: 'UPDATE_USER'; id: string; updates: Partial<User> }
  // Coupon Management
  | { type: 'SET_COUPONS'; coupons: Coupon[] }
  | { type: 'CREATE_COUPON'; coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'> }
  | { type: 'UPDATE_COUPON'; id: string; updates: Partial<Coupon> }
  | { type: 'DELETE_COUPON'; id: string }
  | { type: 'SET_DATA_LOADING'; loading: boolean };

// ── Reducer ──────────────────────────────────────────────────
function storeReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentPage: action.page,
        selectedProductId: action.productId ?? state.selectedProductId,
        isMobileMenuOpen: false,
        isCartOpen: false,
        searchOpen: false,
      };
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.product.id === action.product.id);
      if (existing) return state;
      return {
        ...state,
        cart: [...state.cart, { product: action.product, quantity: 1 }],
        notification: { message: `${action.product.name} added to cart!`, type: 'success' },
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.product.id !== action.productId) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen, isMobileMenuOpen: false };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen, isCartOpen: false };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: false };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case 'SET_DISCOUNT_CODE':
      return { ...state, discountCode: action.code };
    case 'APPLY_DISCOUNT': {
      // Check custom coupons first
      const coupon = state.coupons.find(
        (c) => c.code.toUpperCase() === state.discountCode.toUpperCase() && c.isActive
      );
      if (coupon) {
        return {
          ...state,
          discountApplied: true,
          notification: { message: `${coupon.value}${coupon.type === 'percentage' ? '%' : '₹'} discount applied! 🎉`, type: 'success' },
        };
      }
      // Fallback to default codes
      if (state.discountCode.toUpperCase() === 'WELCOME10' || state.discountCode.toUpperCase() === 'FIRST10') {
        return {
          ...state,
          discountApplied: true,
          notification: { message: '10% discount applied! 🎉', type: 'success' },
        };
      }
      return { ...state, notification: { message: 'Invalid discount code', type: 'error' } };
    }
    case 'SHOW_EXIT_POPUP':
      return { ...state, showExitPopup: true };
    case 'HIDE_EXIT_POPUP':
      return { ...state, showExitPopup: false };
    case 'DISMISS_COOKIE_CONSENT':
      return { ...state, showCookieConsent: false };
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.notification };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };
    case 'SET_CHECKOUT_FIELD':
      return { ...state, [action.field]: action.value };
    case 'COMPLETE_ORDER':
      return {
        ...state,
        orderCompleted: true,
        cart: [],
        currentPage: 'thank-you',
        isCartOpen: false,
        discountCode: '',
        discountApplied: false,
      };
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen };
    // Admin Settings
    case 'UPDATE_ADMIN_SETTINGS': {
      const newSettings = { ...state.adminSettings, ...action.settings, lastUpdated: new Date().toISOString() };
      saveAdminSettings(newSettings);
      return { ...state, adminSettings: newSettings, notification: { message: 'Settings saved!', type: 'success' } };
    }
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };
    case 'CLOSE_CHAT':
      return { ...state, isChatOpen: false };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };
    case 'SET_CHAT_LOADING':
      return { ...state, isChatLoading: action.loading };
    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] };
    case 'ADMIN_LOGIN':
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return { ...state, isAdminAuthenticated: true };
    case 'ADMIN_LOGOUT':
      localStorage.removeItem(ADMIN_AUTH_KEY);
      return { ...state, isAdminAuthenticated: false, currentPage: 'home' };
    // Product Management
    case 'SET_PRODUCTS':
      saveToStorage(PRODUCTS_KEY, action.products);
      return { ...state, products: action.products };
    case 'CREATE_PRODUCT': {
      const newProduct: Product = {
        ...action.product,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updatedProducts = [newProduct, ...state.products];
      saveToStorage(PRODUCTS_KEY, updatedProducts);
      return { ...state, products: updatedProducts, notification: { message: 'Product created!', type: 'success' } };
    }
    case 'UPDATE_PRODUCT': {
      const updatedProducts = state.products.map((p) =>
        p.id === action.id ? { ...p, ...action.updates, updatedAt: new Date().toISOString() } : p
      );
      saveToStorage(PRODUCTS_KEY, updatedProducts);
      return { ...state, products: updatedProducts, notification: { message: 'Product updated!', type: 'success' } };
    }
    case 'DELETE_PRODUCT': {
      const filteredProducts = state.products.filter((p) => p.id !== action.id);
      saveToStorage(PRODUCTS_KEY, filteredProducts);
      return { ...state, products: filteredProducts, notification: { message: 'Product deleted!', type: 'success' } };
    }
    // Order Management
    case 'SET_ORDERS':
      saveToStorage(ORDERS_KEY, action.orders);
      return { ...state, orders: action.orders };
    case 'UPDATE_ORDER': {
      const updatedOrders = state.orders.map((o) =>
        o.id === action.id ? { ...o, ...action.updates, updatedAt: new Date().toISOString() } : o
      );
      saveToStorage(ORDERS_KEY, updatedOrders);
      return { ...state, orders: updatedOrders, notification: { message: 'Order updated!', type: 'success' } };
    }
    case 'CREATE_ORDER': {
      const newOrder: Order = {
        ...action.order,
        id: `ord-${Date.now()}`,
        orderNumber: `DC-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      };
      const updatedOrders = [newOrder, ...state.orders];
      saveToStorage(ORDERS_KEY, updatedOrders);
      return { ...state, orders: updatedOrders };
    }
    // User Management
    case 'SET_USERS':
      saveToStorage(USERS_KEY, action.users);
      return { ...state, users: action.users };
    case 'UPDATE_USER': {
      const updatedUsers = state.users.map((u) => (u.id === action.id ? { ...u, ...action.updates } : u));
      saveToStorage(USERS_KEY, updatedUsers);
      return { ...state, users: updatedUsers, notification: { message: 'User updated!', type: 'success' } };
    }
    // Coupon Management
    case 'SET_COUPONS':
      saveToStorage(COUPONS_KEY, action.coupons);
      return { ...state, coupons: action.coupons };
    case 'CREATE_COUPON': {
      const newCoupon: Coupon = {
        ...action.coupon,
        id: `coup-${Date.now()}`,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      };
      const updatedCoupons = [newCoupon, ...state.coupons];
      saveToStorage(COUPONS_KEY, updatedCoupons);
      return { ...state, coupons: updatedCoupons, notification: { message: 'Coupon created!', type: 'success' } };
    }
    case 'UPDATE_COUPON': {
      const updatedCoupons = state.coupons.map((c) => (c.id === action.id ? { ...c, ...action.updates } : c));
      saveToStorage(COUPONS_KEY, updatedCoupons);
      return { ...state, coupons: updatedCoupons, notification: { message: 'Coupon updated!', type: 'success' } };
    }
    case 'DELETE_COUPON': {
      const filteredCoupons = state.coupons.filter((c) => c.id !== action.id);
      saveToStorage(COUPONS_KEY, filteredCoupons);
      return { ...state, coupons: filteredCoupons, notification: { message: 'Coupon deleted!', type: 'success' } };
    }
    case 'SET_DATA_LOADING':
      return { ...state, isDataLoading: action.loading };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  getCartTotal: () => number;
  getCartSavings: () => number;
  getDiscountedTotal: () => number;
  getProductById: (id: string) => Product | undefined;
  getFilteredProducts: () => Product[];
  sendChatMessage: (content: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.product.price, 0);
  }, [state.cart]);

  const getCartSavings = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + (item.product.originalPrice - item.product.price), 0);
  }, [state.cart]);

  const getDiscountedTotal = useCallback(() => {
    const total = getCartTotal();
    if (state.discountApplied) {
      // Check for custom coupon
      const coupon = state.coupons.find((c) => c.code.toUpperCase() === state.discountCode.toUpperCase());
      if (coupon) {
        if (coupon.type === 'percentage') {
          let discount = (total * coupon.value) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
          return Math.round(total - discount);
        } else {
          return Math.round(total - coupon.value);
        }
      }
      return Math.round(total * 0.9); // Default 10% off
    }
    if (state.cart.length >= 3) return Math.round(total * 0.8);
    return total;
  }, [state.cart, state.discountApplied, state.discountCode, state.coupons, getCartTotal]);

  const getProductById = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products]
  );

  const getFilteredProducts = useCallback(() => {
    let filtered = state.products.filter((p) => p.active !== false);

    if (state.filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === state.filters.category);
    }

    filtered = filtered.filter(
      (p) => p.price >= state.filters.priceRange[0] && p.price <= state.filters.priceRange[1]
    );

    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (state.filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [state.filters, state.products]);

  // AI Chat
  const sendChatMessage = useCallback(
    async (content: string) => {
      const { chatbot } = state.adminSettings;

      if (!chatbot.enabled || !chatbot.apiKey) {
        dispatch({
          type: 'ADD_CHAT_MESSAGE',
          message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Chat is currently unavailable. Please contact support@digicraft.store',
            timestamp: new Date(),
          },
        });
        return;
      }

      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        message: { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() },
      });

      dispatch({ type: 'SET_CHAT_LOADING', loading: true });

      try {
        let response = '';

        if (chatbot.provider === 'openai') {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chatbot.apiKey}` },
            body: JSON.stringify({
              model: chatbot.model || 'gpt-4o-mini',
              messages: [
                { role: 'system', content: chatbot.systemPrompt },
                ...state.chatMessages.map((m) => ({ role: m.role, content: m.content })),
                { role: 'user', content },
              ],
              max_tokens: chatbot.maxTokens,
              temperature: chatbot.temperature,
            }),
          });
          const data = await res.json();
          response = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';
        } else if (chatbot.provider === 'gemini') {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${chatbot.model || 'gemini-1.5-flash'}:generateContent?key=${chatbot.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${chatbot.systemPrompt}\n\nUser: ${content}` }] }],
                generationConfig: { maxOutputTokens: chatbot.maxTokens, temperature: chatbot.temperature },
              }),
            }
          );
          const data = await res.json();
          response = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';
        } else if (chatbot.provider === 'claude') {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': chatbot.apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: chatbot.model || 'claude-3-haiku-20240307',
              max_tokens: chatbot.maxTokens,
              system: chatbot.systemPrompt,
              messages: [
                ...state.chatMessages.map((m) => ({
                  role: m.role === 'assistant' ? 'assistant' : 'user',
                  content: m.content,
                })),
                { role: 'user', content },
              ],
            }),
          });
          const data = await res.json();
          response = data.content?.[0]?.text || 'Sorry, I could not process that.';
        } else {
          response = 'Custom API integration coming soon.';
        }

        dispatch({
          type: 'ADD_CHAT_MESSAGE',
          message: { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date() },
        });
      } catch (error) {
        console.error('Chat error:', error);
        dispatch({
          type: 'ADD_CHAT_MESSAGE',
          message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date(),
          },
        });
      } finally {
        dispatch({ type: 'SET_CHAT_LOADING', loading: false });
      }
    },
    [state.adminSettings, state.chatMessages]
  );

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        getCartTotal,
        getCartSavings,
        getDiscountedTotal,
        getProductById,
        getFilteredProducts,
        sendChatMessage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
