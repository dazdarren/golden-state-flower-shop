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
    apiCategory: 'p',
    priceRange: { low: 34.99, high: 149.99 },
  },
  {
    slug: 'rose-bouquets',
    name: 'Rose Bouquets',
    title: 'Rose Bouquets',
    description: 'Rose bouquets in red, pink, white, and mixed colors. Classic elegance delivered same-day in {cityName}. From single stems to two dozen.',
    metaDescription: 'Send beautiful rose bouquets in {cityName}. Classic elegance delivered.',
    icon: 'rose',
    apiCategory: 'r',
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
  {
    slug: 'centerpieces',
    name: 'Centerpieces',
    title: 'Floral Centerpieces',
    description: 'Stunning floral centerpieces for tables and events in {cityName}. Perfect for dinner parties, weddings, and special occasions.',
    metaDescription: 'Order floral centerpieces in {cityName}. Beautiful table arrangements delivered.',
    icon: 'table',
    apiCategory: 'c',
    priceRange: { low: 49.99, high: 199.99 },
  },
  {
    slug: 'vase-arrangements',
    name: 'Vase Arrangements',
    title: 'Vase Arrangements',
    description: 'Beautiful flowers in elegant vases delivered in {cityName}. Ready to display, no additional vase needed. Perfect gifts.',
    metaDescription: 'Order vase flower arrangements in {cityName}. Elegant displays delivered ready.',
    icon: 'vase',
    apiCategory: 'v',
    priceRange: { low: 44.99, high: 179.99 },
  },
  {
    slug: 'exotic-flowers',
    name: 'Exotic Flowers',
    title: 'Exotic Flower Arrangements',
    description: 'Exotic and tropical flower arrangements in {cityName}. Orchids, birds of paradise, anthuriums, and unique blooms.',
    metaDescription: 'Order exotic tropical flowers in {cityName}. Unique and stunning arrangements.',
    icon: 'sparkles',
    apiCategory: 'x',
    priceRange: { low: 59.99, high: 249.99 },
  },
  {
    slug: 'balloons',
    name: 'Balloons',
    title: 'Balloon Bouquets',
    description: 'Festive balloon bouquets delivered in {cityName}. Birthday, congratulations, get well, and celebration balloons available.',
    metaDescription: 'Order balloon bouquets in {cityName}. Festive balloons for any celebration.',
    icon: 'balloon',
    apiCategory: 'b',
    priceRange: { low: 29.99, high: 89.99 },
  },
  {
    slug: 'one-of-a-kind',
    name: 'One of a Kind',
    title: 'One of a Kind Arrangements',
    description: 'Unique, designer-choice arrangements in {cityName}. Let our expert florists create something special with the freshest blooms.',
    metaDescription: 'Order unique florist-designed arrangements in {cityName}. One of a kind creations.',
    icon: 'star',
    apiCategory: 'o',
    priceRange: { low: 54.99, high: 199.99 },
  },
];

// ============================================================================
// FUNERAL COLLECTION - Sympathy and funeral-specific arrangements
// ============================================================================

export const FUNERAL_TYPES: CategoryConfig[] = [
  {
    slug: 'funeral-best-sellers',
    name: 'Funeral Best Sellers',
    title: 'Funeral Flower Best Sellers',
    description: 'Our most popular funeral and sympathy arrangements in {cityName}. Appropriate for services, viewings, and memorials.',
    metaDescription: 'Order popular funeral flowers in {cityName}. Tasteful sympathy arrangements.',
    icon: 'heart-outline',
    apiCategory: 'fbs',
    priceRange: { low: 69.99, high: 249.99 },
  },
  {
    slug: 'funeral-arrangements',
    name: 'Funeral Arrangements',
    title: 'Funeral Flower Arrangements',
    description: 'Traditional funeral flower arrangements delivered in {cityName}. Suitable for funeral homes, churches, and memorial services.',
    metaDescription: 'Order funeral flower arrangements in {cityName}. Traditional sympathy flowers.',
    icon: 'flower',
    apiCategory: 'fa',
    priceRange: { low: 59.99, high: 199.99 },
  },
  {
    slug: 'funeral-baskets',
    name: 'Funeral Baskets',
    title: 'Sympathy Flower Baskets',
    description: 'Sympathy flower baskets for funerals and memorials in {cityName}. Appropriate for the service or sending to the family home.',
    metaDescription: 'Order sympathy baskets in {cityName}. Comforting funeral flower baskets.',
    icon: 'basket',
    apiCategory: 'fb',
    priceRange: { low: 59.99, high: 179.99 },
  },
  {
    slug: 'funeral-sprays',
    name: 'Funeral Sprays',
    title: 'Funeral Sprays & Standing Arrangements',
    description: 'Standing funeral sprays and large arrangements in {cityName}. Impressive tributes for services and viewings.',
    metaDescription: 'Order funeral sprays in {cityName}. Standing sympathy arrangements.',
    icon: 'spray',
    apiCategory: 'fs',
    priceRange: { low: 99.99, high: 349.99 },
  },
  {
    slug: 'funeral-plants',
    name: 'Sympathy Plants',
    title: 'Sympathy Plants',
    description: 'Long-lasting sympathy plants delivered in {cityName}. Peace lilies, orchids, and green plants as lasting memorials.',
    metaDescription: 'Order sympathy plants in {cityName}. Lasting memorial plant gifts.',
    icon: 'plant',
    apiCategory: 'fp',
    priceRange: { low: 49.99, high: 149.99 },
  },
  {
    slug: 'funeral-floor-pieces',
    name: 'Floor Pieces',
    title: 'Funeral Floor Arrangements',
    description: 'Large floor-standing funeral arrangements in {cityName}. Impressive displays for funeral services and viewings.',
    metaDescription: 'Order funeral floor pieces in {cityName}. Large standing arrangements.',
    icon: 'pedestal',
    apiCategory: 'fl',
    priceRange: { low: 129.99, high: 399.99 },
  },
  {
    slug: 'funeral-wreaths',
    name: 'Funeral Wreaths',
    title: 'Funeral Wreaths',
    description: 'Traditional funeral wreaths delivered in {cityName}. Circular arrangements symbolizing eternal life and continuity.',
    metaDescription: 'Order funeral wreaths in {cityName}. Traditional circular tributes.',
    icon: 'wreath',
    apiCategory: 'fw',
    priceRange: { low: 99.99, high: 299.99 },
  },
  {
    slug: 'funeral-hearts',
    name: 'Funeral Hearts',
    title: 'Funeral Heart Arrangements',
    description: 'Heart-shaped funeral arrangements in {cityName}. Express deep love and affection with this meaningful tribute.',
    metaDescription: 'Order funeral heart arrangements in {cityName}. Heart-shaped tributes.',
    icon: 'heart-filled',
    apiCategory: 'fh',
    priceRange: { low: 149.99, high: 349.99 },
  },
  {
    slug: 'funeral-crosses',
    name: 'Funeral Crosses',
    title: 'Funeral Cross Arrangements',
    description: 'Cross-shaped funeral arrangements in {cityName}. Traditional religious tributes for Christian services.',
    metaDescription: 'Order funeral cross arrangements in {cityName}. Religious floral tributes.',
    icon: 'cross',
    apiCategory: 'fx',
    priceRange: { low: 149.99, high: 399.99 },
  },
  {
    slug: 'funeral-casket',
    name: 'Casket Sprays',
    title: 'Casket Spray Arrangements',
    description: 'Elegant casket spray arrangements in {cityName}. Designed to grace the casket during services.',
    metaDescription: 'Order casket sprays in {cityName}. Elegant casket flower arrangements.',
    icon: 'casket',
    apiCategory: 'fc',
    priceRange: { low: 149.99, high: 499.99 },
  },
  {
    slug: 'funeral-urn',
    name: 'Urn Arrangements',
    title: 'Cremation Urn Flowers',
    description: 'Flower arrangements for cremation urns in {cityName}. Appropriate displays for memorial services and celebrations of life.',
    metaDescription: 'Order urn flower arrangements in {cityName}. Cremation memorial flowers.',
    icon: 'urn',
    apiCategory: 'fu',
    priceRange: { low: 79.99, high: 199.99 },
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
    apiCategory: 'vd',
    timing: 'January - February',
    activeMonths: [1, 2],
    bannerColor: 'rose',
    priceRange: { low: 49.99, high: 299.99 },
  },
  {
    slug: 'easter',
    name: 'Easter',
    title: 'Easter Flowers',
    description: 'Easter flowers and spring arrangements in {cityName}. Lilies, tulips, and pastel bouquets perfect for Easter celebrations and springtime.',
    metaDescription: 'Order Easter flowers in {cityName}. Spring lilies and arrangements delivered.',
    icon: 'flower',
    apiCategory: 'ea',
    timing: 'March - April',
    activeMonths: [3, 4],
    bannerColor: 'lavender',
    priceRange: { low: 44.99, high: 149.99 },
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
    apiCategory: 'cm',
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
// PRICE RANGE CATEGORIES
// ============================================================================

export const PRICE_RANGES: CategoryConfig[] = [
  {
    slug: 'under-60',
    name: 'Under $60',
    title: 'Flowers Under $60',
    description: 'Beautiful flower arrangements under $60 in {cityName}. Affordable quality without compromising on freshness or design.',
    metaDescription: 'Order affordable flowers under $60 in {cityName}. Budget-friendly arrangements.',
    icon: 'dollar',
    apiCategory: 'u60',
    priceRange: { low: 29.99, high: 59.99 },
  },
  {
    slug: 'price-60-80',
    name: '$60 - $80',
    title: 'Flowers $60 to $80',
    description: 'Mid-range flower arrangements $60-$80 in {cityName}. Great value with fuller arrangements and premium blooms.',
    metaDescription: 'Order flowers $60-$80 in {cityName}. Mid-range quality arrangements.',
    icon: 'dollar',
    apiCategory: '60t80',
    priceRange: { low: 60, high: 80 },
  },
  {
    slug: 'price-80-100',
    name: '$80 - $100',
    title: 'Flowers $80 to $100',
    description: 'Premium flower arrangements $80-$100 in {cityName}. Impressive size and quality for special occasions.',
    metaDescription: 'Order premium flowers $80-$100 in {cityName}. Quality arrangements.',
    icon: 'dollar',
    apiCategory: '80t100',
    priceRange: { low: 80, high: 100 },
  },
  {
    slug: 'over-100',
    name: 'Over $100',
    title: 'Luxury Flowers Over $100',
    description: 'Luxury flower arrangements over $100 in {cityName}. Stunning displays with the finest blooms and exceptional design.',
    metaDescription: 'Order luxury flowers over $100 in {cityName}. Premium arrangements.',
    icon: 'diamond',
    apiCategory: 'a100',
    priceRange: { low: 100, high: 500 },
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

export function getFuneralTypeBySlug(slug: string): CategoryConfig | undefined {
  return FUNERAL_TYPES.find((f) => f.slug === slug);
}

export function getSeasonalBySlug(slug: string): SeasonalConfig | undefined {
  return SEASONAL.find((s) => s.slug === slug);
}

export function getPriceRangeBySlug(slug: string): CategoryConfig | undefined {
  return PRICE_RANGES.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return (
    getOccasionBySlug(slug) ||
    getProductTypeBySlug(slug) ||
    getFuneralTypeBySlug(slug) ||
    getSeasonalBySlug(slug) ||
    getPriceRangeBySlug(slug)
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
    ...FUNERAL_TYPES.map((f) => f.slug),
    ...SEASONAL.map((s) => s.slug),
    ...PRICE_RANGES.map((p) => p.slug),
  ];
}

// For navigation menus
export function getNavigationCategories() {
  return {
    occasions: OCCASIONS,
    productTypes: PRODUCT_TYPES,
    funeralTypes: FUNERAL_TYPES,
    seasonal: SEASONAL,
    priceRanges: PRICE_RANGES,
  };
}
