/**
 * Centralized category configuration
 * All product categories, occasions, product types, and seasonal collections
 */

export interface CategoryConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  metaDescription: string;
  icon?: string;
  apiCategory: string;
  priceRange?: {
    low: number;
    high: number;
  };
}

// ============================================================================
// OCCASIONS - Event-based flower categories
// ============================================================================

export const OCCASIONS: CategoryConfig[] = [
  {
    slug: 'birthday',
    name: 'Birthday',
    title: 'Birthday Flowers',
    description: 'Birthday flowers delivered today in {cityName}. Choose from colorful bouquets, elegant roses, or cheerful mixed arrangements. All include a free card message.',
    metaDescription: 'Order birthday flowers for delivery in {cityName}. Same-day delivery available.',
    icon: 'cake',
    apiCategory: 'bd',
    priceRange: { low: 39.99, high: 149.99 },
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    title: 'Anniversary Flowers',
    description: 'Anniversary flowers to mark your milestone. Classic roses, romantic mixed bouquets, and elegant arrangements delivered in {cityName}. Perfect for any year.',
    metaDescription: 'Order anniversary flowers for delivery in {cityName}. Romantic arrangements available.',
    icon: 'heart',
    apiCategory: 'an',
    priceRange: { low: 49.99, high: 199.99 },
  },
  {
    slug: 'love-romance',
    name: 'Love & Romance',
    title: 'Romantic Flowers',
    description: 'Romantic flowers to say what words can\'t. Red roses, premium bouquets, and elegant arrangements delivered in {cityName}. Free card message included.',
    metaDescription: 'Send romantic flowers for delivery in {cityName}. Perfect for expressing love.',
    icon: 'hearts',
    apiCategory: 'lr',
    priceRange: { low: 49.99, high: 249.99 },
  },
  {
    slug: 'new-baby',
    name: 'New Baby',
    title: 'New Baby Flowers',
    description: 'New baby flowers delivered to homes and hospitals in {cityName}. Cheerful arrangements in soft pinks, blues, or bright colors. Hospital delivery available.',
    metaDescription: 'Order new baby flowers for delivery in {cityName}. Celebrate the new arrival.',
    icon: 'baby',
    apiCategory: 'nb',
    priceRange: { low: 44.99, high: 129.99 },
  },
  {
    slug: 'thank-you',
    name: 'Thank You',
    title: 'Thank You Flowers',
    description: 'Thank you flowers to show appreciation. Bright, cheerful arrangements delivered same-day in {cityName}. Perfect for hosts, helpers, and anyone who deserves thanks.',
    metaDescription: 'Send thank you flowers in {cityName}. Express your gratitude with same-day delivery.',
    icon: 'gift',
    apiCategory: 'ty',
    priceRange: { low: 34.99, high: 119.99 },
  },
  {
    slug: 'get-well',
    name: 'Get Well',
    title: 'Get Well Flowers',
    description: 'Get well flowers delivered to hospitals and homes in {cityName}. Uplifting arrangements in bright, cheerful colors. We call ahead for hospital delivery.',
    metaDescription: 'Send get well flowers to hospitals and homes in {cityName}. Same-day delivery.',
    icon: 'sun',
    apiCategory: 'gw',
    priceRange: { low: 39.99, high: 119.99 },
  },
  {
    slug: 'sympathy',
    name: 'Sympathy',
    title: 'Sympathy Flowers',
    description: 'Sympathy flowers delivered with care to homes and funeral homes in {cityName}. Appropriate arrangements for services, wakes, and condolences. Delivery confirmation included.',
    metaDescription: 'Send sympathy flowers and funeral arrangements in {cityName}. Express delivery available.',
    icon: 'heart-outline',
    apiCategory: 'sy',
    priceRange: { low: 59.99, high: 299.99 },
  },
  {
    slug: 'congratulations',
    name: 'Congratulations',
    title: 'Congratulations Flowers',
    description: 'Congratulations flowers for graduations, promotions, new homes, and achievements. Vibrant arrangements delivered same-day in {cityName}.',
    metaDescription: 'Order congratulations flowers for delivery in {cityName}. Celebrate their success.',
    icon: 'star',
    apiCategory: 'ao',
    priceRange: { low: 44.99, high: 149.99 },
  },
  {
    slug: 'just-because',
    name: 'Just Because',
    title: 'Just Because Flowers',
    description: 'No occasion needed. Send flowers just because you\'re thinking of them. Beautiful arrangements delivered same-day in {cityName}.',
    metaDescription: 'Send just because flowers in {cityName}. No occasion needed to show you care.',
    icon: 'sparkles',
    apiCategory: 'ao',
    priceRange: { low: 34.99, high: 129.99 },
  },
];

// ============================================================================
// PRODUCT TYPES - Flower/plant type categories
// ============================================================================

export const PRODUCT_TYPES: CategoryConfig[] = [
  {
    slug: 'plants',
    name: 'Plants',
    title: 'Plants & Succulents',
    description: 'Potted plants and succulents delivered in {cityName}. Long-lasting gifts that grow with them. Low-maintenance options available.',
    metaDescription: 'Order plants and succulents for delivery in {cityName}. Green gifts that last.',
    icon: 'plant',
    apiCategory: 'pl',
    priceRange: { low: 34.99, high: 149.99 },
  },
  {
    slug: 'rose-bouquets',
    name: 'Rose Bouquets',
    title: 'Rose Bouquets',
    description: 'Rose bouquets in red, pink, white, and mixed colors. Classic elegance delivered same-day in {cityName}. From single stems to two dozen.',
    metaDescription: 'Send beautiful rose bouquets in {cityName}. Classic elegance delivered.',
    icon: 'rose',
    apiCategory: 'ro',
    priceRange: { low: 44.99, high: 199.99 },
  },
  {
    slug: 'mixed-arrangements',
    name: 'Mixed Arrangements',
    title: 'Mixed Flower Arrangements',
    description: 'Mixed flower bouquets with seasonal blooms. Colorful variety arranged fresh daily in {cityName}. Great for any occasion.',
    metaDescription: 'Order mixed flower arrangements in {cityName}. Colorful variety delivered fresh.',
    icon: 'bouquet',
    apiCategory: 'ao',
    priceRange: { low: 39.99, high: 149.99 },
  },
  {
    slug: 'premium-collection',
    name: 'Premium Collection',
    title: 'Premium Collection',
    description: 'Premium flower arrangements featuring the finest blooms. Hand-selected flowers, expert design, luxury presentation. Delivered in {cityName}.',
    metaDescription: 'Order premium luxury flowers in {cityName}. Exceptional quality and design.',
    icon: 'diamond',
    apiCategory: 'bs',
    priceRange: { low: 79.99, high: 349.99 },
  },
];

// ============================================================================
// SEASONAL COLLECTIONS - Holiday and seasonal categories
// ============================================================================

export interface SeasonalConfig extends CategoryConfig {
  timing: string;
  activeMonths: number[]; // 1-12 for Jan-Dec
  bannerColor?: string;
}

export const SEASONAL: SeasonalConfig[] = [
  {
    slug: 'valentines-day',
    name: "Valentine's Day",
    title: "Valentine's Day Flowers",
    description: "Valentine's Day flowers delivered in {cityName}. Red roses, romantic bouquets, and premium arrangements. Order early for guaranteed delivery.",
    metaDescription: "Order Valentine's Day flowers for delivery in {cityName}. Romantic arrangements available.",
    icon: 'heart-filled',
    apiCategory: 'lr',
    timing: 'January - February',
    activeMonths: [1, 2],
    bannerColor: 'rose',
    priceRange: { low: 49.99, high: 299.99 },
  },
  {
    slug: 'mothers-day',
    name: "Mother's Day",
    title: "Mother's Day Flowers",
    description: "Mother's Day flowers delivered in {cityName}. Beautiful arrangements Mom will love. Order ahead to reserve her perfect bouquet.",
    metaDescription: "Order Mother's Day flowers for delivery in {cityName}. Celebrate Mom with fresh blooms.",
    icon: 'heart',
    apiCategory: 'md',
    timing: 'April - May',
    activeMonths: [4, 5],
    bannerColor: 'pink',
    priceRange: { low: 44.99, high: 199.99 },
  },
  {
    slug: 'christmas',
    name: 'Christmas & Holidays',
    title: 'Holiday Flowers',
    description: 'Holiday flowers and arrangements in festive reds, greens, and winter whites. Delivered in {cityName}. Perfect for hosts and holiday gatherings.',
    metaDescription: 'Order Christmas and holiday flowers in {cityName}. Festive arrangements delivered.',
    icon: 'tree',
    apiCategory: 'ch',
    timing: 'November - December',
    activeMonths: [11, 12],
    bannerColor: 'forest',
    priceRange: { low: 44.99, high: 179.99 },
  },
  {
    slug: 'seasonal-specials',
    name: 'Seasonal Specials',
    title: 'Seasonal Specials',
    description: 'Seasonal flower arrangements featuring the freshest blooms available now. Limited selections delivered same-day in {cityName}.',
    metaDescription: 'Order seasonal flower specials in {cityName}. Fresh seasonal arrangements.',
    icon: 'calendar',
    apiCategory: 'ao',
    timing: 'Year-round',
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bannerColor: 'sage',
    priceRange: { low: 39.99, high: 149.99 },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getOccasionBySlug(slug: string): CategoryConfig | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function getProductTypeBySlug(slug: string): CategoryConfig | undefined {
  return PRODUCT_TYPES.find((p) => p.slug === slug);
}

export function getSeasonalBySlug(slug: string): SeasonalConfig | undefined {
  return SEASONAL.find((s) => s.slug === slug);
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return (
    getOccasionBySlug(slug) ||
    getProductTypeBySlug(slug) ||
    getSeasonalBySlug(slug)
  );
}

export function getActiveSeasonalCollections(): SeasonalConfig[] {
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
  return SEASONAL.filter((s) => s.activeMonths.includes(currentMonth));
}

export function getAllCategorySlugs(): string[] {
  return [
    ...OCCASIONS.map((o) => o.slug),
    ...PRODUCT_TYPES.map((p) => p.slug),
    ...SEASONAL.map((s) => s.slug),
  ];
}

// For navigation menus
export function getNavigationCategories() {
  return {
    occasions: OCCASIONS,
    productTypes: PRODUCT_TYPES,
    seasonal: SEASONAL,
  };
}
