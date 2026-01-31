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
      deliveryFee: null, // Unknown until ZIP validated via get-total API
      total: subtotal, // Delivery fee added after ZIP validation
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

    // Florist One API uses product code (SKU) for removal
    let productCode = skuToRemove;

    // If we only have itemId, we need to find the SKU from the cart
    if (!productCode && itemId) {
      const cartResult = await client.getCart(cartId);
      const products = cartResult.products || [];

      // itemId format is item_INDEX - extract the product at that index
      const match = itemId.match(/item_(\d+)/);
      if (match) {
        // Products are aggregated by SKU, so we need to find unique SKUs
        const uniqueSkus = [...new Set(products.map(p => p.CODE))];
        const idx = parseInt(match[1], 10);
        if (idx >= 0 && idx < uniqueSkus.length) {
          productCode = uniqueSkus[idx];
        }
      }
    }

    if (!productCode) {
      return errorResponse('Item not found in cart', 404);
    }

    // Remove item from cart
    const removeResult = await client.removeFromCart(cartId, productCode);
    if (removeResult.error) {
      return errorResponse(removeResult.error, 500);
    }

    // Fetch updated cart contents
    const cartResult = await client.getCart(cartId);
    const products = cartResult.products || [];

    // Aggregate duplicate products into quantities
    const itemMap = new Map<string, { sku: string; name: string; price: number; quantity: number }>();
    for (const p of products) {
      const existing = itemMap.get(p.CODE);
      if (existing) {
        existing.quantity += 1;
      } else {
        itemMap.set(p.CODE, {
          sku: p.CODE,
          name: p.NAME,
          price: p.PRICE,
          quantity: 1,
        });
      }
    }

    const items = Array.from(itemMap.values());
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return successResponse({
      cartId,
      items: items.map((item, idx) => ({
        itemId: `item_${idx}`,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryFee: null, // Unknown until ZIP validated via get-total API
      total: subtotal, // Delivery fee added after ZIP validation
      isEmpty: items.length === 0,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to remove item from cart'
    );
  }
};
