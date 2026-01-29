/**
 * Stripe Integration for Golden Bloom Club Subscriptions
 *
 * Handles subscription creation, management, and webhook processing.
 */

import Stripe from 'stripe';

export interface StripeEnv {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_CLASSIC_MONTHLY: string;
  STRIPE_PRICE_LUXE_MONTHLY: string;
  STRIPE_PRICE_GRAND_MONTHLY: string;
}

let stripeClient: Stripe | null = null;

/**
 * Create a Stripe client
 */
export function createStripeClient(secretKey: string): Stripe {
  if (stripeClient) return stripeClient;

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });

  return stripeClient;
}

/**
 * Check if Stripe is configured
 */
export function hasStripeCredentials(env: Partial<StripeEnv>): boolean {
  return !!env.STRIPE_SECRET_KEY;
}

/**
 * Subscription tier configuration
 */
export const SUBSCRIPTION_TIERS = {
  classic: {
    name: 'Classic',
    price: 65,
    description: 'Beautiful seasonal bouquet delivered monthly',
    features: [
      'Seasonal flower bouquet',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
    ],
  },
  luxe: {
    name: 'Luxe',
    price: 95,
    description: 'Premium arrangement with elegant vase included',
    features: [
      'Premium floral arrangement',
      'Elegant glass vase included',
      'Hand-arranged by local florists',
      'Free delivery',
      'Skip or pause anytime',
      'Priority customer support',
    ],
  },
  grand: {
    name: 'Grand',
    price: 145,
    description: 'Luxury statement centerpiece with extras',
    features: [
      'Luxury statement centerpiece',
      'Designer vase included',
      'Hand-arranged by master florists',
      'Free priority delivery',
      'Skip or pause anytime',
      'Dedicated account manager',
      'Exclusive subscriber-only arrangements',
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

/**
 * Get the Stripe price ID for a subscription tier
 */
export function getPriceIdForTier(tier: SubscriptionTier, env: StripeEnv): string {
  const priceIds: Record<SubscriptionTier, string> = {
    classic: env.STRIPE_PRICE_CLASSIC_MONTHLY,
    luxe: env.STRIPE_PRICE_LUXE_MONTHLY,
    grand: env.STRIPE_PRICE_GRAND_MONTHLY,
  };
  return priceIds[tier];
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(
  stripe: Stripe,
  email: string,
  name: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata,
  });
}

/**
 * Create a checkout session for a new subscription
 */
export async function createSubscriptionCheckoutSession(
  stripe: Stripe,
  params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
    trialDays?: number;
  }
): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    customer: params.customerId,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    subscription_data: {
      metadata: params.metadata,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  };

  if (params.trialDays) {
    sessionParams.subscription_data!.trial_period_days = params.trialDays;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Create a customer portal session for managing subscriptions
 */
export async function createCustomerPortalSession(
  stripe: Stripe,
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Get subscription by ID
 */
export async function getSubscription(
  stripe: Stripe,
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Update subscription
 */
export async function updateSubscription(
  stripe: Stripe,
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, params);
}

/**
 * Pause subscription (by setting pause_collection)
 */
export async function pauseSubscription(
  stripe: Stripe,
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    pause_collection: {
      behavior: 'void',
    },
  });
}

/**
 * Resume subscription
 */
export async function resumeSubscription(
  stripe: Stripe,
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    pause_collection: '',
  });
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  stripe: Stripe,
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Create a payment intent for a one-time order (if needed)
 */
export async function createPaymentIntent(
  stripe: Stripe,
  params: {
    amount: number; // in cents
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency || 'usd',
    customer: params.customerId,
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  stripe: Stripe,
  payload: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Handle Stripe webhook events
 */
export interface WebhookHandler {
  onSubscriptionCreated?: (subscription: Stripe.Subscription) => Promise<void>;
  onSubscriptionUpdated?: (subscription: Stripe.Subscription) => Promise<void>;
  onSubscriptionDeleted?: (subscription: Stripe.Subscription) => Promise<void>;
  onInvoicePaid?: (invoice: Stripe.Invoice) => Promise<void>;
  onInvoicePaymentFailed?: (invoice: Stripe.Invoice) => Promise<void>;
  onCheckoutCompleted?: (session: Stripe.Checkout.Session) => Promise<void>;
}

export async function handleWebhookEvent(
  event: Stripe.Event,
  handlers: WebhookHandler
): Promise<void> {
  switch (event.type) {
    case 'customer.subscription.created':
      if (handlers.onSubscriptionCreated) {
        await handlers.onSubscriptionCreated(event.data.object as Stripe.Subscription);
      }
      break;

    case 'customer.subscription.updated':
      if (handlers.onSubscriptionUpdated) {
        await handlers.onSubscriptionUpdated(event.data.object as Stripe.Subscription);
      }
      break;

    case 'customer.subscription.deleted':
      if (handlers.onSubscriptionDeleted) {
        await handlers.onSubscriptionDeleted(event.data.object as Stripe.Subscription);
      }
      break;

    case 'invoice.paid':
      if (handlers.onInvoicePaid) {
        await handlers.onInvoicePaid(event.data.object as Stripe.Invoice);
      }
      break;

    case 'invoice.payment_failed':
      if (handlers.onInvoicePaymentFailed) {
        await handlers.onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      }
      break;

    case 'checkout.session.completed':
      if (handlers.onCheckoutCompleted) {
        await handlers.onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Calculate the next delivery date based on frequency
 */
export function calculateNextDeliveryDate(
  frequency: 'weekly' | 'biweekly' | 'monthly',
  fromDate: Date = new Date()
): Date {
  const next = new Date(fromDate);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }

  // Skip weekends - move to Monday if Saturday/Sunday
  const dayOfWeek = next.getDay();
  if (dayOfWeek === 0) next.setDate(next.getDate() + 1); // Sunday -> Monday
  if (dayOfWeek === 6) next.setDate(next.getDate() + 2); // Saturday -> Monday

  return next;
}

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
