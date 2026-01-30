import { CityConfig } from '@/types/city';

export const fresno: CityConfig = {
  cityName: 'Fresno',
  citySlug: 'fresno',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 36.7378,
    lng: -119.7871,
  },
  primaryZipCodes: [
    '93701', '93702', '93703', '93704', '93705', '93706', '93710',
    '93711', '93720', '93721', '93722', '93723', '93726', '93727',
    '93728', '93729', '93730',
  ],
  neighborhoods: [
    'Downtown Fresno',
    'Tower District',
    'Woodward Park',
    'Fig Garden',
    'Sunnyside',
    'Clovis',
    'Old Fig Garden',
    'Hoover',
    'McLane',
    'Bullard',
    'Northwest Fresno',
    'Northeast Fresno',
    'Southeast Fresno',
    'Southwest Fresno',
    'Central Fresno',
  ],
  featuredSkus: [],
  hospitals: [
    'Community Regional Medical Center',
    'Saint Agnes Medical Center',
    'Kaiser Permanente Fresno',
    'Clovis Community Medical Center',
    'Valley Children\'s Hospital',
    'Fresno Heart & Surgical Hospital',
  ],
  funeralHomes: [
    'Whitehurst Sullivan Burns & Blair',
    'Yost & Webb Mortuary',
    'Stephens & Bean Chapel',
  ],
  venues: [
    'Fresno Chaffee Zoo',
    'Forestiere Underground Gardens',
    'Woodward Park',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Fresno.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Fresno addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
