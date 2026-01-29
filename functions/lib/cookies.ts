/**
 * Cookie utilities for cart management
 */

const CART_COOKIE_NAME = 'flo_cart_id';
const MOCK_CART_DATA_COOKIE = 'flo_mock_cart';
const CART_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface MockCartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export interface MockCartData {
  items: MockCartItem[];
}

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Parse cookies from request headers
 */
export function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (name) {
      const trimmedName = name.trim();
      const value = rest.join('=').trim();
      if (trimmedName && value) {
        cookies[trimmedName] = decodeURIComponent(value);
      }
    }
  });

  return cookies;
}

/**
 * Get cart ID from request cookies
 */
export function getCartIdFromCookies(request: Request): string | null {
  const cookies = parseCookies(request);
  return cookies[CART_COOKIE_NAME] || null;
}

/**
 * Serialize a cookie for Set-Cookie header
 */
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join('; ');
}

/**
 * Create Set-Cookie header for cart ID
 */
export function createCartCookie(
  cartId: string,
  stateSlug: string,
  citySlug: string,
  isProduction: boolean
): string {
  // Use root path so cookie is sent to both /ca/san-francisco/* and /api/ca/san-francisco/*
  return serializeCookie(CART_COOKIE_NAME, cartId, {
    maxAge: CART_COOKIE_MAX_AGE,
    path: '/',
    secure: isProduction,
    httpOnly: true,
    sameSite: 'Lax',
  });
}

/**
 * Create Set-Cookie header to clear cart
 */
export function clearCartCookie(
  stateSlug: string,
  citySlug: string,
  isProduction: boolean
): string {
  return serializeCookie(CART_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    secure: isProduction,
    httpOnly: true,
    sameSite: 'Lax',
  });
}

/**
 * Add Set-Cookie header to response
 */
export function addCookieToResponse(response: Response, cookie: string): Response {
  const newResponse = new Response(response.body, response);
  newResponse.headers.append('Set-Cookie', cookie);
  return newResponse;
}

/**
 * Get mock cart data from cookies
 */
export function getMockCartData(request: Request): MockCartData {
  const cookies = parseCookies(request);
  const cartDataStr = cookies[MOCK_CART_DATA_COOKIE];

  if (!cartDataStr) {
    return { items: [] };
  }

  try {
    return JSON.parse(cartDataStr) as MockCartData;
  } catch {
    return { items: [] };
  }
}

/**
 * Create Set-Cookie header for mock cart data
 */
export function createMockCartDataCookie(
  data: MockCartData,
  stateSlug: string,
  citySlug: string,
  isProduction: boolean
): string {
  // Use root path so cookie is sent to both pages and API
  return serializeCookie(MOCK_CART_DATA_COOKIE, JSON.stringify(data), {
    maxAge: CART_COOKIE_MAX_AGE,
    path: '/',
    secure: isProduction,
    httpOnly: false, // Allow JS to read for debugging
    sameSite: 'Lax',
  });
}

/**
 * Clear mock cart data cookie
 */
export function clearMockCartDataCookie(
  stateSlug: string,
  citySlug: string,
  isProduction: boolean
): string {
  return serializeCookie(MOCK_CART_DATA_COOKIE, '', {
    maxAge: 0,
    path: '/',
    secure: isProduction,
    httpOnly: false,
    sameSite: 'Lax',
  });
}
