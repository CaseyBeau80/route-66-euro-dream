
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
    typeof obj.longitude === 'number';
};

// Converter function to ensure objects match TripStop interface
export const convertToTripStop = (obj: any): TripStop => {
  return {
    id: obj.id || `stop-${Math.random()}`,
    name: obj.name || 'Unknown Stop',
    description: obj.description || `Discover ${obj.name || 'this location'} along your Route 66 journey`,
    category: obj.category || 'attraction',
    city_name: obj.city_name || 'Unknown',
    state: obj.state || 'Unknown',
    latitude: obj.latitude || 0,
    longitude: obj.longitude || 0,
    image_url: obj.image_url,
    is_major_stop: obj.is_major_stop,
    is_official_destination: obj.is_official_destination
  };
};
