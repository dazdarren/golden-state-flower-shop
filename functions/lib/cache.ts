/**
 * Caching utilities for Cloudflare Pages Functions
 * Uses the Workers Cache API (caches.default)
 */

// Cache TTL constants
export const CACHE_TTL = {
  DELIVERY_DATES: 20 * 60, // 20 minutes
  PRODUCT: 8 * 60 * 60, // 8 hours
  PRODUCT_LIST: 6 * 60 * 60, // 6 hours
} as const;

/**
 * Generate a cache key for delivery dates
 */
export function getDeliveryDatesCacheKey(zip: string): string {
  return `delivery-dates:${zip}`;
}

/**
 * Generate a cache key for product data
 */
export function getProductCacheKey(sku: string): string {
  return `product:${sku}`;
}

/**
 * Get cached response from Workers cache
 */
export async function getCachedResponse<T>(
  cacheKey: string,
  request: Request
): Promise<T | null> {
  try {
    // Create a cache-compatible request URL
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/_cache/${cacheKey}`;

    const cache = caches.default;
    const cachedResponse = await cache.match(new Request(cacheUrl.toString()));

    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data as T;
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  return null;
}

/**
 * Store response in Workers cache
 */
export async function setCachedResponse<T>(
  cacheKey: string,
  data: T,
  ttlSeconds: number,
  request: Request
): Promise<void> {
  try {
    // Create a cache-compatible request URL
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/_cache/${cacheKey}`;

    const cache = caches.default;
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttlSeconds}`,
      },
    });

    await cache.put(new Request(cacheUrl.toString()), response);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Delete cached response
 */
export async function deleteCachedResponse(
  cacheKey: string,
  request: Request
): Promise<void> {
  try {
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/_cache/${cacheKey}`;

    const cache = caches.default;
    await cache.delete(new Request(cacheUrl.toString()));
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}
