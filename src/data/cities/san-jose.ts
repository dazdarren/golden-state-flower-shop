import { CityConfig } from '@/types/city';

export const sanJose: CityConfig = {
  cityName: 'San Jose',
  citySlug: 'san-jose',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 37.3382,
    lng: -121.8863,
  },
  primaryZipCodes: [
    '95110', '95111', '95112', '95113', '95116', '95117', '95118',
    '95119', '95120', '95121', '95122', '95123', '95124', '95125',
    '95126', '95127', '95128', '95129', '95130', '95131',
  ],
  neighborhoods: [
    'Downtown San Jose',
    'Willow Glen',
    'Rose Garden',
    'Japantown',
    'Santana Row',
    'Almaden Valley',
    'Cambrian',
    'Evergreen',
    'Berryessa',
    'Silver Creek',
    'Blossom Valley',
    'West San Jose',
    'North San Jose',
    'East San Jose',
    'South San Jose',
  ],
  featuredSkus: [],
  hospitals: [
    'Santa Clara Valley Medical Center',
    'Regional Medical Center',
    'Good Samaritan Hospital',
    'Kaiser Permanente San Jose',
    'O\'Connor Hospital',
    'El Camino Hospital',
  ],
  funeralHomes: [
    'Oak Hill Memorial Park',
    'Lima Family Mortuary',
    'Darling Fischer Garden Chapel',
  ],
  venues: [
    'SAP Center',
    'Tech Museum of Innovation',
    'San Jose Museum of Art',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout San Jose and Silicon Valley.',
    },
    nextDay: {
      description: 'Next-day delivery available for all San Jose addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
