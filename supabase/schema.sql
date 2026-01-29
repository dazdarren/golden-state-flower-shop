-- Golden State Flower Shop Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional data
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ADDRESSES TABLE
-- Saved delivery addresses
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  recipient_name TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- ORDERS TABLE
-- Order history for both guests and logged-in users
-- ============================================
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'confirmed', 'delivered', 'cancelled');

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_email TEXT,
  florist_one_order_id TEXT,
  florist_one_confirmation TEXT,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  billing_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR guest_email = auth.jwt()->>'email');

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  USING (TRUE);

-- ============================================
-- ORDER ITEMS TABLE
-- Individual items within an order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  delivery_date DATE NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_address JSONB NOT NULL,
  card_message TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.guest_email = auth.jwt()->>'email')
    )
  );

-- ============================================
-- SUBSCRIPTIONS TABLE
-- Golden Bloom Club subscriptions
-- ============================================
CREATE TYPE subscription_tier AS ENUM ('classic', 'luxe', 'grand');
CREATE TYPE subscription_frequency AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'past_due');

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  tier subscription_tier NOT NULL,
  frequency subscription_frequency DEFAULT 'monthly',
  status subscription_status DEFAULT 'active',
  price DECIMAL(10,2) NOT NULL,
  next_delivery_date DATE,
  delivery_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  recipient_name TEXT,
  special_instructions TEXT,
  gift_subscription BOOLEAN DEFAULT FALSE,
  gift_recipient_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- SUBSCRIPTION DELIVERIES TABLE
-- Track individual subscription deliveries
-- ============================================
CREATE TYPE delivery_status AS ENUM ('scheduled', 'processing', 'delivered', 'skipped', 'failed');

CREATE TABLE IF NOT EXISTS subscription_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  florist_one_order_id TEXT,
  delivery_date DATE NOT NULL,
  status delivery_status DEFAULT 'scheduled',
  product_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_deliveries_subscription_id ON subscription_deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_deliveries_date ON subscription_deliveries(delivery_date);

ALTER TABLE subscription_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription deliveries"
  ON subscription_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_deliveries.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- ============================================
-- OCCASION REMINDERS TABLE
-- Birthday/anniversary reminders
-- ============================================
CREATE TYPE occasion_type AS ENUM ('birthday', 'anniversary', 'other');

CREATE TABLE IF NOT EXISTS occasion_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  occasion_type occasion_type NOT NULL,
  recipient_name TEXT NOT NULL,
  date DATE NOT NULL,
  remind_days_before INTEGER DEFAULT 7,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_reminded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON occasion_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON occasion_reminders(date);

ALTER TABLE occasion_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reminders"
  ON occasion_reminders FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- Email marketing list
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = TRUE;

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Users can view/update their own subscription
CREATE POLICY "Users can view own newsletter subscription"
  ON newsletter_subscribers FOR SELECT
  USING (email = auth.jwt()->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can update own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (email = auth.jwt()->>'email' OR user_id = auth.uid());

-- ============================================
-- LOYALTY POINTS TABLE
-- Customer loyalty program
-- ============================================
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier loyalty_tier DEFAULT 'bronze',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- LOYALTY TRANSACTIONS TABLE
-- Point earning/redemption history
-- ============================================
CREATE TYPE points_transaction_type AS ENUM ('earned', 'redeemed', 'expired', 'bonus');

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type points_transaction_type NOT NULL,
  description TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_trans_user_id ON loyalty_transactions(user_id);

ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty transactions"
  ON loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- REFERRALS TABLE
-- Referral program tracking
-- ============================================
CREATE TYPE referral_status AS ENUM ('pending', 'signed_up', 'completed', 'expired');

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_email TEXT NOT NULL,
  referee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  code TEXT NOT NULL UNIQUE,
  status referral_status DEFAULT 'pending',
  referrer_reward DECIMAL(10,2) DEFAULT 15.00,
  referee_reward DECIMAL(10,2) DEFAULT 15.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(code);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- ============================================
-- ABANDONED CARTS TABLE
-- For cart abandonment recovery emails
-- ============================================
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cart_session_id TEXT NOT NULL,
  cart_data JSONB NOT NULL,
  recovery_email_sent BOOLEAN DEFAULT FALSE,
  recovery_email_sent_at TIMESTAMPTZ,
  recovered BOOLEAN DEFAULT FALSE,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session ON abandoned_carts(cart_session_id);

ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage abandoned carts"
  ON abandoned_carts FOR ALL
  USING (TRUE);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with that column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_deliveries_updated_at
  BEFORE UPDATE ON subscription_deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occasion_reminders_updated_at
  BEFORE UPDATE ON occasion_reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_abandoned_carts_updated_at
  BEFORE UPDATE ON abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create loyalty points record for new users
CREATE OR REPLACE FUNCTION create_loyalty_points_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO loyalty_points (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_loyalty_points_for_user();

-- ============================================
-- SEED DATA (for development)
-- ============================================

-- You can uncomment and modify this for testing
-- INSERT INTO newsletter_subscribers (email, source) VALUES
--   ('test@example.com', 'seed_data');
