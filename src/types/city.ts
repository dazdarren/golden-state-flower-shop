/**
 * City configuration type definitions
 */

export interface CityConfig {
  stateSlug: string;
  citySlug: string;
  cityName: string;
  stateName: string;
  stateAbbr: string;
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

export type OccasionSlug = 'birthday' | 'sympathy' | 'anniversary' | 'get-well' | 'thank-you';

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
};
