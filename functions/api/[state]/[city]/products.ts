/**
 * GET /api/{state}/{city}/products
 * Returns products from Florist One API by occasion/category
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

interface Env extends FloristOneEnv {}

interface ProductResult {
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageLarge: string;
  dimension?: string;
}

// Extended mock products organized by category for development
const MOCK_PRODUCTS_BY_CATEGORY: Record<string, ProductResult[]> = {
  // Birthday
  birthday: [
    { sku: 'MOCK-BD-001', name: 'Birthday Bliss Bouquet', description: 'Celebrate their special day with this vibrant mix of roses, lilies, and daisies', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-BD-002', name: 'Party Time Arrangement', description: 'Colorful blooms perfect for birthday celebrations', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-BD-003', name: 'Happy Birthday Roses', description: 'A dozen cheerful roses in festive colors', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-BD-004', name: 'Sunshine Birthday Basket', description: 'Bright sunflowers and daisies in a charming basket', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Sympathy
  sympathy: [
    { sku: 'MOCK-SY-001', name: 'Peaceful Tribute', description: 'An elegant arrangement of white lilies and roses to express condolences', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-SY-002', name: 'Serenity Wreath', description: 'A beautiful circular tribute with white and lavender blooms', price: 129.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-SY-003', name: 'Comfort and Light Bouquet', description: 'Soft pastels to bring comfort during difficult times', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-SY-004', name: 'Eternal Peace Lilies', description: 'Classic white peace lily plant as a lasting memorial', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Anniversary
  anniversary: [
    { sku: 'MOCK-AN-001', name: 'Romance in Bloom', description: 'Red roses and orchids for your special anniversary', price: 99.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-AN-002', name: 'Years of Love Bouquet', description: 'Elegant mix of roses symbolizing enduring love', price: 84.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-AN-003', name: 'Golden Anniversary Arrangement', description: 'Luxurious gold and cream blooms for milestone celebrations', price: 119.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-AN-004', name: 'Forever Yours Roses', description: 'Two dozen premium roses in passionate red', price: 149.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Love & Romance
  'love-romance': [
    { sku: 'MOCK-LR-001', name: 'Passionate Reds', description: 'Classic red roses to express your deepest love', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-LR-002', name: 'Sweetheart Bouquet', description: 'Pink roses and lilies for your sweetheart', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-LR-003', name: 'Love Letter Arrangement', description: 'Romantic mix of roses, tulips, and baby\'s breath', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-LR-004', name: 'Dozen Red Roses', description: 'The timeless gesture of love - 12 premium red roses', price: 99.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Get Well
  'get-well': [
    { sku: 'MOCK-GW-001', name: 'Cheerful Recovery', description: 'Bright and uplifting flowers to speed their recovery', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-GW-002', name: 'Sunny Get Well Wishes', description: 'Yellow roses and daisies to brighten their day', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-GW-003', name: 'Healing Garden Basket', description: 'Soothing lavender and green plants for wellness', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-GW-004', name: 'Feel Better Blooms', description: 'A cheerful mix to lift their spirits', price: 49.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Thank You
  'thank-you': [
    { sku: 'MOCK-TY-001', name: 'Gratitude Bouquet', description: 'Express your thanks with this lovely arrangement', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-TY-002', name: 'Appreciation Blooms', description: 'Colorful flowers to show how much you care', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-TY-003', name: 'Thankful Heart Arrangement', description: 'Pink and peach roses with garden flowers', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-TY-004', name: 'Many Thanks Garden', description: 'A bountiful mix of seasonal favorites', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // New Baby
  'new-baby': [
    { sku: 'MOCK-NB-001', name: 'Welcome Baby Bouquet', description: 'Soft pastels to welcome the new arrival', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-NB-002', name: 'Baby Boy Blues', description: 'Blue-themed arrangement for a baby boy', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-NB-003', name: 'Baby Girl Pinks', description: 'Pink-themed arrangement for a baby girl', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-NB-004', name: 'Stork Delivery Basket', description: 'Adorable arrangement with baby accessories', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Just Because / Congratulations / All Occasions
  'just-because': [
    { sku: 'MOCK-JB-001', name: 'Simply Beautiful', description: 'A lovely arrangement for any occasion', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-JB-002', name: 'Garden Delight', description: 'Fresh garden flowers to brighten any day', price: 49.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-JB-003', name: 'Thinking of You', description: 'A thoughtful gesture in bloom form', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-JB-004', name: 'Everyday Elegance', description: 'Classic beauty for everyday moments', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Plants
  plants: [
    { sku: 'MOCK-PL-001', name: 'Peace Lily', description: 'Elegant peace lily in decorative container', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PL-002', name: 'Orchid Elegance', description: 'Stunning phalaenopsis orchid plant', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PL-003', name: 'Succulent Garden', description: 'Low-maintenance succulent arrangement', price: 49.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PL-004', name: 'Fiddle Leaf Fig', description: 'Trendy fiddle leaf fig in modern planter', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Rose Bouquets
  'rose-bouquets': [
    { sku: 'MOCK-RO-001', name: 'Classic Dozen Roses', description: 'Twelve premium long-stem roses', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-RO-002', name: 'Two Dozen Roses', description: 'Lavish display of 24 roses', price: 149.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-RO-003', name: 'Rainbow Rose Bouquet', description: 'Assorted color roses in a beautiful arrangement', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-RO-004', name: 'Premium Rose Box', description: 'Luxury roses presented in an elegant box', price: 119.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Mixed Arrangements
  'mixed-arrangements': [
    { sku: 'MOCK-MX-001', name: 'Garden Splendor', description: 'A beautiful mix of seasonal blooms', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MX-002', name: 'Florist\'s Choice', description: 'Our designers create a stunning custom arrangement', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MX-003', name: 'Country Charm Basket', description: 'Rustic basket filled with garden favorites', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MX-004', name: 'Luxury Mixed Bouquet', description: 'Premium blooms in an elegant presentation', price: 99.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Premium Collection / Best Sellers
  'premium-collection': [
    { sku: 'MOCK-PR-001', name: 'Luxe Rose & Orchid', description: 'Premium roses paired with exotic orchids', price: 149.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PR-002', name: 'Grand Celebration', description: 'Oversized arrangement for special occasions', price: 199.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PR-003', name: 'Designer\'s Masterpiece', description: 'Our finest creation with premium blooms', price: 179.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-PR-004', name: 'Ultimate Rose Collection', description: '50 premium roses in a stunning display', price: 299.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Valentine's Day
  'valentines-day': [
    { sku: 'MOCK-VD-001', name: 'Valentine\'s Dozen Roses', description: 'Classic red roses for your Valentine', price: 99.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-VD-002', name: 'Cupid\'s Arrow', description: 'Romantic red and pink arrangement', price: 84.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-VD-003', name: 'Be Mine Bouquet', description: 'Heart-shaped rose arrangement', price: 109.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-VD-004', name: 'Sweet Romance', description: 'Roses with chocolates and teddy bear', price: 129.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Mother's Day
  'mothers-day': [
    { sku: 'MOCK-MD-001', name: 'Mom\'s Garden Bouquet', description: 'Beautiful blooms for the best mom', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MD-002', name: 'Queen of Hearts', description: 'Pink roses and lilies fit for a queen', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MD-003', name: 'Mother\'s Love Orchid', description: 'Elegant orchid plant for mom', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-MD-004', name: 'Spring for Mom', description: 'Bright spring flowers to celebrate mom', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
  // Christmas
  christmas: [
    { sku: 'MOCK-CH-001', name: 'Holiday Centerpiece', description: 'Festive red and green arrangement', price: 79.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-CH-002', name: 'Christmas Poinsettia', description: 'Classic red poinsettia plant', price: 49.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-CH-003', name: 'Winter Wonderland', description: 'White flowers with silver accents', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
    { sku: 'MOCK-CH-004', name: 'Holiday Joy Bouquet', description: 'Roses, carnations, and holiday greens', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  ],
};

// Default/fallback products
const DEFAULT_MOCK_PRODUCTS: ProductResult[] = [
  { sku: 'MOCK-001', name: 'Garden Splendor Bouquet', description: 'A beautiful mixed arrangement', price: 59.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-002', name: 'Vibrant Celebration', description: 'Colorful celebration flowers', price: 69.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-003', name: 'Sunshine Meadow', description: 'Bright and cheerful blooms', price: 54.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-004', name: 'Classic Rose Dozen', description: 'Twelve stunning roses', price: 89.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-005', name: 'Spring Garden Basket', description: 'Fresh spring flowers in a basket', price: 74.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
  { sku: 'MOCK-006', name: 'Peaceful Lily', description: 'Elegant peace lily plant', price: 64.99, image: '/images/placeholder-flower.svg', imageLarge: '/images/placeholder-flower.svg' },
];

// Get mock products for an occasion, with fallback
function getMockProductsForOccasion(occasion: string): ProductResult[] {
  // Direct match
  if (MOCK_PRODUCTS_BY_CATEGORY[occasion]) {
    return MOCK_PRODUCTS_BY_CATEGORY[occasion];
  }
  // Alias mappings
  const aliasMap: Record<string, string> = {
    'congratulations': 'just-because',
    'seasonal-specials': 'mixed-arrangements',
    'best-sellers': 'premium-collection',
    'everyday': 'just-because',
  };
  if (aliasMap[occasion] && MOCK_PRODUCTS_BY_CATEGORY[aliasMap[occasion]]) {
    return MOCK_PRODUCTS_BY_CATEGORY[aliasMap[occasion]];
  }
  // Default fallback
  return DEFAULT_MOCK_PRODUCTS;
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

  // Get query parameters
  const url = new URL(request.url);
  const occasion = url.searchParams.get('occasion') || 'best-sellers';
  const count = Math.min(parseInt(url.searchParams.get('count') || '12', 10), 50);
  const start = parseInt(url.searchParams.get('start') || '1', 10);
  const sortParam = url.searchParams.get('sort') || 'default';
  const priceMin = url.searchParams.get('priceMin') ? parseFloat(url.searchParams.get('priceMin')!) : null;
  const priceMax = url.searchParams.get('priceMax') ? parseFloat(url.searchParams.get('priceMax')!) : null;

  // Map our sort options to Florist One API sorttype values
  // pa = price ascending, pd = price descending, az = name A-Z, za = name Z-A
  const sortMap: Record<string, 'pa' | 'pd' | 'az' | 'za' | undefined> = {
    'default': undefined,
    'price-low': 'pa',
    'price-high': 'pd',
    'name-az': 'az',
    'name-za': 'za',
  };
  const sorttype = sortMap[sortParam];

  // Map occasion slug to Florist One category code
  const categoryCode = OCCASION_TO_CATEGORY[occasion] || 'bs';

  // Check if credentials are configured
  if (!hasFloristOneCredentials(env)) {
    const mockProducts = getMockProductsForOccasion(occasion);
    return successResponse({
      products: mockProducts,
      total: mockProducts.length,
      occasion,
      mock: true,
      message: 'Using mock data - Florist One credentials not configured',
    });
  }

  try {
    const client = createFloristOneClient(env);
    // Request more products if filtering by price to ensure we have enough after filtering
    const requestCount = (priceMin !== null || priceMax !== null) ? Math.min(count * 3, 100) : count;
    let response = await client.getProducts(categoryCode, requestCount, start, sorttype);
    let usedFallback = false;
    let originalCategory = categoryCode;

    // Fallback logic: if no products found, try alternative categories
    if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
      // Define fallback categories to try
      const fallbackCategories: Record<string, string[]> = {
        'md': ['ao', 'bs'], // Mother's Day -> All Occasions -> Best Sellers
        'ch': ['ao', 'bs'], // Christmas -> All Occasions -> Best Sellers
        'lr': ['ro', 'bs'], // Love/Romance -> Roses -> Best Sellers
        'nb': ['ao', 'bs'], // New Baby -> All Occasions -> Best Sellers
        'gw': ['ao', 'bs'], // Get Well -> All Occasions -> Best Sellers
        'ty': ['ao', 'bs'], // Thank You -> All Occasions -> Best Sellers
        'an': ['lr', 'ro', 'bs'], // Anniversary -> Love/Romance -> Roses -> Best Sellers
        'sy': ['ao', 'bs'], // Sympathy -> All Occasions -> Best Sellers
        'pl': ['ao', 'bs'], // Plants -> All Occasions -> Best Sellers
        'ro': ['lr', 'bs'], // Roses -> Love/Romance -> Best Sellers
      };

      const fallbacks = fallbackCategories[categoryCode] || ['bs'];

      for (const fallbackCode of fallbacks) {
        if (fallbackCode !== categoryCode) {
          response = await client.getProducts(fallbackCode, requestCount, start, sorttype);
          if (response.PRODUCTS && response.PRODUCTS.length > 0) {
            usedFallback = true;
            break;
          }
        }
      }

      // If still no products after fallbacks, return empty
      if (!response.PRODUCTS || response.PRODUCTS.length === 0) {
        return successResponse({
          products: [],
          total: 0,
          occasion,
          originalCategory,
          message: 'No products found for this occasion',
        });
      }
    }

    // Transform to our product format
    let products: ProductResult[] = response.PRODUCTS.map((p) => ({
      sku: p.CODE,
      name: p.NAME,
      description: p.DESCRIPTION,
      price: p.PRICE,
      image: p.SMALL,
      imageLarge: p.LARGE,
      dimension: p.DIMENSION || undefined,
    }));

    // Apply price filtering if specified
    if (priceMin !== null || priceMax !== null) {
      products = products.filter((p) => {
        if (priceMin !== null && p.price < priceMin) return false;
        if (priceMax !== null && p.price > priceMax) return false;
        return true;
      });
    }

    // Limit to requested count after filtering
    const filteredProducts = products.slice(0, count);

    return successResponse({
      products: filteredProducts,
      total: products.length,
      occasion,
      categoryCode,
      ...(usedFallback && { fallback: true, originalCategory }),
      filters: {
        sort: sortParam,
        priceMin,
        priceMax,
      },
    });
  } catch (error) {
    console.error('Florist One API error:', error);
    return serverErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch products'
    );
  }
};
