
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  /**
   * Filter stops by route geography with much more lenient criteria
   */
  static filterStopsByRouteGeography(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    if (!segment?.endCity || !allStops?.length) {
      console.log('🌍 [GEOGRAPHY-FILTER] Invalid input for geographic filtering');
      return [];
    }

    const endCity = segment.endCity.toLowerCase();
    console.log(`🌍 [GEOGRAPHY-FILTER] Filtering ${allStops.length} stops for destination: ${endCity}`);

    // MUCH MORE LENIENT: Try multiple strategies and combine results
    const strategies = [
      // Strategy 1: Exact city match
      () => this.filterByExactCity(allStops, endCity),
      
      // Strategy 2: State-based filtering (much more lenient)
      () => this.filterByStateVeryLenient(allStops, segment),
      
      // Strategy 3: Get all featured and major stops regardless of location
      () => this.filterByQualityOnly(allStops),
      
      // Strategy 4: Get stops by category priority
      () => this.filterByCategory(allStops)
    ];

    const allFilteredStops = new Set<TripStop>();

    // Combine results from all strategies
    for (let i = 0; i < strategies.length; i++) {
      const filtered = strategies[i]();
      console.log(`🌍 [GEOGRAPHY-FILTER] Strategy ${i + 1} result: ${filtered.length} stops`);
      
      filtered.forEach(stop => allFilteredStops.add(stop));
      
      // If we have enough variety, we can stop
      if (allFilteredStops.size >= 15) break;
    }

    const finalStops = Array.from(allFilteredStops);
    console.log(`✅ [GEOGRAPHY-FILTER] Combined result: ${finalStops.length} stops from all strategies`);
    
    // If still no results, return all stops as ultimate fallback
    if (finalStops.length === 0) {
      console.log('⚠️ [GEOGRAPHY-FILTER] No filtered results, returning all stops as fallback');
      return allStops.slice(0, 20);
    }

    return finalStops;
  }

  /**
   * Filter by exact city match
   */
  private static filterByExactCity(stops: TripStop[], endCity: string): TripStop[] {
    return stops.filter(stop => {
      const cityMatch = stop.city_name?.toLowerCase().includes(endCity) || 
                      stop.city?.toLowerCase().includes(endCity) ||
                      stop.name?.toLowerCase().includes(endCity);
      return cityMatch;
    });
  }

  /**
   * Very lenient state-based filtering
   */
  private static filterByStateVeryLenient(stops: TripStop[], segment: DailySegment): TripStop[] {
    const stateMap: Record<string, string[]> = {
      'illinois': ['illinois', 'il'],
      'missouri': ['missouri', 'mo'], 
      'kansas': ['kansas', 'ks'],
      'oklahoma': ['oklahoma', 'ok'],
      'texas': ['texas', 'tx'],
      'new mexico': ['new mexico', 'nm'],
      'arizona': ['arizona', 'az'],
      'california': ['california', 'ca']
    };

    const endCity = segment.endCity.toLowerCase();
    
    // Find target states (be very inclusive)
    const targetStates = new Set<string>();
    
    Object.entries(stateMap).forEach(([state, abbreviations]) => {
      // Check if end city name contains state indicators
      if (abbreviations.some(abbr => endCity.includes(abbr))) {
        targetStates.add(state);
        abbreviations.forEach(abbr => targetStates.add(abbr));
      }
    });

    // If no state identified, include multiple nearby states
    if (targetStates.size === 0) {
      targetStates.add('illinois');
      targetStates.add('missouri');
      targetStates.add('oklahoma');
      targetStates.add('texas');
    }

    return stops.filter(stop => {
      const stopState = stop.state?.toLowerCase();
      return stopState && Array.from(targetStates).some(state => 
        stopState.includes(state) || state.includes(stopState)
      );
    });
  }

  /**
   * Filter by quality indicators only - ignore geography
   */
  private static filterByQualityOnly(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => {
      return stop.featured || 
             stop.is_major_stop || 
             stop.is_official_destination ||
             (stop.description && stop.description.length > 30) ||
             stop.image_url ||
             stop.thumbnail_url;
    });
  }

  /**
   * Filter by category to ensure variety
   */
  private static filterByCategory(stops: TripStop[]): TripStop[] {
    const categories = ['attraction', 'destination_city', 'route66_waypoint', 'hidden_gem', 'drive_in'];
    const result: TripStop[] = [];

    categories.forEach(category => {
      const categoryStops = stops.filter(stop => stop.category === category).slice(0, 5);
      result.push(...categoryStops);
    });

    return result;
  }
}
