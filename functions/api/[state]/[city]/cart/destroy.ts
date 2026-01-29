/**
 * POST /api/{state}/{city}/cart/destroy
 * Destroys the shopping cart
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
  getCartIdFromCookies,
  clearCartCookie,
  clearMockCartDataCookie,
  addCookieToResponse,
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

  // Get cart ID from cookie
  const cartId = getCartIdFromCookies(request);
  const isProduction = request.url.startsWith('https://');

  // No cart to destroy
  if (!cartId) {
    return successResponse({
      message: 'No cart to destroy',
    });
  }

  // Clear both cookies
  const clearIdCookie = clearCartCookie(stateSlug, citySlug, isProduction);
  const clearDataCookie = clearMockCartDataCookie(stateSlug, citySlug, isProduction);

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    const response = successResponse({
      mock: true,
      message: 'Mock cart destroyed',
    });
    let finalResponse = addCookieToResponse(response, clearIdCookie);
    finalResponse = addCookieToResponse(finalResponse, clearDataCookie);
    return finalResponse;
  }

  // Check credentials
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    const response = successResponse({
      message: 'Cart cookie cleared - Florist One credentials not configured',
    });
    let finalResponse = addCookieToResponse(response, clearIdCookie);
    finalResponse = addCookieToResponse(finalResponse, clearDataCookie);
    return finalResponse;
  }

  try {
    const client = createFloristOneClient(env);
    await client.destroyCart(cartId);

    const response = successResponse({
      message: 'Cart destroyed successfully',
    });
    let finalResponse = addCookieToResponse(response, clearIdCookie);
    finalResponse = addCookieToResponse(finalResponse, clearDataCookie);
    return finalResponse;
  } catch (error) {
    console.error('Florist One API error:', error);
    // Still clear the cookies even if API call fails
    const response = serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to destroy cart on server'
    );
    let finalResponse = addCookieToResponse(response, clearIdCookie);
    finalResponse = addCookieToResponse(finalResponse, clearDataCookie);
    return finalResponse;
  }
};
