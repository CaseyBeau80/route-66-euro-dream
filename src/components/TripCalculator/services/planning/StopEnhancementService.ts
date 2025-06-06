
import { TripStop } from '../data/SupabaseDataService';

export class StopEnhancementService {
  /**
   * Enhance stops with prioritization for trip planning
   */
  static enhanceStopsWithPrioritization(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log('🌟 Enhancing stops with prioritization for trip planning');
    
    // Filter out start and end stops from consideration
    const routeStops = allStops.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );

    // Apply geographic diversity enhancement
    const enhancedStops = this.ensureGeographicDiversity(
      startStop,
      endStop,
      routeStops
    );

    // Limit stops based on trip duration
    const maxStops = Math.min(totalDays * 3, enhancedStops.length);
    const prioritizedStops = enhancedStops.slice(0, maxStops);

    console.log(`✨ Enhanced selection: ${prioritizedStops.length} stops for ${totalDays}-day trip`);
    return prioritizedStops;
  }

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
