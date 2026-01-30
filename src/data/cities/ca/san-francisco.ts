import { CityConfig } from '@/types/city';

/**
 * San Francisco city configuration
 */
export const sanFranciscoConfig: CityConfig = {
  stateSlug: 'ca',
  citySlug: 'san-francisco',
  cityName: 'San Francisco',
  stateName: 'California',
  stateAbbr: 'CA',
  coordinates: {
    lat: 37.7749,
    lng: -122.4194,
  },

  primaryZipCodes: [
    '94102', // Civic Center / Tenderloin
    '94103', // SoMa
    '94107', // SoMa / South Beach
    '94109', // Russian Hill / Nob Hill
    '94110', // Mission
    '94114', // Castro
    '94115', // Western Addition
    '94116', // Parkside
    '94117', // Haight-Ashbury
    '94118', // Inner Richmond
    '94121', // Outer Richmond
    '94122', // Sunset
    '94123', // Marina
    '94124', // Bayview
    '94127', // St. Francis Wood
    '94131', // Twin Peaks
    '94132', // Lake Merced
    '94133', // North Beach / Chinatown
  ],

  neighborhoods: [
    'Mission',
    'SoMa',
    'Hayes Valley',
    'Richmond',
    'Sunset',
    'North Beach',
    'Nob Hill',
    'Marina',
    'Noe Valley',
    'Castro',
    'Pacific Heights',
    'Russian Hill',
    'Chinatown',
    'Financial District',
    'Haight-Ashbury',
  ],

  // Placeholder SKUs - replace with real Florist One SKUs when available
  // These are organized by general category for easier filtering
  featuredSkus: [
    // Mixed arrangements (6)
    'FTD-MIX001',
    'FTD-MIX002',
    'FTD-MIX003',
    'FTD-MIX004',
    'FTD-MIX005',
    'FTD-MIX006',
    // Roses (6)
    'FTD-ROSE001',
    'FTD-ROSE002',
    'FTD-ROSE003',
    'FTD-ROSE004',
    'FTD-ROSE005',
    'FTD-ROSE006',
    // Plants (4)
    'FTD-PLT001',
    'FTD-PLT002',
    'FTD-PLT003',
    'FTD-PLT004',
    // Sympathy (4)
    'FTD-SYM001',
    'FTD-SYM002',
    'FTD-SYM003',
    'FTD-SYM004',
    // Seasonal/Other (4)
    'FTD-SEA001',
    'FTD-SEA002',
    'FTD-SEA003',
    'FTD-SEA004',
  ],

  hospitals: [
    'UCSF Medical Center',
    'Zuckerberg San Francisco General Hospital',
    'California Pacific Medical Center',
    'Kaiser Permanente San Francisco',
    'St. Mary\'s Medical Center',
    'Chinese Hospital',
    'San Francisco VA Medical Center',
  ],

  funeralHomes: [
    'Duggan\'s Serra Mortuary',
    'Halsted N. Gray-Carew & English',
    'Green Street Mortuary',
    'Sullivan\'s Funeral Home',
    'Driscoll\'s Valencia St. Serra Mortuary',
    'Cathay Mortuary',
  ],

  venues: [
    'City Hall',
    'The Palace of Fine Arts',
    'The Presidio',
    'Golden Gate Park',
    'Ferry Building',
    'Conservatory of Flowers',
    'The Fairmont San Francisco',
    'St. Regis San Francisco',
  ],

  deliveryInfo: {
    sameDay: {
      cutoffTime: '2:00 PM PST',
      description: 'Order by 2:00 PM PST for same-day delivery to San Francisco addresses.',
    },
    nextDay: {
      description: 'Orders placed after 2:00 PM PST will be delivered the next business day.',
    },
    substitutionPolicy: 'If any item in your arrangement is unavailable, we may substitute with a similar item of equal or greater value to ensure timely delivery.',
  },
};

export default sanFranciscoConfig;
