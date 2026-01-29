/**
 * GET /api/{state}/{city}/product/{sku}
 * Returns a single product by SKU
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../../lib/floristOne';
import { validateSlug, validateSku } from '../../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../../lib/response';

interface Env extends FloristOneEnv {}

interface ProductDetail {
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

  const skuResult = validateSku(params.sku);
  if (!skuResult.success) {
    return errorResponse(skuResult.error!);
  }

  const sku = skuResult.data!;

  // Check if credentials are configured
  if (!hasFloristOneCredentials(env)) {
    // Return mock product
    return successResponse({
      product: {
        sku,
        name: `Product ${sku}`,
        description: 'Beautiful flower arrangement (mock data)',
        price: 59.99,
        image: '/images/placeholder-flower.svg',
        imageLarge: '/images/placeholder-flower.svg',
      },
      mock: true,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    const response = await client.getProduct(sku);

    if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
      return errorResponse('Product not found', 404);
    }

    const p = response.PRODUCTS[0];
    const product: ProductDetail = {
      sku: p.CODE,
      name: p.NAME,
      description: p.DESCRIPTION,
      price: p.PRICE,
      image: p.SMALL,
      imageLarge: p.LARGE,
      dimension: p.DIMENSION || undefined,
    };

    return successResponse({ product });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch product'
    );
  }
};
