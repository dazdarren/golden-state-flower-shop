/**
 * GET /api/cart/recover
 * Recovers an abandoned cart from a recovery link
 */

import {
  createSupabaseClient,
  hasSupabaseCredentials,
  SupabaseEnv,
} from '../../lib/supabase';
import {
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
} from '../../lib/response';
import { serializeCookie } from '../../lib/cookies';

interface Env extends Partial<SupabaseEnv> {}

const CART_COOKIE_NAME = 'flo_cart_id';
const CART_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow GET
  if (request.method !== 'GET') {
    return methodNotAllowedResponse(['GET', 'OPTIONS']);
  }

  // Get token from query string
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return errorResponse('Recovery token is required', 400);
  }

  // Decode token (base64 encoded cart_session_id)
  let cartSessionId: string;
  try {
    cartSessionId = atob(token);
  } catch {
    return errorResponse('Invalid recovery token', 400);
  }

  // Check if Supabase is configured
  if (!hasSupabaseCredentials(env)) {
    // Redirect to cart page without restoring
    return Response.redirect(`${url.origin}/ca/san-francisco/cart`, 302);
  }

  try {
    const supabase = createSupabaseClient(env as SupabaseEnv);

    // Find abandoned cart by session ID
    const { data: cart, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('cart_session_id', cartSessionId)
      .single();

    if (error || !cart) {
      // Cart not found - redirect to homepage
      return Response.redirect(`${url.origin}/ca/san-francisco`, 302);
    }

    // Determine production mode
    const isProduction = url.protocol === 'https:';

    // Set cart cookie to restore the session
    const cartCookie = serializeCookie(CART_COOKIE_NAME, cartSessionId, {
      maxAge: CART_COOKIE_MAX_AGE,
      path: '/',
      secure: isProduction,
      httpOnly: true,
      sameSite: 'Lax',
    });

    // Redirect to cart page with cookie set
    const response = Response.redirect(`${url.origin}/ca/san-francisco/cart`, 302);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Set-Cookie', cartCookie);

    return newResponse;
  } catch (error) {
    console.error('Failed to recover cart:', error);
    // On error, redirect to homepage
    return Response.redirect(`${url.origin}/ca/san-francisco`, 302);
  }
};
