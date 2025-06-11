import { SupabaseDataService, TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface NearbyAttraction extends TripStop {
  distanceFromCity: number;
  attractionType: 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint';
}

export class GeographicAttractionService {
  // Enhanced coordinate fallback lookup for Route 66 cities
  private static readonly ROUTE66_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
    // Missouri
    'Joplin': { lat: 37.0842, lng: -94.5133 },
    'Joplin, MO': { lat: 37.0842, lng: -94.5133 },
    'Carthage': { lat: 37.1745, lng: -94.3102 },
    'Springfield': { lat: 37.2153, lng: -93.2982 },
    'Springfield, MO': { lat: 37.2153, lng: -93.2982 },
    'Lebanon': { lat: 37.6806, lng: -92.6635 },
    'Rolla': { lat: 37.9514, lng: -91.7718 },
    'Cuba': { lat: 38.0648, lng: -91.4040 },
    'St. Louis': { lat: 38.6270, lng: -90.1994 },
    
    // Oklahoma
    'Tulsa': { lat: 36.1540, lng: -95.9928 },
    'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
    'Elk City': { lat: 35.4117, lng: -99.4043 },
    
    // Texas
    'Amarillo': { lat: 35.2220, lng: -101.8313 },
    'Shamrock': { lat: 35.2098, lng: -100.2465 },
    
    // New Mexico
    'Tucumcari': { lat: 35.1717, lng: -103.7253 },
    'Santa Rosa': { lat: 34.9381, lng: -104.6819 },
    'Albuquerque': { lat: 35.0844, lng: -106.6504 },
    'Gallup': { lat: 35.5281, lng: -108.7426 },
    
    // Arizona
    'Flagstaff': { lat: 35.1983, lng: -111.6513 },
    'Winslow': { lat: 35.0242, lng: -110.7073 },
    'Kingman': { lat: 35.1895, lng: -114.0530 },
    
    // California
    'Needles': { lat: 34.8481, lng: -114.6144 },
    'Barstow': { lat: 34.8958, lng: -117.0228 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Santa Monica': { lat: 34.0195, lng: -118.4912 }
  };

  /**
   * Find attractions near a destination city
   */
  static async findAttractionsNearCity(
    cityName: string,
    state: string,
    maxDistance: number = 50 // miles
  ): Promise<NearbyAttraction[]> {
    console.log(`🎯 GeographicAttractionService: Finding attractions near ${cityName}, ${state} within ${maxDistance} miles`);
    
    try {
      // Get all attractions from database
      console.log(`📊 GeographicAttractionService: Fetching all stops from database...`);
      const allStops = await SupabaseDataService.fetchAllStops();
      console.log(`📊 GeographicAttractionService: Retrieved ${allStops.length} total stops from database`);
      
      if (!allStops || allStops.length === 0) {
        console.warn(`⚠️ GeographicAttractionService: No stops data available from database`);
        return this.generateMockAttractions(cityName, state);
      }
      
      // Find the destination city coordinates
      console.log(`🔍 GeographicAttractionService: Looking for destination city coordinates...`);
      let destinationCity = allStops.find(stop => {
        const cityMatch = stop.city_name?.toLowerCase() === cityName.toLowerCase();
        const stateMatch = !state || stop.state?.toLowerCase() === state.toLowerCase();
        return cityMatch && stateMatch;
      });
      
      // Fallback coordinate lookup if not found in database
      if (!destinationCity || !destinationCity.latitude || !destinationCity.longitude) {
        console.log(`🔍 GeographicAttractionService: City not found in database, using fallback coordinates`);
        const coordinates = this.getFallbackCoordinates(cityName, state);
        if (coordinates) {
          destinationCity = {
            id: `fallback-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
            name: `${cityName}${state ? `, ${state}` : ''}`,
            city_name: cityName,
            state: state,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            category: 'destination_city',
            description: `Route 66 destination city`,
            is_major_stop: true
          } as TripStop;
        }
      }
      
      if (!destinationCity || !destinationCity.latitude || !destinationCity.longitude) {
        console.warn(`⚠️ GeographicAttractionService: No coordinates found for ${cityName}, ${state}`);
        return this.generateMockAttractions(cityName, state);
      }
      
      console.log(`📍 GeographicAttractionService: Found destination city coordinates:`, {
        city: cityName,
        state: state,
        lat: destinationCity.latitude,
        lng: destinationCity.longitude
      });
      
      // Filter attractions within range
      console.log(`🔍 GeographicAttractionService: Filtering attractions within ${maxDistance} miles...`);
      const nearbyAttractions: NearbyAttraction[] = [];
      
      for (const stop of allStops) {
        // Skip if it's the destination city itself
        if (stop.id === destinationCity.id) continue;
        
        // Skip if it doesn't have valid coordinates
        if (!stop.latitude || !stop.longitude) continue;
        
        // Skip if it's not an attraction type
        if (!this.isAttractionType(stop)) continue;
        
        // Calculate distance
        const distance = DistanceCalculationService.calculateDistance(
          destinationCity.latitude,
          destinationCity.longitude,
          stop.latitude,
          stop.longitude
        );
        
        // Include if within range
        if (distance <= maxDistance) {
          nearbyAttractions.push({
            ...stop,
            distanceFromCity: distance,
            attractionType: this.categorizeAttraction(stop)
          });
        }
      }
      
      console.log(`📊 GeographicAttractionService: Found ${nearbyAttractions.length} attractions within ${maxDistance} miles`);
      
      // If no attractions found in database, return mock attractions
      if (nearbyAttractions.length === 0) {
        console.log(`🎭 GeographicAttractionService: No database attractions found, generating mock attractions`);
        return this.generateMockAttractions(cityName, state);
      }
      
      // Sort by distance and relevance
      const sortedAttractions = nearbyAttractions.sort((a, b) => {
        const aScore = (a.is_major_stop ? -10 : 0) + a.distanceFromCity;
        const bScore = (b.is_major_stop ? -10 : 0) + b.distanceFromCity;
        return aScore - bScore;
      });
      
      return sortedAttractions.slice(0, 8); // Limit to top 8 attractions
      
    } catch (error) {
      console.error(`❌ GeographicAttractionService: Error finding attractions near ${cityName}:`, error);
      return this.generateMockAttractions(cityName, state);
    }
  }
  
  /**
   * Get fallback coordinates for Route 66 cities
   */
  private static getFallbackCoordinates(cityName: string, state: string): { lat: number; lng: number } | null {
    const cityKey = `${cityName}${state ? `, ${state}` : ''}`;
    let coordinates = this.ROUTE66_COORDINATES[cityKey];
    
    if (!coordinates) {
      // Try just city name
      coordinates = this.ROUTE66_COORDINATES[cityName];
    }
    
    if (!coordinates) {
      // Try case-insensitive match
      const matchingKey = Object.keys(this.ROUTE66_COORDINATES).find(key => 
        key.toLowerCase().includes(cityName.toLowerCase())
      );
      if (matchingKey) {
        coordinates = this.ROUTE66_COORDINATES[matchingKey];
      }
    }
    
    console.log(`🗺️ GeographicAttractionService: Fallback coordinates for ${cityName}:`, coordinates);
    return coordinates || null;
  }
  
  /**
   * Generate mock attractions when database is unavailable
   */
  private static generateMockAttractions(cityName: string, state: string): NearbyAttraction[] {
    console.log(`🎭 GeographicAttractionService: Generating mock attractions for ${cityName}, ${state}`);
    
    const mockAttractions: NearbyAttraction[] = [
      {
        id: `mock-${cityName}-1`,
        name: `Historic Downtown ${cityName}`,
        description: `Explore the historic downtown area with vintage shops and classic Route 66 architecture`,
        category: 'historic_site',
        city_name: cityName,
        state: state,
        latitude: 0,
        longitude: 0,
        is_major_stop: true,
        distanceFromCity: 1.2,
        attractionType: 'attraction'
      },
      {
        id: `mock-${cityName}-2`,
        name: `${cityName} Route 66 Museum`,
        description: `Local museum showcasing Route 66 history and memorabilia`,
        category: 'museum',
        city_name: cityName,
        state: state,
        latitude: 0,
        longitude: 0,
        is_major_stop: false,
        distanceFromCity: 0.8,
        attractionType: 'attraction'
      },
      {
        id: `mock-${cityName}-3`,
        name: `Classic Diner`,
        description: `Authentic 1950s-style diner serving classic American fare`,
        category: 'restaurant',
        city_name: cityName,
        state: state,
        latitude: 0,
        longitude: 0,
        is_major_stop: false,
        distanceFromCity: 2.1,
        attractionType: 'hidden_gem'
      },
      {
        id: `mock-${cityName}-4`,
        name: `Roadside Trading Post`,
        description: `Vintage trading post with Native American crafts and Route 66 souvenirs`,
        category: 'roadside_attraction',
        city_name: cityName,
        state: state,
        latitude: 0,
        longitude: 0,
        is_major_stop: false,
        distanceFromCity: 3.7,
        attractionType: 'hidden_gem'
      }
    ];
    
    return mockAttractions;
  }
  
  /**
   * Check if a stop is an attraction type
   */
  private static isAttractionType(stop: TripStop): boolean {
    const attractionCategories = [
      'attraction',
      'historic_site',
      'restaurant',
      'lodging',
      'museum',
      'park',
      'scenic_view',
      'roadside_attraction',
      'drive_in'
    ];
    
    return attractionCategories.includes(stop.category);
  }
  
  /**
   * Categorize attraction by type
   */
  private static categorizeAttraction(stop: TripStop): 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint' {
    if (stop.category === 'drive_in') return 'drive_in';
    if (stop.category === 'roadside_attraction' || stop.is_major_stop) return 'attraction';
    return 'hidden_gem';
  }
  
  /**
   * Get attraction icon based on category
   */
  static getAttractionIcon(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return '🎬';
      case 'attraction': return '🏛️';
      case 'hidden_gem': return '💎';
      case 'waypoint': return '📍';
      default: return '🎯';
    }
  }
  
  /**
   * Get attraction type label
   */
  static getAttractionTypeLabel(attraction: NearbyAttraction): string {
    switch (attraction.attractionType) {
      case 'drive_in': return 'Drive-In Theater';
      case 'attraction': return 'Major Attraction';
      case 'hidden_gem': return 'Hidden Gem';
      case 'waypoint': return 'Route 66 Waypoint';
      default: return 'Attraction';
    }
  }
}
