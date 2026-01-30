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
}

// ============================================================================
// OCCASIONS - Event-based flower categories
// ============================================================================

export const OCCASIONS: CategoryConfig[] = [
  {
    slug: 'birthday',
    name: 'Birthday',
    title: 'Birthday Flowers',
    description: 'Celebrate their special day with a beautiful birthday flower arrangement.',
    metaDescription: 'Order birthday flowers for delivery in {cityName}. Same-day delivery available.',
    icon: 'cake',
    apiCategory: 'bd',
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    title: 'Anniversary Flowers',
    description: 'Mark your milestone with romantic anniversary flower arrangements.',
    metaDescription: 'Order anniversary flowers for delivery in {cityName}. Romantic arrangements available.',
    icon: 'heart',
    apiCategory: 'an',
  },
  {
    slug: 'love-romance',
    name: 'Love & Romance',
    title: 'Romantic Flowers',
    description: 'Express your love with stunning romantic flower arrangements.',
    metaDescription: 'Send romantic flowers for delivery in {cityName}. Perfect for expressing love.',
    icon: 'hearts',
    apiCategory: 'lr',
  },
  {
    slug: 'new-baby',
    name: 'New Baby',
    title: 'New Baby Flowers',
    description: 'Welcome the newest arrival with cheerful baby flower arrangements.',
    metaDescription: 'Order new baby flowers for delivery in {cityName}. Celebrate the new arrival.',
    icon: 'baby',
    apiCategory: 'nb',
  },
  {
    slug: 'thank-you',
    name: 'Thank You',
    title: 'Thank You Flowers',
    description: 'Show your appreciation with beautiful thank you flower arrangements.',
    metaDescription: 'Send thank you flowers in {cityName}. Express your gratitude with same-day delivery.',
    icon: 'gift',
    apiCategory: 'ty',
  },
  {
    slug: 'get-well',
    name: 'Get Well',
    title: 'Get Well Flowers',
    description: 'Brighten their recovery with cheerful get well flower arrangements.',
    metaDescription: 'Send get well flowers to hospitals and homes in {cityName}. Same-day delivery.',
    icon: 'sun',
    apiCategory: 'gw',
  },
  {
    slug: 'sympathy',
    name: 'Sympathy',
    title: 'Sympathy Flowers',
    description: 'Express your condolences with thoughtful sympathy flowers and arrangements.',
    metaDescription: 'Send sympathy flowers and funeral arrangements in {cityName}. Express delivery available.',
    icon: 'heart-outline',
    apiCategory: 'sy',
  },
  {
    slug: 'congratulations',
    name: 'Congratulations',
    title: 'Congratulations Flowers',
    description: 'Celebrate their achievements with vibrant congratulations arrangements.',
    metaDescription: 'Order congratulations flowers for delivery in {cityName}. Celebrate their success.',
    icon: 'star',
    apiCategory: 'ao',
  },
  {
    slug: 'just-because',
    name: 'Just Because',
    title: 'Just Because Flowers',
    description: 'Brighten their day with beautiful flowers, just because.',
    metaDescription: 'Send just because flowers in {cityName}. No occasion needed to show you care.',
    icon: 'sparkles',
    apiCategory: 'ao',
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
    description: 'Long-lasting potted plants, succulents, and green gifts that keep on growing.',
    metaDescription: 'Order plants and succulents for delivery in {cityName}. Green gifts that last.',
    icon: 'plant',
    apiCategory: 'pl',
  },
  {
    slug: 'rose-bouquets',
    name: 'Rose Bouquets',
    title: 'Rose Bouquets',
    description: 'Classic and elegant rose arrangements in stunning colors.',
    metaDescription: 'Send beautiful rose bouquets in {cityName}. Classic elegance delivered.',
    icon: 'rose',
    apiCategory: 'ro',
  },
  {
    slug: 'mixed-arrangements',
    name: 'Mixed Arrangements',
    title: 'Mixed Flower Arrangements',
    description: 'Vibrant mixed bouquets featuring a variety of seasonal blooms.',
    metaDescription: 'Order mixed flower arrangements in {cityName}. Colorful variety delivered fresh.',
    icon: 'bouquet',
    apiCategory: 'ao',
  },
  {
    slug: 'premium-collection',
    name: 'Premium Collection',
    title: 'Premium Collection',
    description: 'Luxury arrangements featuring the finest flowers and expert craftsmanship.',
    metaDescription: 'Order premium luxury flowers in {cityName}. Exceptional quality and design.',
    icon: 'diamond',
    apiCategory: 'bs',
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
    description: "Express your love with stunning Valentine's Day arrangements and romantic roses.",
    metaDescription: "Order Valentine's Day flowers for delivery in {cityName}. Romantic arrangements available.",
    icon: 'heart-filled',
    apiCategory: 'lr',
    timing: 'January - February',
    activeMonths: [1, 2],
    bannerColor: 'rose',
  },
  {
    slug: 'mothers-day',
    name: "Mother's Day",
    title: "Mother's Day Flowers",
    description: "Show Mom how much she means to you with beautiful Mother's Day arrangements.",
    metaDescription: "Order Mother's Day flowers for delivery in {cityName}. Celebrate Mom with fresh blooms.",
    icon: 'heart',
    apiCategory: 'md',
    timing: 'April - May',
    activeMonths: [4, 5],
    bannerColor: 'pink',
  },
  {
    slug: 'christmas',
    name: 'Christmas & Holidays',
    title: 'Holiday Flowers',
    description: 'Festive holiday arrangements featuring traditional reds, greens, and winter blooms.',
    metaDescription: 'Order Christmas and holiday flowers in {cityName}. Festive arrangements delivered.',
    icon: 'tree',
    apiCategory: 'ch',
    timing: 'November - December',
    activeMonths: [11, 12],
    bannerColor: 'forest',
  },
  {
    slug: 'seasonal-specials',
    name: 'Seasonal Specials',
    title: 'Seasonal Specials',
    description: 'Rotating selection of seasonal favorites featuring the freshest blooms available.',
    metaDescription: 'Order seasonal flower specials in {cityName}. Fresh seasonal arrangements.',
    icon: 'calendar',
    apiCategory: 'ao',
    timing: 'Year-round',
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bannerColor: 'sage',
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
