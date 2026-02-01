/**
 * Simple Rate Limiting for Cloudflare Pages Functions
 *
 * Note: This uses in-memory storage which resets between deployments
 * and may not work perfectly across multiple function instances.
 * For production, consider using Cloudflare Rate Limiting or KV storage.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Key: IP address, Value: request count and reset time
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute

function cleanupOldEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  maxRequests: number;  // Max requests allowed
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param ip - Client IP address
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status and remaining requests
 */
export function checkRateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  cleanupOldEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No existing entry - create new one
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(ip, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Existing entry - check if under limit
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limited
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  };
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Checkout endpoints - strict limits
  placeOrder: { maxRequests: 5, windowMs: 60000 },      // 5 per minute
  getTotal: { maxRequests: 30, windowMs: 60000 },       // 30 per minute

  // Payment endpoints - strict limits
  authorizeNetKey: { maxRequests: 10, windowMs: 60000 }, // 10 per minute

  // Cart endpoints - more lenient
  cart: { maxRequests: 60, windowMs: 60000 },            // 60 per minute

  // General API endpoints
  default: { maxRequests: 100, windowMs: 60000 },        // 100 per minute
};
