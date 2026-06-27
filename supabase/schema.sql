-- ============================================================
-- DigiCraft Store - Complete Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- User Profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  country text default 'India',
  phone text,
  total_orders integer default 0,
  total_spent integer default 0,
  last_order_at timestamptz,
  is_blocked boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- Products
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text not null,
  category text not null,
  price integer not null,
  original_price integer,
  currency text default 'INR',
  tags text[] default '{}',
  images text[] default '{}',
  rating decimal(2,1) default 0,
  review_count integer default 0,
  sales_count integer default 0,
  featured boolean default false,
  bestseller boolean default false,
  new_arrival boolean default false,
  limited_offer boolean default false,
  stock_left integer,
  whats_included text[] default '{}',
  who_is_for text[] default '{}',
  how_to_use text[] default '{}',
  file_format text,
  file_size text,
  instant_download boolean default true,
  download_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- ============================================================
-- Orders
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  customer_country text,
  subtotal integer not null,
  discount_amount integer default 0,
  discount_code text,
  tax_amount integer default 0,
  total_amount integer not null,
  currency text default 'INR',
  status text default 'pending', -- pending, processing, completed, failed, refunded, cancelled
  payment_status text default 'pending', -- pending, paid, failed, refunded
  payment_provider text, -- razorpay, stripe
  payment_reference text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- ============================================================
-- Order Items
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price integer not null,
  quantity integer default 1,
  download_url text,
  download_count integer default 0,
  download_expiry timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- Reviews
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Coupons
-- ============================================================
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null, -- percentage, fixed
  value integer not null,
  min_order_amount integer,
  max_discount integer,
  usage_limit integer,
  used_count integer default 0,
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  is_active boolean default true,
  applicable_products text[] default '{}', -- product IDs or empty for all
  applicable_categories text[] default '{}', -- category slugs or empty for all
  description text,
  created_at timestamptz default now()
);

-- ============================================================
-- Newsletter Subscribers
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'website',
  subscribed boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- Abandoned Carts
-- ============================================================
create table if not exists public.abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  email text,
  cart_payload jsonb not null,
  recovered boolean default false,
  recovery_email_sent boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.abandoned_carts enable row level security;

-- Profiles: Users can read/update own profile
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Products: Anyone can read active products
create policy "Anyone can read active products"
  on public.products for select using (active = true);

-- Orders: Users can read own orders
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Order Items: Users can read own order items
create policy "Users can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );

-- Reviews: Anyone can read reviews, authenticated users can create
create policy "Anyone can read reviews"
  on public.reviews for select using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);

-- Coupons: Anyone can read active coupons
create policy "Anyone can read active coupons"
  on public.coupons for select using (is_active = true);

-- Newsletter: Anyone can subscribe
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Abandoned Carts: Anyone can create
create policy "Anyone can create abandoned cart"
  on public.abandoned_carts for insert
  with check (true);

-- ============================================================
-- Functions
-- ============================================================

-- Increment coupon usage
create or replace function increment_coupon_usage(coupon_id uuid)
returns void as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where id = coupon_id;
end;
$$ language plpgsql security definer;

-- Update product sales count
create or replace function update_product_sales()
returns trigger as $$
begin
  if NEW.payment_status = 'paid' and (OLD.payment_status is null or OLD.payment_status != 'paid') then
    update public.products
    set sales_count = sales_count + 1
    where id in (
      select product_id from public.order_items where order_id = NEW.id
    );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_order_paid
  after update on public.orders
  for each row execute function update_product_sales();

-- Update user stats on order
create or replace function update_user_stats()
returns trigger as $$
begin
  if NEW.payment_status = 'paid' and NEW.user_id is not null then
    update public.profiles
    set 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total_amount,
      last_order_at = now()
    where id = NEW.user_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_order_paid_update_user
  after update on public.orders
  for each row execute function update_user_stats();

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_active on public.products(active);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_email on public.orders(customer_email);
create index if not exists idx_coupons_code on public.coupons(code);
create index if not exists idx_coupons_active on public.coupons(is_active);
