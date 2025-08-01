
// Unified TripStop interface to resolve type mismatches across the application
export interface TripStop {
  id: string;
  name: string;
  description: string;
  category: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  is_major_stop?: boolean;
  is_official_destination?: boolean;
  sequence_order?: number; // Add sequence_order for Route 66 ordering
  // Add city property to satisfy destination interface
  city: string;
  // NEW: Population data for scoring
  population?: number;
  // NEW: Heritage value for heritage scoring
  heritage_value?: 'low' | 'medium' | 'high';
  // NEW: Heritage score for enhanced trip logic
  heritage_score?: number;
}

// Type guard to validate TripStop objects
export const isTripStop = (obj: any): obj is TripStop => {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.city_name === 'string' &&
    typeof obj.state === 'string' &&
    typeof obj.latitude === 'number' &&
    typeof obj.longitude === 'number' &&
    typeof obj.city === 'string'; // Add check for city property
};

// Converter function to ensure objects match TripStop interface
export const convertToTripStop = (obj: any): TripStop => {
  return {
    id: obj.id || `stop-${Math.random()}`,
    name: obj.name || 'Unknown Stop',
    description: obj.description || `Discover ${obj.name || 'this location'} along your Route 66 journey`,
    category: obj.category || 'attraction',
    city_name: obj.city_name || 'Unknown',
    city: obj.city || obj.city_name || 'Unknown', // Ensure city property is set
    state: obj.state || 'Unknown',
    latitude: obj.latitude || 0,
    longitude: obj.longitude || 0,
    image_url: obj.image_url,
    is_major_stop: obj.is_major_stop,
    is_official_destination: obj.is_official_destination,
    sequence_order: obj.sequence_order, // Include sequence_order in conversion
    population: obj.population // Include population in conversion
  };
};
