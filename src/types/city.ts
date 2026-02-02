/**
 * City configuration type definitions
 */

export interface CityConfig {
  stateSlug: string;
  citySlug: string;
  cityName: string;
  stateName: string;
  stateAbbr: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  primaryZipCodes: string[];
  neighborhoods: string[];
  featuredSkus: string[];
  hospitals: string[];
  funeralHomes: string[];
  venues: string[];
  deliveryInfo: {
    sameDay: {
      cutoffTime: string;
      description: string;
    };
    nextDay: {
      description: string;
    };
    substitutionPolicy: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
}

export interface OccasionConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  metaDescription: string;
  skuFilter?: string[];
}

export type OccasionSlug =
  | 'birthday'
  | 'sympathy'
  | 'anniversary'
  | 'get-well'
  | 'thank-you'
  | 'love-romance'
  | 'new-baby'
  | 'just-because'
  | 'congratulations';

export type ProductTypeSlug =
  | 'plants'
  | 'rose-bouquets'
  | 'mixed-arrangements'
  | 'premium-collection'
  | 'centerpieces'
  | 'vase-arrangements'
  | 'exotic-flowers'
  | 'balloons'
  | 'one-of-a-kind';

export type FuneralTypeSlug =
  | 'funeral-best-sellers'
  | 'funeral-arrangements'
  | 'funeral-baskets'
  | 'funeral-sprays'
  | 'funeral-plants'
  | 'funeral-floor-pieces'
  | 'funeral-wreaths'
  | 'funeral-hearts'
  | 'funeral-crosses'
  | 'funeral-casket'
  | 'funeral-urn';

export type SeasonalSlug =
  | 'valentines-day'
  | 'easter'
  | 'mothers-day'
  | 'christmas'
  | 'seasonal-specials';

export type PriceRangeSlug =
  | 'under-60'
  | 'price-60-80'
  | 'price-80-100'
  | 'over-100';

export const OCCASIONS: Record<OccasionSlug, OccasionConfig> = {
  birthday: {
    slug: 'birthday',
    name: 'Birthday',
    title: 'Birthday Flowers',
    description: 'Celebrate their special day with a beautiful birthday flower arrangement.',
    metaDescription: 'Order birthday flowers for delivery in {cityName}. Same-day delivery available.',
  },
  sympathy: {
    slug: 'sympathy',
    name: 'Sympathy',
    title: 'Sympathy Flowers',
    description: 'Express your condolences with thoughtful sympathy flowers and arrangements.',
    metaDescription: 'Send sympathy flowers and funeral arrangements in {cityName}. Express delivery available.',
  },
  anniversary: {
    slug: 'anniversary',
    name: 'Anniversary',
    title: 'Anniversary Flowers',
    description: 'Mark your milestone with romantic anniversary flower arrangements.',
    metaDescription: 'Order anniversary flowers for delivery in {cityName}. Romantic arrangements available.',
  },
  'get-well': {
    slug: 'get-well',
    name: 'Get Well',
    title: 'Get Well Flowers',
    description: 'Brighten their recovery with cheerful get well flower arrangements.',
    metaDescription: 'Send get well flowers to hospitals and homes in {cityName}. Same-day delivery.',
  },
  'thank-you': {
    slug: 'thank-you',
    name: 'Thank You',
    title: 'Thank You Flowers',
    description: 'Show your appreciation with beautiful thank you flower arrangements.',
    metaDescription: 'Send thank you flowers in {cityName}. Express your gratitude with same-day delivery.',
  },
  'love-romance': {
    slug: 'love-romance',
    name: 'Love & Romance',
    title: 'Romantic Flowers',
    description: 'Express your love with stunning romantic flower arrangements.',
    metaDescription: 'Send romantic flowers for delivery in {cityName}. Perfect for expressing love.',
  },
  'new-baby': {
    slug: 'new-baby',
    name: 'New Baby',
    title: 'New Baby Flowers',
    description: 'Welcome the newest arrival with cheerful baby flower arrangements.',
    metaDescription: 'Order new baby flowers for delivery in {cityName}. Celebrate the new arrival.',
  },
  'just-because': {
    slug: 'just-because',
    name: 'Just Because',
    title: 'Just Because Flowers',
    description: 'Brighten their day with beautiful flowers, just because.',
    metaDescription: 'Send just because flowers in {cityName}. No occasion needed to show you care.',
  },
  'congratulations': {
    slug: 'congratulations',
    name: 'Congratulations',
    title: 'Congratulations Flowers',
    description: 'Celebrate their achievements with vibrant congratulations arrangements.',
    metaDescription: 'Order congratulations flowers for delivery in {cityName}. Celebrate their success.',
  },
};
