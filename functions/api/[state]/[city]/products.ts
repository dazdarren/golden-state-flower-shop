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
import { getMockProductsForOccasion } from '../../../lib/mockData';

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
  const sortParam = url.searchParams.get('sort') || 'default';
  const priceMin = url.searchParams.get('priceMin') ? parseFloat(url.searchParams.get('priceMin')!) : null;
  const priceMax = url.searchParams.get('priceMax') ? parseFloat(url.searchParams.get('priceMax')!) : null;

  // Map our sort options to Florist One API sorttype values
  // pa = price ascending, pd = price descending, az = name A-Z, za = name Z-A
  const sortMap: Record<string, 'pa' | 'pd' | 'az' | 'za' | undefined> = {
    'default': undefined,
    'price-low': 'pa',
    'price-high': 'pd',
    'name-az': 'az',
    'name-za': 'za',
  };
  const sorttype = sortMap[sortParam];

  // Map occasion slug to Florist One category code
  const categoryCode = OCCASION_TO_CATEGORY[occasion] || 'bs';

  // Check if credentials are configured
  if (!hasFloristOneCredentials(env)) {
    const mockProducts = getMockProductsForOccasion(occasion);
    return successResponse({
      products: mockProducts,
      total: mockProducts.length,
      occasion,
      mock: true,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    // Request more products if filtering by price to ensure we have enough after filtering
    const requestCount = (priceMin !== null || priceMax !== null) ? Math.min(count * 3, 100) : count;
    let response = await client.getProducts(categoryCode, requestCount, start, sorttype);
    let usedFallback = false;
    let originalCategory = categoryCode;

    // Fallback logic: if no products found, try alternative categories
    if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
      // Define fallback categories to try
      const fallbackCategories: Record<string, string[]> = {
        'md': ['ao', 'bs'], // Mother's Day -> All Occasions -> Best Sellers
        'ch': ['ao', 'bs'], // Christmas -> All Occasions -> Best Sellers
        'lr': ['ro', 'bs'], // Love/Romance -> Roses -> Best Sellers
        'nb': ['ao', 'bs'], // New Baby -> All Occasions -> Best Sellers
        'gw': ['ao', 'bs'], // Get Well -> All Occasions -> Best Sellers
        'ty': ['ao', 'bs'], // Thank You -> All Occasions -> Best Sellers
        'an': ['lr', 'ro', 'bs'], // Anniversary -> Love/Romance -> Roses -> Best Sellers
        'sy': ['ao', 'bs'], // Sympathy -> All Occasions -> Best Sellers
        'pl': ['ao', 'bs'], // Plants -> All Occasions -> Best Sellers
        'ro': ['lr', 'bs'], // Roses -> Love/Romance -> Best Sellers
      };

      const fallbacks = fallbackCategories[categoryCode] || ['bs'];

      for (const fallbackCode of fallbacks) {
        if (fallbackCode !== categoryCode) {
          response = await client.getProducts(fallbackCode, requestCount, start, sorttype);
          if (response.PRODUCTS && response.PRODUCTS.length > 0) {
            usedFallback = true;
            break;
          }
        }
      }

      // If still no products after fallbacks, return empty
      if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
        return successResponse({
          products: [],
          total: 0,
          occasion,
          originalCategory,
          message: 'No products found for this occasion',
        });
      }
    }

    // Transform to our product format
    let products: ProductResult[] = response.PRODUCTS.map((p) => ({
      sku: p.CODE,
      name: p.NAME,
      description: p.DESCRIPTION,
      price: p.PRICE,
      image: p.SMALL,
      imageLarge: p.LARGE,
      dimension: p.DIMENSION || undefined,
    }));

    // Apply price filtering if specified
    if (priceMin !== null || priceMax !== null) {
      products = products.filter((p) => {
        if (priceMin !== null && p.price < priceMin) return false;
        if (priceMax !== null && p.price > priceMax) return false;
        return true;
      });
    }

    // Limit to requested count after filtering
    const filteredProducts = products.slice(0, count);

    return successResponse({
      products: filteredProducts,
      total: products.length,
      occasion,
      categoryCode,
      ...(usedFallback && { fallback: true, originalCategory }),
      filters: {
        sort: sortParam,
        priceMin,
        priceMax,
      },
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch products'
    );
  }
};
