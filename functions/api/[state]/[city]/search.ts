/**
 * GET /api/{state}/{city}/search
 * Search products across multiple categories from Florist One API
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
import { searchMockProducts } from '../../../lib/mockData';

interface Env extends FloristOneEnv {}

interface ProductResult {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  dimension?: string;
  category?: string;
}

// Categories to search across
const SEARCH_CATEGORIES = ['bd', 'sy', 'an', 'gw', 'ty', 'lr', 'nb', 'ao', 'bs', 'ro', 'pl'];

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
  const query = url.searchParams.get('q')?.trim().toLowerCase() || '';
  const count = Math.min(parseInt(url.searchParams.get('count') || '20', 10), 50);

  if (!query || query.length < 2) {
    return errorResponse('Search query must be at least 2 characters', 400);
  }

  // Check if credentials are configured
  if (!hasFloristOneCredentials(env)) {
    // Search mock products
    const filtered = searchMockProducts(query, count);

    return successResponse({
      products: filtered,
      total: filtered.length,
      query,
      mock: true,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    const allProducts: ProductResult[] = [];
    const seenSkus = new Set<string>();

    // Search across multiple categories in parallel
    const categoryPromises = SEARCH_CATEGORIES.map(async (category) => {
      try {
        const response = await client.getProducts(category, 15, 1);
        if (response.PRODUCTS) {
          return response.PRODUCTS.map((p) => ({
            sku: p.CODE,
            name: p.NAME,
            description: p.DESCRIPTION,
            price: p.PRICE,
            image: p.SMALL,
            imageLarge: p.LARGE,
            dimension: p.DIMENSION || undefined,
            category,
          }));
        }
        return [];
      } catch {
        // Continue if one category fails
        return [];
      }
    });

    const categoryResults = await Promise.all(categoryPromises);

    // Flatten and deduplicate results
    for (const products of categoryResults) {
      for (const product of products) {
        if (!seenSkus.has(product.sku)) {
          seenSkus.add(product.sku);
          allProducts.push(product);
        }
      }
    }

    // Filter products by search query
    const searchTerms = query.split(/\s+/).filter((term) => term.length >= 2);

    const scoredProducts = allProducts
      .map((product) => {
        const nameWords = product.name.toLowerCase();
        const descWords = product.description.toLowerCase();

        let score = 0;
        let matches = false;

        for (const term of searchTerms) {
          // Exact name match (highest score)
          if (nameWords.includes(term)) {
            score += nameWords.startsWith(term) ? 10 : 5;
            matches = true;
          }
          // Description match
          if (descWords.includes(term)) {
            score += 2;
            matches = true;
          }
          // Category match
          if (product.category) {
            const categoryName = getCategoryName(product.category);
            if (categoryName.includes(term)) {
              score += 3;
              matches = true;
            }
          }
        }

        return { product, score, matches };
      })
      .filter((item) => item.matches)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((item) => item.product);

    return successResponse({
      products: scoredProducts,
      total: scoredProducts.length,
      query,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to search products'
    );
  }
};

function getCategoryName(code: string): string {
  const categoryNames: Record<string, string> = {
    bd: 'birthday',
    sy: 'sympathy funeral',
    an: 'anniversary',
    gw: 'get well',
    ty: 'thank you',
    lr: 'love romance',
    nb: 'new baby',
    ao: 'everyday just because',
    bs: 'best sellers popular',
    ro: 'roses rose',
    pl: 'plants plant succulent',
    md: 'mothers day',
    ch: 'christmas holiday',
  };
  return categoryNames[code] || '';
}
