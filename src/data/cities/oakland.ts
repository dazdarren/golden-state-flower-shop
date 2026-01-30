import { CityConfig } from '@/types/city';

export const oakland: CityConfig = {
  cityName: 'Oakland',
  citySlug: 'oakland',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 37.8044,
    lng: -122.2712,
  },
  primaryZipCodes: [
    '94601', '94602', '94603', '94605', '94606', '94607', '94608',
    '94609', '94610', '94611', '94612', '94613', '94618', '94619',
    '94621',
  ],
  neighborhoods: [
    'Downtown Oakland',
    'Jack London Square',
    'Lake Merritt',
    'Rockridge',
    'Temescal',
    'Piedmont Avenue',
    'Grand Lake',
    'Adams Point',
    'Montclair',
    'Fruitvale',
    'Chinatown',
    'Old Oakland',
    'West Oakland',
    'East Oakland',
    'Uptown',
  ],
  featuredSkus: [],
  hospitals: [
    'Kaiser Permanente Oakland',
    'Alta Bates Summit Medical Center',
    'Highland Hospital',
    'UCSF Benioff Children\'s Hospital Oakland',
    'Alameda Health System',
  ],
  funeralHomes: [
    'Chapel of the Chimes',
    'Fouche\'s Hudson Funeral Home',
    'Sunset View Mortuary',
  ],
  venues: [
    'Oakland Museum of California',
    'Fox Theater',
    'Jack London Square',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Oakland and the East Bay.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Oakland addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
