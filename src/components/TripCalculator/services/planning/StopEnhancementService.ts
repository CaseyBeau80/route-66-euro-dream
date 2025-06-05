
import { TripStop } from '../data/SupabaseDataService';

export class StopEnhancementService {
  /**
   * Ensure geographic diversity with destination city priority
   */
  static ensureGeographicDiversity(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[]
  ): TripStop[] {
    console.log('🌟 Enhancing stop selection for geographic diversity and destination city priority');
    
    // Separate by category with destination cities first
    const destinationCities = routeStops.filter(stop => stop.category === 'destination_city');
    const attractions = routeStops.filter(stop => stop.category === 'attraction');
    const historicSites = routeStops.filter(stop => stop.category === 'historic_site');
    const driveIns = routeStops.filter(stop => stop.category === 'drive_in_theater');
    const others = routeStops.filter(stop => 
      !['destination_city', 'attraction', 'historic_site', 'drive_in_theater'].includes(stop.category)
    );

    // Prioritize destination cities, then diversify with other types
    const enhancedStops = [
      ...destinationCities, // All destination cities
      ...attractions.slice(0, 8), // Top attractions
      ...historicSites.slice(0, 6), // Historic sites
      ...driveIns.slice(0, 4), // Drive-ins
      ...others.slice(0, 6) // Other interesting stops
    ];

    console.log(`✨ Enhanced selection: ${enhancedStops.length} stops (${destinationCities.length} destination cities)`);
    return enhancedStops;
  }
}
