
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
    console.log(`🎯 Finding attractions near ${cityName}, ${state} within ${maxDistance} miles`);
    
    try {
      // Get all attractions from database
      const allStops = await SupabaseDataService.fetchAllStops();
      
      // Find the destination city coordinates
      const destinationCity = allStops.find(stop => 
        stop.city_name?.toLowerCase() === cityName.toLowerCase() &&
        stop.state?.toLowerCase() === state.toLowerCase()
      );
      
      if (!destinationCity) {
        console.warn(`⚠️ Destination city ${cityName}, ${state} not found in database`);
        return [];
      }
      
      console.log(`📍 Found destination city coordinates:`, {
        city: cityName,
        lat: destinationCity.latitude,
        lng: destinationCity.longitude
      });
      
      // Filter attractions within range
      const nearbyAttractions: NearbyAttraction[] = [];
      
      for (const stop of allStops) {
        // Skip if it's the destination city itself
        if (stop.id === destinationCity.id) continue;
        
        // Skip if it doesn't have valid coordinates
        if (!stop.latitude || !stop.longitude) continue;
        
        // Calculate distance
        const distance = DistanceCalculationService.calculateDistance(
          destinationCity.latitude,
          destinationCity.longitude,
          stop.latitude,
          stop.longitude
        );
        
        // Include if within range and is an attraction type
        if (distance <= maxDistance && this.isAttractionType(stop)) {
          nearbyAttractions.push({
            ...stop,
            distanceFromCity: distance,
            attractionType: this.categorizeAttraction(stop)
          });
        }
      }
      
      // Sort by distance and relevance
      const sortedAttractions = nearbyAttractions.sort((a, b) => {
        // Prioritize major stops and closer attractions
        const aScore = (a.is_major_stop ? -10 : 0) + a.distanceFromCity;
        const bScore = (b.is_major_stop ? -10 : 0) + b.distanceFromCity;
        return aScore - bScore;
      });
      
      console.log(`✅ Found ${sortedAttractions.length} attractions near ${cityName}:`, 
        sortedAttractions.map(a => ({ name: a.name, distance: a.distanceFromCity.toFixed(1) }))
      );
      
      return sortedAttractions.slice(0, 8); // Limit to top 8 attractions
      
    } catch (error) {
      console.error(`❌ Error finding attractions near ${cityName}:`, error);
      return [];
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
