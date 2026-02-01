/**
 * Supabase Server Client for Cloudflare Pages Functions
 *
 * Uses the service role key for server-side operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

let supabaseClient: SupabaseClient | null = null;

/**
 * Create a Supabase client with service role permissions
 * This should only be used in server-side code (Cloudflare Functions)
 */
export function createSupabaseClient(env: SupabaseEnv): SupabaseClient {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials not configured');
  }

  // Reuse client if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

/**
 * Check if Supabase is configured
 */
export function hasSupabaseCredentials(env: Partial<SupabaseEnv>): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Get user from JWT token
 */
export async function getUserFromToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ id: string; email: string } | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return { id: user.id, email: user.email! };
  } catch {
    return null;
  }
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

// ============================================
// Profile Operations
// ============================================

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: { first_name?: string; last_name?: string; phone?: string }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Address Operations
// ============================================

export async function getAddresses(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAddress(
  supabase: SupabaseClient,
  userId: string,
  address: {
    label?: string;
    recipient_name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
    phone?: string;
    is_default?: boolean;
  }
) {
  // If this is set as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAddress(
  supabase: SupabaseClient,
  userId: string,
  addressId: string,
  updates: {
    label?: string;
    recipient_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    phone?: string;
    is_default?: boolean;
  }
) {
  // If setting as default, unset other defaults first
  if (updates.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAddress(
  supabase: SupabaseClient,
  userId: string,
  addressId: string
) {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// Order Operations
// ============================================

export async function getOrders(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOrderById(
  supabase: SupabaseClient,
  orderId: string,
  userId?: string
) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data;
}

/**
 * Check if an order with the given idempotency key already exists
 */
export async function getOrderByIdempotencyKey(
  supabase: SupabaseClient,
  idempotencyKey: string
): Promise<{ id: string; florist_one_order_id: string; florist_one_confirmation: string } | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, florist_one_order_id, florist_one_confirmation')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();

  if (error) {
    // Column might not exist yet - log and return null
    console.error('Error checking idempotency key:', error);
    return null;
  }

  return data;
}

export async function createOrder(
  supabase: SupabaseClient,
  order: {
    user_id?: string;
    guest_email?: string;
    florist_one_order_id?: string;
    florist_one_confirmation?: string;
    idempotency_key?: string;
    subtotal: number;
    delivery_fee: number;
    tax: number;
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    billing_address: Record<string, unknown>;
  },
  items: Array<{
    product_code: string;
    product_name: string;
    price: number;
    delivery_date: string;
    recipient_name: string;
    recipient_address: Record<string, unknown>;
    card_message?: string;
    special_instructions?: string;
  }>
) {
  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const itemsWithOrderId = items.map((item) => ({
    ...item,
    order_id: orderData.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId);

  if (itemsError) {
    // If items fail, try to delete the order to maintain consistency
    await supabase.from('orders').delete().eq('id', orderData.id);
    throw itemsError;
  }

  return orderData;
}

/**
 * Look up a guest order by email and order ID/confirmation number
 */
export async function getGuestOrder(
  supabase: SupabaseClient,
  email: string,
  orderIdentifier: string
): Promise<{
  id: string;
  florist_one_order_id: string;
  florist_one_confirmation: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  created_at: string;
  items: Array<{
    product_name: string;
    price: number;
    delivery_date: string;
    recipient_name: string;
  }>;
} | null> {
  // Try to find by florist_one_order_id or florist_one_confirmation
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      florist_one_order_id,
      florist_one_confirmation,
      status,
      subtotal,
      delivery_fee,
      tax,
      total,
      created_at,
      order_items (
        product_name,
        price,
        delivery_date,
        recipient_name
      )
    `)
    .eq('guest_email', email.toLowerCase())
    .or(`florist_one_order_id.eq.${orderIdentifier},florist_one_confirmation.eq.${orderIdentifier}`)
    .maybeSingle();

  if (error) {
    console.error('Error looking up guest order:', error);
    return null;
  }

  if (!order) return null;

  return {
    ...order,
    items: order.order_items || [],
  };
}

// ============================================
// Newsletter Operations
// ============================================

export async function subscribeToNewsletter(
  supabase: SupabaseClient,
  email: string,
  source?: string,
  userId?: string
) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      {
        email: email.toLowerCase(),
        source,
        user_id: userId,
        is_active: true,
        unsubscribed_at: null,
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unsubscribeFromNewsletter(
  supabase: SupabaseClient,
  email: string
) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq('email', email.toLowerCase());

  if (error) throw error;
}

// ============================================
// Subscription Operations
// ============================================

export async function getSubscriptions(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      addresses (*),
      subscription_deliveries (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSubscriptionById(
  supabase: SupabaseClient,
  subscriptionId: string,
  userId?: string
) {
  let query = supabase
    .from('subscriptions')
    .select(`
      *,
      addresses (*),
      subscription_deliveries (*)
    `)
    .eq('id', subscriptionId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data;
}

export async function createSubscription(
  supabase: SupabaseClient,
  subscription: {
    user_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    tier: 'classic' | 'luxe' | 'grand';
    frequency?: 'weekly' | 'biweekly' | 'monthly';
    price: number;
    next_delivery_date?: string;
    delivery_address_id?: string;
    recipient_name?: string;
    special_instructions?: string;
    gift_subscription?: boolean;
    gift_recipient_email?: string;
  }
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscription(
  supabase: SupabaseClient,
  subscriptionId: string,
  updates: {
    status?: 'active' | 'paused' | 'cancelled' | 'past_due';
    next_delivery_date?: string;
    delivery_address_id?: string;
    recipient_name?: string;
    special_instructions?: string;
    cancelled_at?: string;
  }
) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Loyalty Points Operations
// ============================================

export async function getLoyaltyPoints(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('loyalty_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function addLoyaltyPoints(
  supabase: SupabaseClient,
  userId: string,
  points: number,
  description: string,
  orderId?: string
) {
  // Get current points
  const { data: current } = await supabase
    .from('loyalty_points')
    .select('points, lifetime_points')
    .eq('user_id', userId)
    .single();

  const newPoints = (current?.points || 0) + points;
  const newLifetime = (current?.lifetime_points || 0) + points;

  // Determine tier based on lifetime points
  let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
  if (newLifetime >= 5000) tier = 'platinum';
  else if (newLifetime >= 1500) tier = 'gold';
  else if (newLifetime >= 500) tier = 'silver';

  // Update points
  const { error: updateError } = await supabase
    .from('loyalty_points')
    .update({ points: newPoints, lifetime_points: newLifetime, tier })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Record transaction
  const { error: transError } = await supabase
    .from('loyalty_transactions')
    .insert({
      user_id: userId,
      points,
      type: 'earned',
      description,
      order_id: orderId,
    });

  if (transError) throw transError;

  return { points: newPoints, lifetime_points: newLifetime, tier };
}

export async function redeemLoyaltyPoints(
  supabase: SupabaseClient,
  userId: string,
  points: number,
  description: string
) {
  // Get current points
  const { data: current, error: getError } = await supabase
    .from('loyalty_points')
    .select('points')
    .eq('user_id', userId)
    .single();

  if (getError) throw getError;
  if (!current || current.points < points) {
    throw new Error('Insufficient points');
  }

  const newPoints = current.points - points;

  // Update points
  const { error: updateError } = await supabase
    .from('loyalty_points')
    .update({ points: newPoints })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Record transaction
  const { error: transError } = await supabase
    .from('loyalty_transactions')
    .insert({
      user_id: userId,
      points: -points,
      type: 'redeemed',
      description,
    });

  if (transError) throw transError;

  return { points: newPoints };
}

// ============================================
// Occasion Reminders Operations
// ============================================

export async function getOccasionReminders(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('occasion_reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createOccasionReminder(
  supabase: SupabaseClient,
  userId: string,
  reminder: {
    title: string;
    occasion_type: 'birthday' | 'anniversary' | 'other';
    recipient_name: string;
    date: string;
    remind_days_before?: number;
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from('occasion_reminders')
    .insert({ ...reminder, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOccasionReminder(
  supabase: SupabaseClient,
  userId: string,
  reminderId: string,
  updates: {
    title?: string;
    occasion_type?: 'birthday' | 'anniversary' | 'other';
    recipient_name?: string;
    date?: string;
    remind_days_before?: number;
    notes?: string;
    is_active?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('occasion_reminders')
    .update(updates)
    .eq('id', reminderId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOccasionReminder(
  supabase: SupabaseClient,
  userId: string,
  reminderId: string
) {
  const { error } = await supabase
    .from('occasion_reminders')
    .delete()
    .eq('id', reminderId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// Referral Operations
// ============================================

export async function getReferrals(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createReferral(
  supabase: SupabaseClient,
  referrerId: string,
  refereeEmail: string
) {
  // Generate unique referral code
  const code = `REF-${referrerId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrerId,
      referee_email: refereeEmail.toLowerCase(),
      code,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReferralByCode(supabase: SupabaseClient, code: string) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('code', code)
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Abandoned Cart Operations
// ============================================

export async function saveAbandonedCart(
  supabase: SupabaseClient,
  email: string,
  cartSessionId: string,
  cartData: Record<string, unknown>,
  userId?: string
) {
  const { data, error } = await supabase
    .from('abandoned_carts')
    .upsert(
      {
        email: email.toLowerCase(),
        cart_session_id: cartSessionId,
        cart_data: cartData,
        user_id: userId,
        recovered: false,
        email_sent: false,
      },
      { onConflict: 'cart_session_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markCartRecovered(
  supabase: SupabaseClient,
  cartSessionId: string
) {
  const { error } = await supabase
    .from('abandoned_carts')
    .update({
      recovered: true,
      recovered_at: new Date().toISOString(),
    })
    .eq('cart_session_id', cartSessionId);

  if (error) throw error;
}

export async function getAbandonedCartBySessionId(
  supabase: SupabaseClient,
  cartSessionId: string
) {
  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('cart_session_id', cartSessionId)
    .single();

  if (error) throw error;
  return data;
}

export async function markAbandonedCartEmailSent(
  supabase: SupabaseClient,
  cartId: string
) {
  const { error } = await supabase
    .from('abandoned_carts')
    .update({
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    })
    .eq('id', cartId);

  if (error) throw error;
}
