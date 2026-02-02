/**
 * GET /api/{state}/{city}/checkout/get-total
 * Returns the order total with tax for the given ZIP and delivery date
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../../lib/floristOne';
import { validateSlug } from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../../lib/response';
import { getCartIdFromCookies, getMockCartData } from '../../../../lib/cookies';
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  RATE_LIMITS,
} from '../../../../lib/rateLimit';

interface Env extends FloristOneEnv {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCors();
  }

  // Only allow GET
  if (request.method !== 'GET') {
    return methodNotAllowedResponse(['GET', 'OPTIONS']);
  }

  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.getTotal);
  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Too many requests. Please wait a moment.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...rateLimitHeaders(rateLimitResult),
        },
      }
    );
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

  // Get query params
  const url = new URL(request.url);
  const zip = url.searchParams.get('zip');
  const deliveryDate = url.searchParams.get('date');

  if (!zip || !deliveryDate) {
    return errorResponse('ZIP code and delivery date are required', 400);
  }

  // Get cart ID from cookie
  const cartId = getCartIdFromCookies(request);
  if (!cartId) {
    return errorResponse('No cart found', 400);
  }

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    const mockCartData = getMockCartData(request);
    const subtotal = mockCartData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Estimate ~11.5% tax for mock
    const tax = Math.round(subtotal * 0.115 * 100) / 100;
    const delivery = 14.99;
    const total = Math.round((subtotal + delivery + tax) * 100) / 100;

    return successResponse({
      subtotal,
      delivery,
      tax,
      total,
      mock: true,
    });
  }

  // Check credentials
  if (!hasFloristOneCredentials(env)) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);

    // Get cart products
    const cartResult = await client.getCart(cartId);
    const products = cartResult.products || [];

    if (products.length === 0) {
      return successResponse({
        subtotal: 0,
        delivery: 0,
        tax: 0,
        total: 0,
      });
    }

    // Call FlowerShop API gettotal with ALL products at once
    // This ensures delivery fee is only charged once for the entire order
    const totalResult = await client.getCartTotal(
      products.map(p => ({ code: p.CODE, price: p.PRICE })),
      zip
    );

    // Check for API error - fail rather than use estimates
    if (totalResult.error) {
      return errorResponse(`Unable to calculate total: ${totalResult.error}`, 500);
    }

    // Use values from API response - these are the authoritative values from Florist One
    const orderTotal = totalResult.ORDERTOTAL || 0;
    const subtotalSum = totalResult.SUBTOTAL || products.reduce((sum, p) => sum + p.PRICE, 0);
    const taxSum = totalResult.FLORISTONETAX || totalResult.TAXTOTAL || 0;
    const deliveryCharge = totalResult.FLORISTONEDELIVERYCHARGE || totalResult.DELIVERYCHARGETOTAL || 0;

    // Ensure we have a valid delivery charge from API
    if (deliveryCharge === 0) {
      return errorResponse('Unable to determine delivery fee. Please try again.', 500);
    }

    // Use ORDERTOTAL if we got it, otherwise calculate
    const total = orderTotal > 0
      ? Math.round(orderTotal * 100) / 100
      : Math.round((subtotalSum + deliveryCharge + taxSum) * 100) / 100;

    return successResponse({
      subtotal: subtotalSum,
      delivery: deliveryCharge,
      tax: taxSum,
      total,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to calculate total'
    );
  }
};
