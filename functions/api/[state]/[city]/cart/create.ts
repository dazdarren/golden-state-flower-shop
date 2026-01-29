/**
 * POST /api/{state}/{city}/cart/create
 * Creates a new shopping cart
 */

import { createFloristOneClient, FloristOneEnv } from '../../../../lib/floristOne';
import { validateSlug } from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../../lib/response';
import {
  createCartCookie,
  addCookieToResponse,
  getCartIdFromCookies,
} from '../../../../lib/cookies';

interface Env extends FloristOneEnv {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return methodNotAllowedResponse(['POST', 'OPTIONS']);
  }

  // Validate route params
  const stateResult = validateSlug(params.state);
  if (!stateResult.success) {
    return errorResponse(stateResult.error!);
  }

  const cityResult = validateSlug(params.city);
  if (!cityResult.success) {
    return errorResponse(cityResult.error!);
  }

  const stateSlug = stateResult.data!;
  const citySlug = cityResult.data!;

  // Check if there's already a cart
  const existingCartId = getCartIdFromCookies(request);
  if (existingCartId) {
    return successResponse({
      cartId: existingCartId,
      message: 'Existing cart found',
      isExisting: true,
    });
  }

  // Determine if we're in production
  const isProduction = request.url.startsWith('https://');

  // Check if credentials are configured
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    // Return mock cart for development
    const mockCartId = `mock_cart_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const cookie = createCartCookie(mockCartId, stateSlug, citySlug, isProduction);

    const response = successResponse({
      cartId: mockCartId,
      mock: true,
      message: 'Mock cart created - Florist One credentials not configured',
    });

    return addCookieToResponse(response, cookie);
  }

  try {
    const client = createFloristOneClient(env);
    const result = await client.createCart();

    if (result.status !== 'success' || !result.cart) {
      return errorResponse(result.error || 'Failed to create cart', 500);
    }

    const cartId = result.cart.cart_id;
    const cookie = createCartCookie(cartId, stateSlug, citySlug, isProduction);

    const response = successResponse({
      cartId,
      isExisting: false,
    });

    return addCookieToResponse(response, cookie);
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to create cart'
    );
  }
};
