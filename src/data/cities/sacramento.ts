import { CityConfig } from '@/types/city';

export const sacramento: CityConfig = {
  cityName: 'Sacramento',
  citySlug: 'sacramento',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  primaryZipCodes: [
    '95814', '95815', '95816', '95817', '95818', '95819', '95820',
    '95821', '95822', '95823', '95824', '95825', '95826', '95827',
    '95828', '95829', '95830', '95831', '95832', '95833',
  ],
  neighborhoods: [
    'Downtown Sacramento',
    'Midtown',
    'East Sacramento',
    'Land Park',
    'Curtis Park',
    'Oak Park',
    'Tahoe Park',
    'College Glen',
    'Arden-Arcade',
    'Natomas',
    'Pocket',
    'Greenhaven',
    'South Sacramento',
    'North Sacramento',
    'Del Paso Heights',
  ],
  featuredSkus: [],
  hospitals: [
    'UC Davis Medical Center',
    'Sutter Medical Center',
    'Mercy General Hospital',
    'Kaiser Permanente Sacramento',
    'Methodist Hospital',
    'Dignity Health Sacramento',
  ],
  funeralHomes: [
    'East Lawn Memorial Park',
    'Sacramento Memorial Lawn',
    'Harry A. Nauman & Son',
  ],
  venues: [
    'California State Capitol',
    'Golden 1 Center',
    'Crocker Art Museum',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Sacramento.',
    },
    nextDay: {
      description: 'Next-day delivery available for all Sacramento addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
