/**
 * Create Stripe Checkout Session for Subscription
 *
 * POST /api/subscriptions/create-checkout
 * Body: { tier: string, gift?: boolean, successUrl: string, cancelUrl: string }
 */

import { z } from 'zod';
import { successResponse, errorResponse, handleCors, unauthorizedResponse } from '../../lib/response';
import { createSupabaseClient, hasSupabaseCredentials, extractBearerToken, getUserFromToken } from '../../lib/supabase';
import {
  createStripeClient,
  hasStripeCredentials,
  getOrCreateCustomer,
  createSubscriptionCheckoutSession,
  getPriceIdForTier,
  SUBSCRIPTION_TIERS,
  SubscriptionTier,
} from '../../lib/stripe';

const checkoutSchema = z.object({
  tier: z.enum(['classic', 'luxe', 'grand']),
  gift: z.boolean().optional().default(false),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  recipientEmail: z.string().email().optional(),
  recipientName: z.string().optional(),
});

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleCors();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    // Check credentials
    if (!hasStripeCredentials(context.env)) {
      return errorResponse('Payment system not configured', 503);
    }

    if (!hasSupabaseCredentials(context.env)) {
      return errorResponse('Database not configured', 503);
    }

    // Get user from auth token
    const token = extractBearerToken(context.request);
    if (!token) {
      return unauthorizedResponse('Authentication required');
    }

    const supabase = createSupabaseClient(context.env);
    const user = await getUserFromToken(supabase, token);

    if (!user) {
      return unauthorizedResponse('Invalid or expired session');
    }

    // Parse and validate request body
    const body = await context.request.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.errors[0].message);
    }

    const { tier, gift, successUrl, cancelUrl, recipientEmail, recipientName } = result.data;

    // Get price ID for tier
    const priceId = getPriceIdForTier(tier as SubscriptionTier, context.env);
    if (!priceId) {
      return errorResponse(`Price not configured for ${tier} tier`, 500);
    }

    // Create Stripe client and customer
    const stripe = createStripeClient(context.env.STRIPE_SECRET_KEY);

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    const customerName = profile
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email
      : user.email;

    const customer = await getOrCreateCustomer(stripe, user.email, customerName, {
      userId: user.id,
    });

    // Create checkout session
    const tierInfo = SUBSCRIPTION_TIERS[tier as SubscriptionTier];
    const session = await createSubscriptionCheckoutSession(stripe, {
      customerId: customer.id,
      priceId,
      successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl,
      metadata: {
        userId: user.id,
        tier,
        gift: gift ? 'true' : 'false',
        recipientEmail: recipientEmail || '',
        recipientName: recipientName || '',
      },
    });

    return successResponse({
      checkoutUrl: session.url,
      sessionId: session.id,
      tier: tierInfo.name,
      price: tierInfo.price,
    });
  } catch (error) {
    console.error('Create checkout error:', error);

    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }

    return errorResponse('Failed to create checkout session', 500);
  }
};
