/**
 * GET /api/{state}/{city}/delivery-dates
 * Returns available delivery dates for a ZIP code
 */

import { createFloristOneClient, FloristOneEnv } from '../../../lib/floristOne';
import { validateZip, validateSlug } from '../../../lib/validation';
import {
  successResponse,
  errorResponse,
  handleCors,
  methodNotAllowedResponse,
  serverErrorResponse,
} from '../../../lib/response';
import {
  getCachedResponse,
  setCachedResponse,
  getDeliveryDatesCacheKey,
  CACHE_TTL,
} from '../../../lib/cache';

interface Env extends FloristOneEnv {}

interface DeliveryDateResult {
  date: string;
  description: string;
  price: number;
  available: boolean;
}

interface CachedDeliveryDates {
  dates: DeliveryDateResult[];
  fetchedAt: number;
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

  // Get and validate ZIP from query string
  const url = new URL(request.url);
  const zip = url.searchParams.get('zip');

  const zipResult = validateZip(zip);
  if (!zipResult.success) {
    return errorResponse(zipResult.error!);
  }

  const validZip = zipResult.data!;

  // Check cache first
  const cacheKey = getDeliveryDatesCacheKey(validZip);
  const cached = await getCachedResponse<CachedDeliveryDates>(cacheKey, request);

  if (cached) {
    return successResponse({
      dates: cached.dates,
      fromCache: true,
      zip: validZip,
    });
  }

  // Check if credentials are configured
  if (!env.FLORISTONE_AFFILIATE_ID || !env.FLORISTONE_API_TOKEN) {
    // Return mock data for development without credentials
    const mockDates = generateMockDeliveryDates();
    return successResponse({
      dates: mockDates,
      mock: true,
      zip: validZip,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    const response = await client.getDeliveryDates(validZip);

    if (response.status !== 'success' || !response.delivery_dates) {
      return errorResponse(response.error || 'Failed to fetch delivery dates', 500);
    }

    const dates: DeliveryDateResult[] = response.delivery_dates.map((d) => ({
      date: d.delivery_date,
      description: d.delivery_day,
      price: d.delivery_charge,
      available: d.available,
    }));

    // Cache the result
    const cacheData: CachedDeliveryDates = {
      dates,
      fetchedAt: Date.now(),
    };
    await setCachedResponse(cacheKey, cacheData, CACHE_TTL.DELIVERY_DATES, request);

    return successResponse({
      dates,
      fromCache: false,
      zip: validZip,
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch delivery dates'
    );
  }
};

/**
 * Generate mock delivery dates for development
 */
function generateMockDeliveryDates(): DeliveryDateResult[] {
  const dates: DeliveryDateResult[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = date.toISOString().split('T')[0];

    // No delivery on Sundays in mock
    const isSunday = date.getDay() === 0;

    dates.push({
      date: dateStr,
      description: dayOfWeek,
      price: i === 0 ? 14.99 : 9.99, // Same-day costs more
      available: !isSunday,
    });
  }

  return dates;
}
