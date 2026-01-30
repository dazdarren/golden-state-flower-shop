/**
 * POST /api/cart/email
 * Saves cart email for abandoned cart recovery
 */

import {
  createSupabaseClient,
  hasSupabaseCredentials,
  saveAbandonedCart,
  SupabaseEnv,
} from '../../lib/supabase';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
} from '../../lib/response';
import { getCartIdFromCookies } from '../../lib/cookies';

interface Env extends Partial<SupabaseEnv> {}

interface CartEmailBody {
  email: string;
  cartData: {
    items: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    subtotal: number;
  };
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return methodNotAllowedResponse(['POST', 'OPTIONS']);
  }

  // Parse request body
  let body: CartEmailBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  // Validate email
  if (!body.email || !body.email.includes('@')) {
    return errorResponse('Valid email is required');
  }

  // Get cart ID from cookie
  const cartSessionId = getCartIdFromCookies(request);
  if (!cartSessionId) {
    return errorResponse('No cart found', 400);
  }

  // Check if Supabase is configured
  if (!hasSupabaseCredentials(env)) {
    // In development without Supabase, just return success
    return successResponse({
      saved: false,
      message: 'Supabase not configured - cart email not saved',
    });
  }

  try {
    const supabase = createSupabaseClient(env as SupabaseEnv);

    // Save abandoned cart
    await saveAbandonedCart(
      supabase,
      body.email,
      cartSessionId,
      {
        items: body.cartData.items,
        subtotal: body.cartData.subtotal,
        capturedAt: new Date().toISOString(),
      }
    );

    return successResponse({
      saved: true,
      message: 'Cart saved successfully',
    });
  } catch (error) {
    console.error('Failed to save abandoned cart:', error);
    return errorResponse('Failed to save cart', 500);
  }
};
