
import { SupabaseDataService, TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface NearbyAttraction extends TripStop {
  distanceFromCity: number;
  attractionType: 'attraction' | 'hidden_gem' | 'drive_in' | 'waypoint';
}

export class GeographicAttractionService {
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
        return [];
      }
      
      // Find the destination city coordinates
      console.log(`🔍 GeographicAttractionService: Looking for destination city coordinates...`);
      const destinationCity = allStops.find(stop => {
        const cityMatch = stop.city_name?.toLowerCase() === cityName.toLowerCase();
        const stateMatch = !state || stop.state?.toLowerCase() === state.toLowerCase();
        console.log(`🔍 Checking ${stop.city_name}, ${stop.state} against ${cityName}, ${state}: cityMatch=${cityMatch}, stateMatch=${stateMatch}`);
        return cityMatch && stateMatch;
      });
      
      if (!destinationCity) {
        console.warn(`⚠️ GeographicAttractionService: Destination city ${cityName}, ${state} not found in database`);
        console.log(`🔍 GeographicAttractionService: Available cities in database:`, 
          allStops
            .filter(stop => stop.city_name)
            .map(stop => `${stop.city_name}, ${stop.state}`)
            .slice(0, 10) // Show first 10 for debugging
        );
        return [];
      }
      
      console.log(`📍 GeographicAttractionService: Found destination city coordinates:`, {
        city: cityName,
        state: state,
        lat: destinationCity.latitude,
        lng: destinationCity.longitude,
        stopId: destinationCity.id
      });
      
      if (!destinationCity.latitude || !destinationCity.longitude) {
        console.error(`❌ GeographicAttractionService: Destination city ${cityName} has missing coordinates`);
        return [];
      }
      
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
      
      // Sort by distance and relevance
      const sortedAttractions = nearbyAttractions.sort((a, b) => {
        // Prioritize major stops and closer attractions
        const aScore = (a.is_major_stop ? -10 : 0) + a.distanceFromCity;
        const bScore = (b.is_major_stop ? -10 : 0) + b.distanceFromCity;
        return aScore - bScore;
      });
      
      console.log(`✅ GeographicAttractionService: Sorted attractions by relevance:`, 
        sortedAttractions.slice(0, 8).map(a => ({ 
          name: a.name, 
          distance: a.distanceFromCity.toFixed(1),
          category: a.category,
          isMajor: a.is_major_stop 
        }))
      );
      
      return sortedAttractions.slice(0, 8); // Limit to top 8 attractions
      
    } catch (error) {
      console.error(`❌ GeographicAttractionService: Error finding attractions near ${cityName}:`, error);
      throw error; // Re-throw to allow component to handle the error
    }
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
