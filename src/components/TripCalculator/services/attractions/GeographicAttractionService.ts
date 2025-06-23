
import { AttractionSearchResult, AttractionSearchStatus } from './AttractionSearchResult';

export interface NearbyAttraction {
  id: string;
  name: string;
  description: string;
  category: string;
  attractionType?: string;
  distanceFromCity: number;
  latitude: number;
  longitude: number;
  city_name?: string;
  state?: string;
  city?: string;
  source?: 'segment_data' | 'recommended_stops' | 'geographic';
}

export class GeographicAttractionService {
  static async findAttractionsNearCity(city: string, state: string, radiusMiles: number = 25): Promise<AttractionSearchResult> {
    // Mock implementation for now
    console.log(`🔍 GeographicAttractionService: Searching for attractions near ${city}, ${state} within ${radiusMiles} miles`);
    
    try {
      const mockAttractions: NearbyAttraction[] = [
        {
          id: `geo-${city}-1`,
          name: `Historic Site near ${city}`,
          description: `A historic landmark in the ${city} area`,
          category: 'historic',
          attractionType: 'landmark',
          distanceFromCity: Math.random() * radiusMiles,
          latitude: 0,
          longitude: 0,
          city_name: city,
          state: state,
          city: city,
          source: 'geographic'
        },
        {
          id: `geo-${city}-2`,
          name: `Museum in ${city}`,
          description: `Local museum showcasing ${city} heritage`,
          category: 'museum',
          attractionType: 'cultural',
          distanceFromCity: Math.random() * radiusMiles,
          latitude: 0,
          longitude: 0,
          city_name: city,
          state: state,
          city: city,
          source: 'geographic'
        }
      ];

      return {
        status: AttractionSearchStatus.SUCCESS,
        attractions: mockAttractions,
        message: `Found ${mockAttractions.length} attractions near ${city}, ${state}`,
        citySearched: city,
        stateSearched: state
      };
    } catch (error) {
      console.error(`❌ Error searching for attractions near ${city}, ${state}:`, error);
      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        citySearched: city,
        stateSearched: state
      };
    }
  }

  static async debugCitySearch(city: string, state: string): Promise<any> {
    console.log(`🔍 Debug city search for: ${city}, ${state}`);
    
    return {
      searchTerms: { city, state },
      found: true,
      coordinates: { lat: 0, lng: 0 },
      debugInfo: `Mock debug info for ${city}, ${state}`
    };
  }

  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.category) {
      case 'historic':
      case 'landmark':
        return '🏛️';
      case 'museum':
        return '🏛️';
      case 'restaurant':
        return '🍽️';
      case 'attraction':
        return '🎯';
      case 'recommended_stop':
        return '📍';
      default:
        return '⭐';
    }
  }

  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    return attraction.attractionType || attraction.category || 'Attraction';
  }
}
