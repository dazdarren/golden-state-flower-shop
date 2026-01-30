import { CityConfig } from '@/types/city';

export const irvine: CityConfig = {
  cityName: 'Irvine',
  citySlug: 'irvine',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 33.6846,
    lng: -117.8265,
  },
  primaryZipCodes: [
    '92602', '92603', '92604', '92606', '92612', '92614', '92617',
    '92618', '92620',
  ],
  neighborhoods: [
    'Irvine Spectrum',
    'University Park',
    'Turtle Rock',
    'Woodbridge',
    'Northwood',
    'Westpark',
    'Oak Creek',
    'Quail Hill',
    'Shady Canyon',
    'Portola Springs',
    'Stonegate',
    'Cypress Village',
    'Great Park',
    'Orchard Hills',
    'Tustin Ranch',
  ],
  featuredSkus: [],
  hospitals: [
    'Hoag Hospital Irvine',
    'Kaiser Permanente Irvine',
    'UC Irvine Medical Center',
    'MemorialCare Orange Coast Medical Center',
    'CHOC Children\'s Hospital',
  ],
  funeralHomes: [
    'Pacific View Memorial Park',
    'Fairhaven Memorial Park',
    'O\'Connor Mortuary',
  ],
  venues: [
    'Irvine Spectrum Center',
    'Orange County Great Park',
    'Tanaka Farms',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Irvine and Orange County.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Irvine addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
