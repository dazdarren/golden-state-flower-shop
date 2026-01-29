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

interface Env extends FloristOneEnv {}

interface AddToCartBody {
  sku: string;
  quantity?: number;
}

// Mock product data for development
const MOCK_PRODUCTS: Record<string, { name: string; price: number }> = {
  'FTD-MIX001': { name: 'Garden Splendor Bouquet', price: 59.99 },
  'FTD-MIX002': { name: 'Vibrant Celebration Arrangement', price: 69.99 },
  'FTD-MIX003': { name: 'Sunshine Meadow Bouquet', price: 54.99 },
  'FTD-MIX004': { name: 'Spring Garden Basket', price: 74.99 },
  'FTD-MIX005': { name: 'Enchanted Fields Bouquet', price: 64.99 },
  'FTD-MIX006': { name: 'Coastal Bloom Collection', price: 79.99 },
  'FTD-ROSE001': { name: 'Classic Red Rose Dozen', price: 89.99 },
  'FTD-ROSE002': { name: 'Pink Rose Garden', price: 79.99 },
  'FTD-ROSE003': { name: 'White Rose Elegance', price: 84.99 },
  'FTD-ROSE004': { name: 'Rainbow Rose Delight', price: 94.99 },
  'FTD-ROSE005': { name: 'Lavender Rose Dreams', price: 74.99 },
  'FTD-ROSE006': { name: 'Two Dozen Premium Roses', price: 149.99 },
  'FTD-PLT001': { name: 'Peace Lily Plant', price: 64.99 },
  'FTD-PLT002': { name: 'Orchid Garden', price: 79.99 },
  'FTD-PLT003': { name: 'Succulent Collection', price: 49.99 },
  'FTD-PLT004': { name: 'Blooming Azalea', price: 59.99 },
  'FTD-SYM001': { name: 'Peaceful Memories Arrangement', price: 99.99 },
  'FTD-SYM002': { name: 'Eternal Love Wreath', price: 149.99 },
  'FTD-SYM003': { name: 'Serene Standing Spray', price: 179.99 },
  'FTD-SYM004': { name: 'Comforting Grace Basket', price: 89.99 },
  'FTD-SEA001': { name: 'Seasonal Best Seller', price: 69.99 },
  'FTD-SEA002': { name: "Florist's Choice Deluxe", price: 84.99 },
  'FTD-SEA003': { name: 'Local Favorites Bouquet', price: 59.99 },
  'FTD-SEA004': { name: 'San Francisco Special', price: 74.99 },
};

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
    const productInfo = MOCK_PRODUCTS[sku] || { name: `Product ${sku}`, price: 49.99 };

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
      total: subtotal + 14.99, // Add mock delivery fee
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
    let result;
    for (let i = 0; i < quantity; i++) {
      result = await client.addToCart(cartId, sku);
    }

    if (!result) {
      return errorResponse('Failed to add item to cart', 500);
    }

    const items = result.ITEMS || [];
    const subtotal = result.SUBTOTAL || 0;

    const response = successResponse({
      cartId,
      items: items.map((item, idx) => ({
        itemId: `item_${idx}`,
        sku: item.CODE,
        name: item.NAME,
        price: item.PRICE,
        quantity: item.QUANTITY,
      })),
      subtotal,
      total: subtotal,
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
