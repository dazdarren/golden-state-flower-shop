/**
 * Response helper utilities for API endpoints
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse<T>(
  data: ApiResponse<T>,
  status = 200,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...additionalHeaders,
    },
  });
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  additionalHeaders: Record<string, string> = {}
): Response {
  return jsonResponse({ success: true, data }, 200, additionalHeaders);
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status = 400,
  additionalHeaders: Record<string, string> = {}
): Response {
  return jsonResponse({ success: false, error: message }, status, additionalHeaders);
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Create a not found response
 */
export function notFoundResponse(message = 'Not found'): Response {
  return errorResponse(message, 404);
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}

/**
 * Create a server error response
 */
export function serverErrorResponse(message = 'Internal server error'): Response {
  return errorResponse(message, 500);
}

/**
 * Create a method not allowed response
 */
export function methodNotAllowedResponse(allowed: string[]): Response {
  return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Allow': allowed.join(', '),
      ...CORS_HEADERS,
    },
  });
}
