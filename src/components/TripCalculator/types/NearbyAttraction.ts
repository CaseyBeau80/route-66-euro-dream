
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
  attractionType: "attraction" | "hidden_gem" | "drive_in" | "waypoint";
}

// Converter function to convert TripStop to NearbyAttraction
export const convertTripStopToNearbyAttraction = (tripStop: any): NearbyAttraction => {
  // Ensure attractionType is one of the allowed values
  const normalizeAttractionType = (type: string): "attraction" | "hidden_gem" | "drive_in" | "waypoint" => {
    switch (type?.toLowerCase()) {
      case 'hidden_gem':
      case 'hidden gem':
        return 'hidden_gem';
      case 'drive_in':
      case 'drive in':
        return 'drive_in';
      case 'waypoint':
        return 'waypoint';
      default:
        return 'attraction';
    }
  };

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
    attractionType: normalizeAttractionType(tripStop.category || tripStop.attractionType || 'attraction')
  };
};
