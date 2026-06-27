// ============================================================
// DigiCraft Store - Supabase Client & Database Operations
// ============================================================

import type { Product, Order, User, Coupon, OrderStatus, PaymentStatus } from '../types';

// ── Supabase Client ──────────────────────────────────────────

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let supabaseConfig: SupabaseConfig | null = null;

export function initSupabase(url: string, anonKey: string) {
  supabaseConfig = { url, anonKey };
}

export function getSupabaseConfig() {
  return supabaseConfig;
}

async function supabaseRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  if (!supabaseConfig) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const url = `${supabaseConfig.url}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'apikey': supabaseConfig.anonKey,
        'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': options.method === 'POST' ? 'return=representation' : 'return=minimal',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================================
// Product Operations
// ============================================================

export async function fetchProducts(): Promise<{ data: Product[] | null; error: string | null }> {
  return supabaseRequest<Product[]>('products?select=*&order=created_at.desc');
}

export async function fetchProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  const result = await supabaseRequest<Product[]>(`products?id=eq.${id}`);
  return { data: result.data?.[0] || null, error: result.error };
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<{ data: Product | null; error: string | null }> {
  const payload = {
    name: product.name,
    slug: product.slug,
    short_description: product.shortDescription,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    currency: product.currency,
    category: product.category,
    tags: product.tags,
    images: product.images,
    rating: product.rating || 0,
    review_count: product.reviewCount || 0,
    sales_count: product.salesCount || 0,
    featured: product.featured,
    bestseller: product.bestseller,
    new_arrival: product.newArrival,
    limited_offer: product.limitedOffer,
    stock_left: product.stockLeft,
    whats_included: product.whatsIncluded,
    who_is_for: product.whoIsFor,
    how_to_use: product.howToUse,
    file_format: product.fileFormat,
    file_size: product.fileSize,
    instant_download: product.instantDownload,
    download_url: product.downloadUrl,
    active: product.active,
  };

  const result = await supabaseRequest<Product[]>('products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return { data: result.data?.[0] || null, error: result.error };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product | null; error: string | null }> {
  const payload: Record<string, unknown> = {};
  
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.shortDescription !== undefined) payload.short_description = updates.shortDescription;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
  if (updates.currency !== undefined) payload.currency = updates.currency;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.images !== undefined) payload.images = updates.images;
  if (updates.featured !== undefined) payload.featured = updates.featured;
  if (updates.bestseller !== undefined) payload.bestseller = updates.bestseller;
  if (updates.newArrival !== undefined) payload.new_arrival = updates.newArrival;
  if (updates.limitedOffer !== undefined) payload.limited_offer = updates.limitedOffer;
  if (updates.stockLeft !== undefined) payload.stock_left = updates.stockLeft;
  if (updates.whatsIncluded !== undefined) payload.whats_included = updates.whatsIncluded;
  if (updates.whoIsFor !== undefined) payload.who_is_for = updates.whoIsFor;
  if (updates.howToUse !== undefined) payload.howToUse = updates.howToUse;
  if (updates.fileFormat !== undefined) payload.file_format = updates.fileFormat;
  if (updates.fileSize !== undefined) payload.file_size = updates.fileSize;
  if (updates.instantDownload !== undefined) payload.instant_download = updates.instantDownload;
  if (updates.downloadUrl !== undefined) payload.download_url = updates.downloadUrl;
  if (updates.active !== undefined) payload.active = updates.active;
  payload.updated_at = new Date().toISOString();

  const result = await supabaseRequest<Product[]>(`products?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: { 'Prefer': 'return=representation' },
  });

  return { data: result.data?.[0] || null, error: result.error };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const result = await supabaseRequest(`products?id=eq.${id}`, {
    method: 'DELETE',
  });
  return { error: result.error };
}

// ============================================================
// Order Operations
// ============================================================

export async function fetchOrders(): Promise<{ data: Order[] | null; error: string | null }> {
  return supabaseRequest<Order[]>('orders?select=*,order_items(*)&order=created_at.desc');
}

export async function fetchOrderById(id: string): Promise<{ data: Order | null; error: string | null }> {
  const result = await supabaseRequest<Order[]>(`orders?id=eq.${id}&select=*,order_items(*)`);
  return { data: result.data?.[0] || null, error: result.error };
}

export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<{ data: Order | null; error: string | null }> {
  const orderNumber = `DC-${Date.now().toString(36).toUpperCase()}`;
  
  const payload = {
    order_number: orderNumber,
    user_id: order.userId,
    customer_email: order.customerEmail,
    customer_name: order.customerName,
    customer_country: order.customerCountry,
    subtotal: order.subtotal,
    discount_amount: order.discountAmount,
    discount_code: order.discountCode,
    tax_amount: order.taxAmount,
    total_amount: order.totalAmount,
    currency: order.currency,
    status: order.status,
    payment_status: order.paymentStatus,
    payment_provider: order.paymentProvider,
    payment_reference: order.paymentReference,
    notes: order.notes,
  };

  const result = await supabaseRequest<Order[]>('orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Prefer': 'return=representation' },
  });

  if (result.data?.[0] && order.items.length > 0) {
    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: result.data![0].id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      download_url: item.downloadUrl,
      download_count: 0,
    }));

    await supabaseRequest('order_items', {
      method: 'POST',
      body: JSON.stringify(orderItems),
    });
  }

  return { data: result.data?.[0] || null, error: result.error };
}

export async function updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<{ error: string | null }> {
  const payload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes) payload.notes = notes;

  const result = await supabaseRequest(`orders?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return { error: result.error };
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentReference?: string): Promise<{ error: string | null }> {
  const payload: Record<string, unknown> = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  };
  if (paymentReference) payload.payment_reference = paymentReference;

  const result = await supabaseRequest(`orders?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return { error: result.error };
}

// ============================================================
// User/Customer Operations
// ============================================================

export async function fetchUsers(): Promise<{ data: User[] | null; error: string | null }> {
  return supabaseRequest<User[]>('profiles?select=*&order=created_at.desc');
}

export async function fetchUserById(id: string): Promise<{ data: User | null; error: string | null }> {
  const result = await supabaseRequest<User[]>(`profiles?id=eq.${id}`);
  return { data: result.data?.[0] || null, error: result.error };
}

export async function updateUser(id: string, updates: Partial<User>): Promise<{ error: string | null }> {
  const payload: Record<string, unknown> = {};
  
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.country !== undefined) payload.country = updates.country;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.isBlocked !== undefined) payload.is_blocked = updates.isBlocked;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const result = await supabaseRequest(`profiles?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return { error: result.error };
}

export async function fetchUserOrders(userId: string): Promise<{ data: Order[] | null; error: string | null }> {
  return supabaseRequest<Order[]>(`orders?user_id=eq.${userId}&select=*,order_items(*)&order=created_at.desc`);
}

// ============================================================
// Coupon Operations
// ============================================================

export async function fetchCoupons(): Promise<{ data: Coupon[] | null; error: string | null }> {
  return supabaseRequest<Coupon[]>('coupons?select=*&order=created_at.desc');
}

export async function fetchCouponByCode(code: string): Promise<{ data: Coupon | null; error: string | null }> {
  const result = await supabaseRequest<Coupon[]>(`coupons?code=eq.${code.toUpperCase()}&is_active=eq.true`);
  return { data: result.data?.[0] || null, error: result.error };
}

export async function createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Promise<{ data: Coupon | null; error: string | null }> {
  const payload = {
    code: coupon.code.toUpperCase(),
    type: coupon.type,
    value: coupon.value,
    min_order_amount: coupon.minOrderAmount,
    max_discount: coupon.maxDiscount,
    usage_limit: coupon.usageLimit,
    used_count: 0,
    valid_from: coupon.validFrom,
    valid_until: coupon.validUntil,
    is_active: coupon.isActive,
    applicable_products: coupon.applicableProducts,
    applicable_categories: coupon.applicableCategories,
    description: coupon.description,
  };

  const result = await supabaseRequest<Coupon[]>('coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Prefer': 'return=representation' },
  });

  return { data: result.data?.[0] || null, error: result.error };
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<{ error: string | null }> {
  const payload: Record<string, unknown> = {};
  
  if (updates.code !== undefined) payload.code = updates.code.toUpperCase();
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.value !== undefined) payload.value = updates.value;
  if (updates.minOrderAmount !== undefined) payload.min_order_amount = updates.minOrderAmount;
  if (updates.maxDiscount !== undefined) payload.max_discount = updates.maxDiscount;
  if (updates.usageLimit !== undefined) payload.usage_limit = updates.usageLimit;
  if (updates.validFrom !== undefined) payload.valid_from = updates.validFrom;
  if (updates.validUntil !== undefined) payload.valid_until = updates.validUntil;
  if (updates.isActive !== undefined) payload.is_active = updates.isActive;
  if (updates.applicableProducts !== undefined) payload.applicable_products = updates.applicableProducts;
  if (updates.applicableCategories !== undefined) payload.applicable_categories = updates.applicableCategories;
  if (updates.description !== undefined) payload.description = updates.description;

  const result = await supabaseRequest(`coupons?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return { error: result.error };
}

export async function deleteCoupon(id: string): Promise<{ error: string | null }> {
  const result = await supabaseRequest(`coupons?id=eq.${id}`, {
    method: 'DELETE',
  });
  return { error: result.error };
}

export async function incrementCouponUsage(id: string): Promise<{ error: string | null }> {
  // This would ideally be a database function for atomicity
  const result = await supabaseRequest(`rpc/increment_coupon_usage`, {
    method: 'POST',
    body: JSON.stringify({ coupon_id: id }),
  });
  return { error: result.error };
}

// ============================================================
// Dashboard Stats
// ============================================================

export async function fetchDashboardStats(): Promise<{ data: any | null; error: string | null }> {
  // Fetch aggregated stats - in production, use database functions for efficiency
  const [ordersResult, productsResult, usersResult] = await Promise.all([
    supabaseRequest<Order[]>('orders?select=*'),
    supabaseRequest<Product[]>('products?select=id,name,sales_count,price'),
    supabaseRequest<User[]>('profiles?select=id'),
  ]);

  if (ordersResult.error || productsResult.error || usersResult.error) {
    return { data: null, error: 'Failed to fetch stats' };
  }

  const orders = ordersResult.data || [];
  const products = productsResult.data || [];
  const users = usersResult.data || [];

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));

  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    totalOrders: orders.length,
    totalCustomers: users.length,
    totalProducts: products.length,
    revenueToday: todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    ordersToday: todayOrders.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length : 0,
    topProducts: products
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        sales: p.salesCount || 0,
        revenue: (p.salesCount || 0) * p.price,
      })),
    recentOrders: orders.slice(0, 10),
  };

  return { data: stats, error: null };
}

// ============================================================
// Utility: Validate Coupon
// ============================================================

export function validateCoupon(coupon: Coupon, cartTotal: number, productIds: string[], categories: string[]): { valid: boolean; error?: string } {
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is no longer active' };
  }

  if (now < validFrom) {
    return { valid: false, error: 'This coupon is not yet valid' };
  }

  if (now > validUntil) {
    return { valid: false, error: 'This coupon has expired' };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, error: 'This coupon has reached its usage limit' };
  }

  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return { valid: false, error: `Minimum order amount is ₹${coupon.minOrderAmount}` };
  }

  // Check product/category restrictions
  if (coupon.applicableProducts.length > 0 && !coupon.applicableProducts.includes('all')) {
    const hasApplicableProduct = productIds.some(id => coupon.applicableProducts.includes(id));
    if (!hasApplicableProduct) {
      return { valid: false, error: 'This coupon is not valid for items in your cart' };
    }
  }

  if (coupon.applicableCategories.length > 0) {
    const hasApplicableCategory = categories.some(cat => coupon.applicableCategories.includes(cat as any));
    if (!hasApplicableCategory) {
      return { valid: false, error: 'This coupon is not valid for items in your cart' };
    }
  }

  return { valid: true };
}

export function calculateDiscount(coupon: Coupon, cartTotal: number): number {
  let discount = 0;

  if (coupon.type === 'percentage') {
    discount = (cartTotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }

  return Math.min(discount, cartTotal);
}
