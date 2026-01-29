import { CityConfig } from '@/types/city';

export const longBeach: CityConfig = {
  cityName: 'Long Beach',
  citySlug: 'long-beach',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  primaryZipCodes: [
    '90801', '90802', '90803', '90804', '90805', '90806', '90807',
    '90808', '90810', '90813', '90814', '90815', '90822',
  ],
  neighborhoods: [
    'Downtown Long Beach',
    'Belmont Shore',
    'Naples',
    'Alamitos Beach',
    'Bixby Knolls',
    'California Heights',
    'Signal Hill',
    'Lakewood Village',
    'Los Altos',
    'El Dorado Park',
    'Belmont Heights',
    'Rose Park',
    'Wrigley',
    'North Long Beach',
    'East Long Beach',
  ],
  featuredSkus: [],
  hospitals: [
    'Long Beach Memorial Medical Center',
    'St. Mary Medical Center',
    'VA Long Beach Healthcare System',
    'Long Beach Medical Center',
    'College Medical Center',
    'Miller Children\'s Hospital',
  ],
  funeralHomes: [
    'Forest Lawn Long Beach',
    'Sunnyside Mortuary',
    'McKenzie Mortuary',
  ],
  venues: [
    'Aquarium of the Pacific',
    'Queen Mary',
    'Long Beach Convention Center',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Long Beach.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Long Beach addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
