
export interface NearbyAttraction {
  id: string;
  name: string;
  description?: string;
  category?: string;
  city_name?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  distanceFromCity: number;
  attractionType: string;
}

// Converter function to convert TripStop to NearbyAttraction
export const convertTripStopToNearbyAttraction = (tripStop: any): NearbyAttraction => {
  return {
    id: tripStop.id || `attraction-${Math.random()}`,
    name: tripStop.name || 'Unknown Attraction',
    description: tripStop.description,
    category: tripStop.category,
    city_name: tripStop.city_name || tripStop.city,
    city: tripStop.city || tripStop.city_name,
    state: tripStop.state,
    latitude: tripStop.latitude,
    longitude: tripStop.longitude,
    distanceFromCity: 0, // Default value
    attractionType: tripStop.category || 'attraction'
  };
};
