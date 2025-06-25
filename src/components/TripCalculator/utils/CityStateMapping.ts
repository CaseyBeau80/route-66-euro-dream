/**
 * Route 66 city to state mapping data
 */
export interface CityStateMapping {
  city: string;
  state: string;
  aliases?: string[];
  sequenceOrder?: number; // Add sequence order for proper Route 66 ordering
}

export const route66CityMappings: CityStateMapping[] = [
  // Illinois - CORRECTED sequence with Springfield, IL first
  { city: 'Chicago', state: 'IL', sequenceOrder: 1 },
  { city: 'Joliet', state: 'IL', sequenceOrder: 2 },
  { city: 'Pontiac', state: 'IL', sequenceOrder: 3 },
  { city: 'Bloomington', state: 'IL', sequenceOrder: 4 },
  { city: 'Normal', state: 'IL', sequenceOrder: 5 },
  { city: 'McLean', state: 'IL', sequenceOrder: 6 },
  { city: 'Atlanta', state: 'IL', sequenceOrder: 7 },
  { city: 'Lincoln', state: 'IL', sequenceOrder: 8 },
  { city: 'Springfield', state: 'IL', sequenceOrder: 9 }, // FIRST Springfield in Route 66
  { city: 'Williamsville', state: 'IL', sequenceOrder: 10 },
  { city: 'Sherman', state: 'IL', sequenceOrder: 11 },
  { city: 'Riverton', state: 'IL', sequenceOrder: 12 },
  { city: 'Chatham', state: 'IL', sequenceOrder: 13 },
  { city: 'Auburn', state: 'IL', sequenceOrder: 14 },
  { city: 'Thayer', state: 'IL', sequenceOrder: 15 },
  { city: 'Virden', state: 'IL', sequenceOrder: 16 },
  { city: 'Girard', state: 'IL', sequenceOrder: 17 },
  { city: 'Nilwood', state: 'IL', sequenceOrder: 18 },
  { city: 'Carlinville', state: 'IL', sequenceOrder: 19 },
  { city: 'Litchfield', state: 'IL', sequenceOrder: 20 },
  { city: 'Mount Olive', state: 'IL', sequenceOrder: 21 },
  { city: 'Staunton', state: 'IL', sequenceOrder: 22 },
  { city: 'Hamel', state: 'IL', sequenceOrder: 23 },
  { city: 'Edwardsville', state: 'IL', sequenceOrder: 24 },
  
  // Missouri - Springfield, MO comes AFTER St. Louis
  { city: 'St. Louis', state: 'MO', aliases: ['Saint Louis'], sequenceOrder: 25 },
  { city: 'Rolla', state: 'MO', sequenceOrder: 26 },
  { city: 'Springfield', state: 'MO', sequenceOrder: 27 }, // SECOND Springfield in Route 66
  { city: 'Carthage', state: 'MO', sequenceOrder: 28 },
  { city: 'Joplin', state: 'MO', sequenceOrder: 29 },
  
  // Kansas (brief stretch)
  { city: 'Galena', state: 'KS', sequenceOrder: 30 },
  { city: 'Riverton', state: 'KS', sequenceOrder: 31 },
  { city: 'Baxter Springs', state: 'KS', sequenceOrder: 32 },
  
  // Oklahoma
  { city: 'Tulsa', state: 'OK', sequenceOrder: 35 },
  { city: 'Oklahoma City', state: 'OK', sequenceOrder: 40 },
  { city: 'Sapulpa', state: 'OK', sequenceOrder: 36 },
  { city: 'Bristow', state: 'OK', sequenceOrder: 37 },
  { city: 'Depew', state: 'OK', sequenceOrder: 38 },
  { city: 'Stroud', state: 'OK', sequenceOrder: 39 },
  { city: 'Chandler', state: 'OK', sequenceOrder: 41 },
  { city: 'Arcadia', state: 'OK', sequenceOrder: 42 },
  { city: 'Edmond', state: 'OK', sequenceOrder: 43 },
  { city: 'Bethany', state: 'OK', sequenceOrder: 44 },
  { city: 'Yukon', state: 'OK', sequenceOrder: 45 },
  { city: 'El Reno', state: 'OK', sequenceOrder: 46 },
  { city: 'Hydro', state: 'OK', sequenceOrder: 47 },
  { city: 'Weatherford', state: 'OK', sequenceOrder: 48 },
  { city: 'Clinton', state: 'OK', sequenceOrder: 49 },
  { city: 'Canute', state: 'OK', sequenceOrder: 50 },
  { city: 'Elk City', state: 'OK', sequenceOrder: 51 },
  { city: 'Sayre', state: 'OK', sequenceOrder: 52 },
  { city: 'Erick', state: 'OK', sequenceOrder: 53 },
  
  // Texas
  { city: 'Shamrock', state: 'TX', sequenceOrder: 54 },
  { city: 'McLean', state: 'TX', sequenceOrder: 55 },
  { city: 'Groom', state: 'TX', sequenceOrder: 56 },
  { city: 'Amarillo', state: 'TX', sequenceOrder: 57 },
  { city: 'Vega', state: 'TX', sequenceOrder: 58 },
  { city: 'Adrian', state: 'TX', sequenceOrder: 59 },
  
  // New Mexico
  { city: 'Tucumcari', state: 'NM', sequenceOrder: 60 },
  { city: 'Santa Rosa', state: 'NM', sequenceOrder: 61 },
  { city: 'Santa Fe', state: 'NM', sequenceOrder: 62 }, // Branch route
  { city: 'Albuquerque', state: 'NM', sequenceOrder: 63 },
  { city: 'Gallup', state: 'NM', sequenceOrder: 64 },
  
  // Arizona
  { city: 'Holbrook', state: 'AZ', sequenceOrder: 65 },
  { city: 'Winslow', state: 'AZ', sequenceOrder: 66 },
  { city: 'Flagstaff', state: 'AZ', sequenceOrder: 67 },
  { city: 'Williams', state: 'AZ', sequenceOrder: 68 },
  { city: 'Seligman', state: 'AZ', sequenceOrder: 69 },
  { city: 'Kingman', state: 'AZ', sequenceOrder: 70 },
  
  // California
  { city: 'Needles', state: 'CA', sequenceOrder: 71 },
  { city: 'Barstow', state: 'CA', sequenceOrder: 72 },
  { city: 'Victorville', state: 'CA', sequenceOrder: 73 },
  { city: 'San Bernardino', state: 'CA', sequenceOrder: 74 },
  { city: 'Pasadena', state: 'CA', sequenceOrder: 75 },
  { city: 'Los Angeles', state: 'CA', sequenceOrder: 76 },
  { city: 'Santa Monica', state: 'CA', sequenceOrder: 77 }
];

// Export major Route 66 cities for quick reference
export const majorRoute66Cities = [
  'Chicago', 'Springfield', 'St. Louis', 'Tulsa', 'Oklahoma City', 
  'Amarillo', 'Albuquerque', 'Flagstaff', 'Los Angeles', 'Santa Monica'
];

// Helper function to get city by sequence order
export const getCityBySequence = (sequenceOrder: number): CityStateMapping | undefined => {
  return route66CityMappings.find(city => city.sequenceOrder === sequenceOrder);
};

// Helper function to resolve Springfield ambiguity based on sequence
export const resolveSpringfieldByContext = (previousCity?: string, nextCity?: string): 'IL' | 'MO' => {
  // If we're coming from Chicago area or going to St. Louis, it's Springfield, IL
  if (previousCity?.includes('Chicago') || previousCity?.includes('Lincoln') || nextCity?.includes('St. Louis')) {
    return 'IL';
  }
  // If we're coming from St. Louis area or going to Joplin, it's Springfield, MO
  if (previousCity?.includes('St. Louis') || previousCity?.includes('Rolla') || nextCity?.includes('Joplin')) {
    return 'MO';
  }
  // Default to IL (first Springfield on Route 66)
  return 'IL';
};
