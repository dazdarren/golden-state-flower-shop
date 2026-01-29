import { CityConfig } from '@/types/city';

export const palmSprings: CityConfig = {
  cityName: 'Palm Springs',
  citySlug: 'palm-springs',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  primaryZipCodes: [
    '92262', '92263', '92264',
  ],
  neighborhoods: [
    'Downtown Palm Springs',
    'Uptown Design District',
    'Movie Colony',
    'Vista Las Palmas',
    'Twin Palms',
    'Deepwell Estates',
    'Tahquitz River Estates',
    'Warm Sands',
    'Cathedral City',
    'Rancho Mirage',
    'Palm Desert',
    'Indian Wells',
    'La Quinta',
    'Desert Hot Springs',
  ],
  featuredSkus: [],
  hospitals: [
    'Desert Regional Medical Center',
    'Eisenhower Health',
    'JFK Memorial Hospital',
    'Desert Care Network',
  ],
  funeralHomes: [
    'Forest Lawn Cathedral City',
    'Wiefels & Son Funeral Home',
    'Palm Springs Mortuary',
  ],
  venues: [
    'Palm Springs Aerial Tramway',
    'Palm Springs Art Museum',
    'Moorten Botanical Garden',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '1:00 PM',
      description: 'Order by 1:00 PM for same-day delivery throughout the Coachella Valley.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Palm Springs area addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
