/**
 * GET /api/{state}/{city}/cart
 * Returns cart contents
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

interface Env extends FloristOneEnv {}

interface CartItem {
  itemId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartResponse {
  cartId: string | null;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number | null; // null = not yet known (ZIP not validated)
  serviceFee: number;
  total: number; // subtotal only until delivery fee is known
  isEmpty: boolean;
}

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

  // Validate route params
  const stateResult = validateSlug(params.state);
  if (!stateResult.success) {
    return errorResponse(stateResult.error!);
  }

  const cityResult = validateSlug(params.city);
  if (!cityResult.success) {
    return errorResponse(cityResult.error!);
  }

  // Get cart ID from cookie
  const cartId = getCartIdFromCookies(request);

  // No cart exists yet
  if (!cartId) {
    const emptyCart: CartResponse = {
      cartId: null,
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      serviceFee: 0,
      total: 0,
      isEmpty: true,
    };
    return successResponse(emptyCart);
  }

  // Handle mock carts (for development without API credentials)
  if (cartId.startsWith('mock_cart_')) {
    const mockCartData = getMockCartData(request);

    const subtotal = mockCartData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const mockCart: CartResponse = {
      cartId,
      items: mockCartData.items.map((item, idx) => ({
        itemId: `mock_item_${idx}`,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: '/images/placeholder-flower.svg',
      })),
      subtotal,
      deliveryFee: null, // Unknown until ZIP is validated via get-total API
      serviceFee: 0,
      total: subtotal, // Delivery fee added after ZIP validation
      isEmpty: mockCartData.items.length === 0,
    };

    return successResponse({ ...mockCart, mock: true });
  }

  // Check credentials for real API
  if (!hasFloristOneCredentials(env)) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);
    const result = await client.getCart(cartId);

    const products = result.products || [];

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

    const cart: CartResponse = {
      cartId,
      items: items.map((item, idx) => ({
        itemId: `item_${idx}`,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: `https://cdn.floristone.com/small/${item.sku}_t1.jpg`,
      })),
      subtotal,
      deliveryFee: null, // Unknown until ZIP is validated via get-total API
      serviceFee: 0,
      total: subtotal, // Delivery fee added after ZIP validation
      isEmpty: items.length === 0,
    };

    return successResponse(cart);
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch cart'
    );
  }
};
