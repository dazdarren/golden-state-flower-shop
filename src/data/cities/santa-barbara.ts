import { CityConfig } from '@/types/city';

export const santaBarbara: CityConfig = {
  cityName: 'Santa Barbara',
  citySlug: 'santa-barbara',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  primaryZipCodes: [
    '93101', '93102', '93103', '93105', '93106', '93108', '93109',
    '93110', '93111', '93117',
  ],
  neighborhoods: [
    'Downtown Santa Barbara',
    'State Street',
    'Funk Zone',
    'Montecito',
    'Hope Ranch',
    'Mesa',
    'Riviera',
    'San Roque',
    'Samarkand',
    'Mission Canyon',
    'East Beach',
    'West Beach',
    'Goleta',
    'Isla Vista',
    'Summerland',
  ],
  featuredSkus: [],
  hospitals: [
    'Santa Barbara Cottage Hospital',
    'Goleta Valley Cottage Hospital',
    'Santa Barbara County Psychiatric Health',
    'Sansum Clinic',
    'Ridley-Tree Cancer Center',
  ],
  funeralHomes: [
    'McDermott-Crockett Mortuary',
    'Welch-Ryce-Haider Funeral Chapels',
    'Santa Barbara Cemetery',
  ],
  venues: [
    'Santa Barbara Mission',
    'Stearns Wharf',
    'Santa Barbara Botanic Garden',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '1:00 PM',
      description: 'Order by 1:00 PM for same-day delivery throughout Santa Barbara.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Santa Barbara addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
