import { CityConfig } from '@/types/city';

export const sanDiego: CityConfig = {
  cityName: 'San Diego',
  citySlug: 'san-diego',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  primaryZipCodes: [
    '92101', '92102', '92103', '92104', '92105', '92106', '92107',
    '92108', '92109', '92110', '92111', '92113', '92114', '92115',
    '92116', '92117', '92118', '92119', '92120', '92121',
  ],
  neighborhoods: [
    'Downtown San Diego',
    'Gaslamp Quarter',
    'La Jolla',
    'Pacific Beach',
    'Ocean Beach',
    'Mission Beach',
    'Hillcrest',
    'North Park',
    'South Park',
    'Coronado',
    'Point Loma',
    'Mission Valley',
    'Kensington',
    'University Heights',
    'Bankers Hill',
  ],
  featuredSkus: [],
  hospitals: [
    'UC San Diego Medical Center',
    'Scripps Mercy Hospital',
    'Sharp Memorial Hospital',
    'Rady Children\'s Hospital',
    'VA San Diego Healthcare System',
    'Kaiser Permanente San Diego',
  ],
  funeralHomes: [
    'Greenwood Memorial Park',
    'El Camino Memorial Park',
    'Humphrey Mortuary',
  ],
  venues: [
    'San Diego Zoo',
    'Balboa Park',
    'USS Midway Museum',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout San Diego.',
    },
    nextDay: {
      description: 'Next-day delivery available for all San Diego addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
