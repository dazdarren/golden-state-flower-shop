/**
 * POST /api/{state}/{city}/cart/update-quantity
 * Updates the quantity of an item in the cart
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../../lib/floristOne';
import { validateSlug, validateSku, validateQuantity } from '../../../../lib/validation';
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

interface UpdateQuantityBody {
  sku: string;
  quantity: number;
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
  let body: UpdateQuantityBody;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  // Validate SKU
  const skuResult = validateSku(body.sku);
  if (!skuResult.success) {
    return errorResponse(skuResult.error!);
  }

  // Validate quantity (0 means remove)
  if (typeof body.quantity !== 'number' || body.quantity < 0 || body.quantity > 99) {
    return errorResponse('Quantity must be between 0 and 99');
  }

  const sku = skuResult.data!;
  const newQuantity = Math.floor(body.quantity);
  const isProduction = request.url.startsWith('https://');

  // Handle mock carts
  if (cartId.startsWith('mock_cart_')) {
    const mockCart = getMockCartData(request);

    const itemIndex = mockCart.items.findIndex((item) => item.sku === sku);

    if (itemIndex < 0) {
      return errorResponse('Item not found in cart', 404);
    }

    if (newQuantity === 0) {
      // Remove item entirely
      mockCart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = newQuantity;
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
        image: `https://cdn.floristone.com/small/${item.sku}_t1.jpg`,
      })),
      subtotal,
      deliveryFee: null,
      total: subtotal,
      isEmpty: mockCart.items.length === 0,
    });

    const cartDataCookie = createMockCartDataCookie(mockCart, stateSlug, citySlug, isProduction);
    return addCookieToResponse(response, cartDataCookie);
  }

  // Check credentials for real carts
  if (!hasFloristOneCredentials(env)) {
    return errorResponse('Florist One credentials not configured', 500);
  }

  try {
    const client = createFloristOneClient(env);

    // Get current cart to find current quantity
    const cartResult = await client.getCart(cartId);
    const products = cartResult.products || [];

    // Count current quantity of this SKU
    const currentQuantity = products.filter(p => p.CODE === sku).length;

    if (currentQuantity === 0 && newQuantity > 0) {
      return errorResponse('Item not found in cart', 404);
    }

    if (newQuantity > currentQuantity) {
      // Need to add more items
      const toAdd = newQuantity - currentQuantity;
      for (let i = 0; i < toAdd; i++) {
        const addResult = await client.addToCart(cartId, sku);
        if (addResult.error) {
          return errorResponse(addResult.error, 500);
        }
      }
    } else if (newQuantity < currentQuantity) {
      // Need to remove items - Florist One removes all, so we remove all then re-add
      const removeResult = await client.removeFromCart(cartId, sku);
      if (removeResult.error) {
        return errorResponse(removeResult.error, 500);
      }

      // Re-add the desired quantity
      for (let i = 0; i < newQuantity; i++) {
        const addResult = await client.addToCart(cartId, sku);
        if (addResult.error) {
          return errorResponse(addResult.error, 500);
        }
      }
    }
    // If quantities are equal, no change needed

    // Fetch updated cart contents
    const updatedCartResult = await client.getCart(cartId);
    const updatedProducts = updatedCartResult.products || [];

    // Aggregate duplicate products into quantities
    const itemMap = new Map<string, { sku: string; name: string; price: number; quantity: number }>();
    for (const p of updatedProducts) {
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
        image: `https://cdn.floristone.com/small/${item.sku}_t1.jpg`,
      })),
      subtotal,
      deliveryFee: null,
      total: subtotal,
      isEmpty: items.length === 0,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to update cart'
    );
  }
};
