/**
 * GET /api/{state}/{city}/cart
 * Returns cart contents
 */

import { createFloristOneClient, FloristOneEnv, FloristOneCart } from '../../../../lib/floristOne';
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
  deliveryFee: number;
  serviceFee: number;
  total: number;
  deliveryDate?: string;
  deliveryZip?: string;
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

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    // Get mock cart data from cookie
    const mockCartData = getMockCartData(request);

    const subtotal = mockCartData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = mockCartData.items.length > 0 ? 9.99 : 0;

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
      deliveryFee,
      serviceFee: 0,
      total: subtotal + deliveryFee,
      isEmpty: mockCartData.items.length === 0,
    };

    return successResponse({ ...mockCart, mock: true });
  }

  // Check credentials
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);
    const result = await client.getCart(cartId);

    if (result.status !== 'success' || !result.cart) {
      // Cart might have expired
      return errorResponse(result.error || 'Cart not found', 404);
    }

    const cart: CartResponse = transformCart(result.cart);
    return successResponse(cart);
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch cart'
    );
  }
};

function transformCart(floristOneCart: FloristOneCart): CartResponse {
  return {
    cartId: floristOneCart.cart_id,
    items: floristOneCart.items.map((item) => ({
      itemId: item.item_id,
      sku: item.product_code,
      name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      image: item.image_url,
    })),
    subtotal: floristOneCart.subtotal,
    deliveryFee: floristOneCart.delivery_charge,
    serviceFee: floristOneCart.service_fee,
    total: floristOneCart.total,
    deliveryDate: floristOneCart.delivery_date,
    deliveryZip: floristOneCart.delivery_zip,
    isEmpty: floristOneCart.items.length === 0,
  };
}
