
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  /**
   * Filter stops by route geography with more lenient criteria to ensure we get results
   */
  static filterStopsByRouteGeography(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    if (!segment?.endCity || !allStops?.length) {
      console.log('🌍 [GEOGRAPHY-FILTER] Invalid input for geographic filtering');
      return [];
    }

    const endCity = segment.endCity.toLowerCase();
    console.log(`🌍 [GEOGRAPHY-FILTER] Filtering ${allStops.length} stops for destination: ${endCity}`);

    // ENHANCED: Multiple filtering strategies with fallbacks
    const strategies = [
      // Strategy 1: Exact city match
      () => this.filterByExactCity(allStops, endCity),
      
      // Strategy 2: State-based filtering  
      () => this.filterByState(allStops, segment),
      
      // Strategy 3: Regional filtering with Route 66 relevance
      () => this.filterByRoute66Relevance(allStops),
      
      // Strategy 4: Fallback to featured/major stops
      () => this.filterByQuality(allStops)
    ];

    // Try each strategy until we get sufficient results
    for (let i = 0; i < strategies.length; i++) {
      const filtered = strategies[i]();
      console.log(`🌍 [GEOGRAPHY-FILTER] Strategy ${i + 1} result: ${filtered.length} stops`);
      
      if (filtered.length >= 1) {
        console.log(`✅ [GEOGRAPHY-FILTER] Using strategy ${i + 1}, found ${filtered.length} stops`);
        return filtered;
      }
    }

    console.log('⚠️ [GEOGRAPHY-FILTER] All strategies failed, returning all stops as fallback');
    return allStops.slice(0, 10); // Return top 10 as absolute fallback
  }

  /**
   * Filter by exact city match
   */
  private static filterByExactCity(stops: TripStop[], endCity: string): TripStop[] {
    return stops.filter(stop => {
      const cityMatch = stop.city_name?.toLowerCase().includes(endCity) || 
                      stop.city?.toLowerCase().includes(endCity);
      return cityMatch;
    });
  }

  /**
   * Filter by state for broader geographic relevance
   */
  private static filterByState(stops: TripStop[], segment: DailySegment): TripStop[] {
    const stateMap: Record<string, string[]> = {
      'illinois': ['chicago', 'springfield', 'joliet'],
      'missouri': ['st. louis', 'springfield', 'joplin'],
      'kansas': ['galena'],
      'oklahoma': ['tulsa', 'oklahoma city', 'commerce'],
      'texas': ['amarillo', 'shamrock', 'adrian'],
      'new mexico': ['tucumcari', 'santa rosa', 'albuquerque', 'santa fe'],
      'arizona': ['holbrook', 'winslow', 'flagstaff', 'williams'],
      'california': ['needles', 'barstow', 'san bernardino', 'santa monica', 'los angeles']
    };

    const endCity = segment.endCity.toLowerCase();
    
    // Find which state the end city belongs to
    const targetState = Object.keys(stateMap).find(state => 
      stateMap[state].some(city => city.includes(endCity) || endCity.includes(city))
    );

    if (targetState) {
      return stops.filter(stop => {
        const stopState = stop.state?.toLowerCase();
        return stopState === targetState || stopState === targetState.substring(0, 2);
      });
    }

    return [];
  }

  /**
   * Filter by Route 66 relevance
   */
  private static filterByRoute66Relevance(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => {
      const isRelevant = stop.category === 'route66_waypoint' ||
                        stop.category === 'destination_city' ||
                        stop.is_major_stop ||
                        stop.featured ||
                        this.hasRoute66Keywords(stop);
      return isRelevant;
    });
  }

  /**
   * Filter by quality indicators
   */
  private static filterByQuality(stops: TripStop[]): TripStop[] {
    return stops.filter(stop => {
      return stop.featured || 
             stop.is_major_stop || 
             stop.is_official_destination ||
             (stop.description && stop.description.length > 50) ||
             stop.image_url ||
             stop.thumbnail_url;
    });
  }

  /**
   * Check for Route 66 keywords in stop content
   */
  private static hasRoute66Keywords(stop: TripStop): boolean {
    const keywords = ['route 66', 'rt 66', 'route66', 'historic highway', 'mother road'];
    const searchText = `${stop.name || ''} ${stop.description || ''}`.toLowerCase();
    
    return keywords.some(keyword => searchText.includes(keyword));
  }
}
