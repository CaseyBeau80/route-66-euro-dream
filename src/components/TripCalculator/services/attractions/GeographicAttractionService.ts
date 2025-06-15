
import { AttractionSearchResult, AttractionSearchStatus } from './AttractionSearchResult';

export interface NearbyAttraction {
  id: string;
  name: string;
  description: string;
  type: string;
  distanceFromCity: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class GeographicAttractionService {
  static async findAttractionsNearCity(
    cityName: string,
    stateName: string,
    radiusMiles: number = 40
  ): Promise<AttractionSearchResult> {
    console.log(`🔍 GeographicAttractionService: Searching for attractions near ${cityName}, ${stateName}`);
    
    try {
      // Mock implementation for now
      const mockAttractions: NearbyAttraction[] = [
        {
          id: 'attraction-1',
          name: `${cityName} Historic District`,
          description: `Historic downtown area of ${cityName} with vintage shops and restaurants`,
          type: 'historic-site',
          distanceFromCity: 0.5
        },
        {
          id: 'attraction-2', 
          name: `Route 66 Museum`,
          description: `Local museum showcasing Route 66 history and memorabilia`,
          type: 'museum',
          distanceFromCity: 2.1
        },
        {
          id: 'attraction-3',
          name: `${cityName} Scenic Overlook`,
          description: `Beautiful viewpoint offering panoramic views of the surrounding area`,
          type: 'scenic-spot',
          distanceFromCity: 5.3
        }
      ];

      return {
        status: AttractionSearchStatus.SUCCESS,
        attractions: mockAttractions,
        message: `Found ${mockAttractions.length} attractions near ${cityName}`,
        citySearched: cityName,
        stateSearched: stateName
      };

    } catch (error) {
      console.error('❌ GeographicAttractionService error:', error);
      
      return {
        status: AttractionSearchStatus.ERROR,
        attractions: [],
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        citySearched: cityName,
        stateSearched: stateName
      };
    }
  }

  static async debugCitySearch(cityName: string, stateName: string): Promise<any> {
    console.log(`🔍 GeographicAttractionService: Debug search for ${cityName}, ${stateName}`);
    
    return {
      searchTerm: `${cityName}, ${stateName}`,
      coordinates: { lat: 35.0, lng: -105.0 }, // Mock coordinates
      radiusUsed: 40,
      searchMethod: 'mock-geographic-search'
    };
  }

  static getAttractionIcon(attraction: NearbyAttraction): string {
    const iconMap: Record<string, string> = {
      'historic-site': '🏛️',
      'museum': '🏛️',
      'scenic-spot': '🏞️',
      'restaurant': '🍽️',
      'gas-station': '⛽',
      'lodging': '🏨',
      'shopping': '🛍️',
      'entertainment': '🎭',
      'nature': '🌲'
    };
    
    return iconMap[attraction.type] || '📍';
  }

  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    const labelMap: Record<string, string> = {
      'historic-site': 'Historic Site',
      'museum': 'Museum',
      'scenic-spot': 'Scenic View',
      'restaurant': 'Restaurant',
      'gas-station': 'Gas Station',
      'lodging': 'Lodging',
      'shopping': 'Shopping',
      'entertainment': 'Entertainment',
      'nature': 'Nature'
    };
    
    return labelMap[attraction.type] || 'Attraction';
  }
}
