/**
 * GET /api/{state}/{city}/payment/authorizenet-key
 * Returns AuthorizeNet Accept.js configuration for client-side tokenization
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

interface Env extends FloristOneEnv {}

// Allowed origins for payment endpoints (restrict API key access)
const ALLOWED_ORIGINS = [
  'https://goldenstateflowers.com',
  'https://www.goldenstateflowers.com',
  'http://localhost:3000',
  'http://localhost:8788',
];

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params, env } = context;

  // Validate origin for payment endpoints (security measure)
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  const isValidOrigin = !origin || ALLOWED_ORIGINS.some(allowed =>
    origin.startsWith(allowed) || referer?.startsWith(allowed)
  );

  // In production, reject requests from unknown origins
  const isProduction = request.url.startsWith('https://');
  if (isProduction && origin && !isValidOrigin) {
    console.warn(`Rejected payment key request from origin: ${origin}`);
    return errorResponse('Forbidden', 403);
  }

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

  // Check credentials
  if (!hasFloristOneCredentials(env)) {
    // Return mock config for development
    return successResponse({
      username: 'MOCK_USERNAME',
      key: 'MOCK_KEY',
      url: 'https://jstest.authorize.net/v1/Accept.js',
      mock: true,
      message: 'Using mock payment config - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    const result = await client.getAuthorizeNetKey();

    if (!result.USERNAME || !result.AUTHORIZENET_KEY) {
      return errorResponse('Failed to retrieve payment configuration', 500);
    }

    return successResponse({
      username: result.USERNAME,
      key: result.AUTHORIZENET_KEY,
      url: result.AUTHORIZENET_URL || 'https://js.authorize.net/v1/Accept.js',
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to get payment configuration'
    );
  }
};
