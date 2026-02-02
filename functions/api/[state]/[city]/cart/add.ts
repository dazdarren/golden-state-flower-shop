/**
 * POST /api/{state}/{city}/cart/add
 * Adds an item to the cart
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
  createCartCookie,
  addCookieToResponse,
  getMockCartData,
  createMockCartDataCookie,
  MockCartItem,
} from '../../../../lib/cookies';
import { getMockProductBySku } from '../../../../lib/mockData';

interface Env extends FloristOneEnv {}

interface AddToCartBody {
  sku: string;
  quantity?: number;
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

  // Parse request body
  let body: AddToCartBody;
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

  // Validate quantity (default to 1)
  const quantityResult = validateQuantity(body.quantity ?? 1);
  if (!quantityResult.success) {
    return errorResponse(quantityResult.error!);
  }

  const sku = skuResult.data!;
  const quantity = quantityResult.data!;
  const isProduction = request.url.startsWith('https://');

  // Get cart ID from cookie
  let cartId = getCartIdFromCookies(request);
  let cartCreated = false;

  // Handle mock carts for development
  if (!hasFloristOneCredentials(env)) {
    if (!cartId) {
      cartId = `mock_cart_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      cartCreated = true;
    }

    // Get existing mock cart data
    const mockCart = getMockCartData(request);

    // Get product info
    const productInfo = getMockProductBySku(sku);

    // Check if item already in cart
    const existingIndex = mockCart.items.findIndex((item) => item.sku === sku);
    if (existingIndex >= 0) {
      mockCart.items[existingIndex].quantity += quantity;
    } else {
      const newItem: MockCartItem = {
        sku,
        name: productInfo.name,
        price: productInfo.price,
        quantity,
      };
      mockCart.items.push(newItem);
    }

    // Calculate totals
    const subtotal = mockCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    });

    // Set both cart ID and cart data cookies
    const cartIdCookie = createCartCookie(cartId, stateSlug, citySlug, isProduction);
    const cartDataCookie = createMockCartDataCookie(mockCart, stateSlug, citySlug, isProduction);

    let finalResponse = addCookieToResponse(response, cartIdCookie);
    finalResponse = addCookieToResponse(finalResponse, cartDataCookie);

    return finalResponse;
  }

  try {
    const client = createFloristOneClient(env);

    // Create cart if needed
    if (!cartId) {
      const createResult = await client.createCart();
      if (!createResult.SESSIONID) {
        return errorResponse(createResult.error || 'Failed to create cart', 500);
      }
      cartId = createResult.SESSIONID;
      cartCreated = true;
    }

    // Add item to cart (quantity times for multiple)
    for (let i = 0; i < quantity; i++) {
      const addResult = await client.addToCart(cartId, sku);
      if (addResult.error) {
        return errorResponse(addResult.error, 500);
      }
    }

    // Fetch cart contents after adding
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

    const response = successResponse({
      cartId,
      items: items.map((item, idx) => ({
        itemId: `item_${idx}`,
        ...item,
        image: `https://cdn.floristone.com/small/${item.sku}_t1.jpg`,
      })),
      subtotal,
      deliveryFee: null, // Unknown until ZIP validated via get-total API
      total: subtotal, // Delivery fee added after ZIP validation
    });

    // Set cookie if cart was just created
    if (cartCreated) {
      const cookie = createCartCookie(cartId, stateSlug, citySlug, isProduction);
      return addCookieToResponse(response, cookie);
    }

    return response;
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to add item to cart'
    );
  }
};
