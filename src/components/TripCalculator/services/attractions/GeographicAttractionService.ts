
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
  static async findAttractionsNearCity(city: string, state: string, radiusMiles: number = 25): Promise<{
    attractions: NearbyAttraction[];
    totalFound: number;
  }> {
    // Mock implementation for now
    console.log(`🔍 GeographicAttractionService: Searching for attractions near ${city}, ${state} within ${radiusMiles} miles`);
    
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
      attractions: mockAttractions,
      totalFound: mockAttractions.length
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
