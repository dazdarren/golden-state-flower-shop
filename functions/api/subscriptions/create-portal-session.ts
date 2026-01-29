/**
 * Create Stripe Customer Portal Session API
 *
 * POST /api/subscriptions/create-portal-session
 *
 * Creates a Stripe customer portal session for managing subscriptions.
 * Users can update payment methods, cancel, pause, or resume subscriptions.
 */

import { createStripeClient, createCustomerPortalSession, hasStripeCredentials } from '../../lib/stripe';
import { createSupabaseClient, hasSupabaseCredentials, extractBearerToken, getUserFromToken } from '../../lib/supabase';
import { successResponse, errorResponse, handleCors, unauthorizedResponse } from '../../lib/response';

interface PortalRequest {
  returnUrl: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Check Stripe configuration
    if (!hasStripeCredentials(env)) {
      return errorResponse('Payment system not configured', 503);
    }

    if (!hasSupabaseCredentials(env)) {
      return errorResponse('Database not configured', 503);
    }

    // Get authorization header
    const token = extractBearerToken(request);
    if (!token) {
      return unauthorizedResponse('Authentication required');
    }

    // Parse request body
    const body: PortalRequest = await request.json();

    if (!body.returnUrl) {
      return errorResponse('Return URL is required');
    }

    // Initialize clients
    const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
    const supabase = createSupabaseClient(env);

    // Verify user
    const user = await getUserFromToken(supabase, token);
    if (!user) {
      return unauthorizedResponse('Invalid or expired session');
    }

    // Get user's profile to find Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return errorResponse('No subscription found for this account', 404);
    }

    // Create portal session
    const portalSession = await createCustomerPortalSession(
      stripe,
      profile.stripe_customer_id,
      body.returnUrl
    );

    return successResponse({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Portal session error:', error);

    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }

    return errorResponse('Failed to create portal session', 500);
  }
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return handleCors();
};
