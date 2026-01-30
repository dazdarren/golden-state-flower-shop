import { CityConfig } from '@/types/city';

export const losAngeles: CityConfig = {
  cityName: 'Los Angeles',
  citySlug: 'los-angeles',
  stateSlug: 'ca',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 34.0522,
    lng: -118.2437,
  },
  primaryZipCodes: [
    '90001', '90012', '90015', '90017', '90024', '90028', '90034',
    '90036', '90045', '90048', '90049', '90064', '90066', '90067',
    '90068', '90069', '90071', '90077', '90210', '90212',
  ],
  neighborhoods: [
    'Downtown LA',
    'Hollywood',
    'Beverly Hills',
    'Santa Monica',
    'West Hollywood',
    'Silver Lake',
    'Echo Park',
    'Los Feliz',
    'Brentwood',
    'Century City',
    'Westwood',
    'Venice',
    'Culver City',
    'Koreatown',
    'Mid-Wilshire',
  ],
  featuredSkus: [],
  hospitals: [
    'Cedars-Sinai Medical Center',
    'UCLA Medical Center',
    'Keck Hospital of USC',
    'Good Samaritan Hospital',
    'California Hospital Medical Center',
    'Providence Saint John\'s Health Center',
  ],
  funeralHomes: [
    'Forest Lawn Memorial Park',
    'Hollywood Forever Cemetery',
    'Pierce Brothers Westwood Village',
  ],
  venues: [
    'The Getty Center',
    'Walt Disney Concert Hall',
    'Griffith Observatory',
  ],
  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM',
      description: 'Order by 2:00 PM for same-day delivery throughout Los Angeles.',
    },
    nextDay: {
      description: 'Next-day delivery available for all LA addresses.',
    },
    substitutionPolicy:
      'If specific flowers are unavailable, our florists will substitute with flowers of equal or greater value while maintaining the arrangement\'s style and color palette.',
  },
};
