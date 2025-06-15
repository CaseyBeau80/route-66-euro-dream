

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

export interface AttractionSearchResult {
  status: string;
  attractions: NearbyAttraction[];
  message: string;
  citySearched: string;
  stateSearched: string;
}

export class GeographicAttractionService {
  static async getAttractionsNearCity(cityName: string): Promise<NearbyAttraction[]> {
    // Implementation would go here
    console.log(`Getting attractions near ${cityName}`);
    return [];
  }

  static async findAttractionsNearCity(cityName: string, state: string, radiusMiles: number): Promise<AttractionSearchResult> {
    console.log(`Finding attractions near ${cityName}, ${state} within ${radiusMiles} miles`);
    
    // Mock implementation for now
    return {
      status: 'SUCCESS',
      attractions: [
        {
          id: `attraction-${Math.random()}`,
          name: `Sample Attraction near ${cityName}`,
          description: `A great attraction in ${cityName}, ${state}`,
          category: 'attraction',
          city_name: cityName,
          city: cityName,
          state: state,
          latitude: 35.0,
          longitude: -101.0,
          distanceFromCity: Math.random() * radiusMiles,
          attractionType: 'attraction'
        }
      ],
      message: `Found attractions near ${cityName}`,
      citySearched: cityName,
      stateSearched: state
    };
  }

  static async debugCitySearch(cityName: string, state: string): Promise<any> {
    console.log(`Debugging city search for ${cityName}, ${state}`);
    
    return {
      cityName,
      state,
      searchAttempted: true,
      debug: `Debug info for ${cityName}, ${state}`,
      timestamp: new Date().toISOString()
    };
  }

  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'hidden_gem':
        return '💎';
      case 'drive_in':
        return '🎬';
      case 'waypoint':
        return '📍';
      default:
        return '🎯';
    }
  }

  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'hidden_gem':
        return 'Hidden Gem';
      case 'drive_in':
        return 'Drive-In';
      case 'waypoint':
        return 'Waypoint';
      default:
        return 'Attraction';
    }
  }
}

