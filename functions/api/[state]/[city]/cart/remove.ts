/**
 * POST /api/{state}/{city}/cart/remove
 * Removes an item from the cart
 */

import { createFloristOneClient, FloristOneEnv } from '../../../../lib/floristOne';
import { validateSlug, validateItemId, validateSku } from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../../lib/response';
import {
  getCartIdFromCookies,
  getMockCartData,
  createMockCartDataCookie,
  addCookieToResponse,
} from '../../../../lib/cookies';

interface Env extends FloristOneEnv {}

interface RemoveFromCartBody {
  itemId?: string;
  sku?: string;
}

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
  if (!cartId) {
    return errorResponse('No cart found', 404);
  }

  // Parse request body
  let body: RemoveFromCartBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  // Validate itemId or sku
  let itemId: string | undefined;
  let skuToRemove: string | undefined;

  if (body.itemId) {
    const itemIdResult = validateItemId(body.itemId);
    if (!itemIdResult.success) {
      return errorResponse(itemIdResult.error!);
    }
    itemId = itemIdResult.data;
  } else if (body.sku) {
    const skuResult = validateSku(body.sku);
    if (!skuResult.success) {
      return errorResponse(skuResult.error!);
    }
    skuToRemove = skuResult.data;
  } else {
    return errorResponse('Either itemId or sku is required');
  }

  const isProduction = request.url.startsWith('https://');

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    const mockCart = getMockCartData(request);

    // Find and remove item
    let removed = false;
    if (skuToRemove) {
      const idx = mockCart.items.findIndex((item) => item.sku === skuToRemove);
      if (idx >= 0) {
        mockCart.items.splice(idx, 1);
        removed = true;
      }
    } else if (itemId) {
      // itemId format is mock_item_INDEX
      const match = itemId.match(/mock_item_(\d+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        if (idx >= 0 && idx < mockCart.items.length) {
          mockCart.items.splice(idx, 1);
          removed = true;
        }
      }
    }

    if (!removed) {
      return errorResponse('Item not found in cart', 404);
    }

    const subtotal = mockCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = mockCart.items.length > 0 ? 9.99 : 0;

    const response = successResponse({
      cartId,
      mock: true,
      items: mockCart.items.map((item, idx) => ({
        itemId: `mock_item_${idx}`,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      total: subtotal + deliveryFee,
      isEmpty: mockCart.items.length === 0,
    });

    const cartDataCookie = createMockCartDataCookie(mockCart, stateSlug, citySlug, isProduction);
    return addCookieToResponse(response, cartDataCookie);
  }

  // Check credentials
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);

    // If we have SKU instead of itemId, we need to find it in the cart
    if (!itemId && skuToRemove) {
      const cartResult = await client.getCart(cartId);
      if (cartResult.status !== 'success' || !cartResult.cart) {
        return errorResponse('Cart not found', 404);
      }

      const item = cartResult.cart.items.find((i) => i.product_code === skuToRemove);
      if (!item) {
        return errorResponse('Item not found in cart', 404);
      }
      itemId = item.item_id;
    }

    const result = await client.removeFromCart(cartId, itemId!);

    if (result.status !== 'success' || !result.cart) {
      return errorResponse(result.error || 'Failed to remove item from cart', 500);
    }

    return successResponse({
      cartId,
      items: result.cart.items.map((item) => ({
        itemId: item.item_id,
        sku: item.product_code,
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: result.cart.subtotal,
      total: result.cart.total,
      isEmpty: result.cart.items.length === 0,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to remove item from cart'
    );
  }
};
