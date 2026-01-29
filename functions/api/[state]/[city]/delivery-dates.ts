/**
 * GET /api/{state}/{city}/delivery-dates
 * Returns available delivery dates for a ZIP code
 */

import { createFloristOneClient, hasFloristOneCredentials, FloristOneEnv } from '../../../lib/floristOne';
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
  formatted: string;
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
  if (!hasFloristOneCredentials(env)) {
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

    if (!response.DATES || response.DATES.length === 0) {
      return errorResponse(response.error || 'No delivery dates available for this ZIP code', 404);
    }

    // Transform dates from MM/DD/YYYY to ISO format and include formatted version
    const dates: DeliveryDateResult[] = response.DATES.map((dateStr) => {
      // Parse MM/DD/YYYY
      const [month, day, year] = dateStr.split('/');
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const date = new Date(isoDate);

      return {
        date: isoDate,
        formatted: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        available: true,
      };
    });

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

    // Skip Sundays (Florist One doesn't deliver on Sundays)
    if (date.getDay() === 0) continue;

    const isoDate = date.toISOString().split('T')[0];
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    dates.push({
      date: isoDate,
      formatted,
      available: true,
    });
  }

  return dates;
}
