/**
 * GET /api/{state}/{city}/products
 * Returns products from Florist One API by occasion/category
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv, OCCASION_TO_CATEGORY } from '../../../lib/floristOne';
import { validateSlug } from '../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../lib/response';

interface Env extends FloristOneEnv {}

interface ProductResult {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  dimension?: string;
}

// Mock products for development without API credentials
const MOCK_PRODUCTS: ProductResult[] = [
  { sku: 'MOCK-001', name: 'Garden Splendor Bouquet', description: 'A beautiful mixed arrangement', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-002', name: 'Vibrant Celebration', description: 'Colorful celebration flowers', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-003', name: 'Sunshine Meadow', description: 'Bright and cheerful blooms', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-004', name: 'Classic Rose Dozen', description: 'Twelve stunning roses', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-005', name: 'Spring Garden Basket', description: 'Fresh spring flowers in a basket', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-006', name: 'Peaceful Lily', description: 'Elegant peace lily plant', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
];

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

  // Get query parameters
  const url = new URL(request.url);
  const occasion = url.searchParams.get('occasion') || 'best-sellers';
  const count = Math.min(parseInt(url.searchParams.get('count') || '12', 10), 50);
  const start = parseInt(url.searchParams.get('start') || '1', 10);

  // Map occasion slug to Florist One category code
  const categoryCode = OCCASION_TO_CATEGORY[occasion] || 'bs';

  // Check if credentials are configured
  if (!hasFloristOneCredentials(env)) {
    return successResponse({
      products: MOCK_PRODUCTS,
      total: MOCK_PRODUCTS.length,
      occasion,
      mock: true,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    const response = await client.getProducts(categoryCode, count, start);

    if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
      return successResponse({
        products: [],
        total: 0,
        occasion,
        message: 'No products found for this occasion',
      });
    }

    // Transform to our product format
    const products: ProductResult[] = response.PRODUCTS.map((p) => ({
      sku: p.CODE,
      name: p.NAME,
      description: p.DESCRIPTION,
      price: p.PRICE,
      image: p.SMALL,
      imageLarge: p.LARGE,
      dimension: p.DIMENSION || undefined,
    }));

    return successResponse({
      products,
      total: response.TOTAL || products.length,
      occasion,
      categoryCode,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch products'
    );
  }
};
