
export class CityFallbackService {
  static convertToCityNames(waypoints: Array<{lat: number, lng: number, description: string}>): string[] {
    return waypoints.map(waypoint => {
      // Extract city and state from description
      const description = waypoint.description;
      
      // Handle different description formats
      if (description.includes(' - ')) {
        return description.split(' - ')[0]; // Take the part before the dash
      }
      
      // If it's already a city, state format, return as is
      if (description.includes(', ')) {
        return description;
      }
      
      // Fallback to description as is
      return description;
    });
  }

  static getCityFallbackWaypoints(): Array<{city: string, coordinates: {lat: number, lng: number}}> {
    return [
      { city: "Chicago, IL", coordinates: { lat: 41.8781, lng: -87.6298 } },
      { city: "Springfield, IL", coordinates: { lat: 39.8003, lng: -89.6437 } },
      { city: "St. Louis, MO", coordinates: { lat: 38.7067, lng: -90.3990 } },
      { city: "Springfield, MO", coordinates: { lat: 37.2090, lng: -93.2923 } },
      { city: "Tulsa, OK", coordinates: { lat: 36.1540, lng: -95.9928 } },
      { city: "Oklahoma City, OK", coordinates: { lat: 35.4676, lng: -97.5164 } },
      { city: "Amarillo, TX", coordinates: { lat: 35.2220, lng: -101.8313 } },
      { city: "Albuquerque, NM", coordinates: { lat: 35.0844, lng: -106.6504 } },
      { city: "Flagstaff, AZ", coordinates: { lat: 35.1983, lng: -111.6513 } },
      { city: "Barstow, CA", coordinates: { lat: 34.8987, lng: -117.0178 } },
      { city: "Los Angeles, CA", coordinates: { lat: 34.0522, lng: -118.2437 } },
      { city: "Santa Monica, CA", coordinates: { lat: 34.0195, lng: -118.4912 } }
    ];
  }
}
