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
