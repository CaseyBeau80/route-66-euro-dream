
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  private static readonly ROUTE_66_STATES = ['il', 'mo', 'ks', 'ok', 'tx', 'nm', 'az', 'ca'];

  /**
   * Enhanced geographic filtering - MORE PERMISSIVE to capture more attractions
   */
  static filterStopsByRouteGeography(
    segment: DailySegment,
    allStops: TripStop[]
  ): TripStop[] {
    console.log(`🗺️ [FIXED] Starting PERMISSIVE geographic filtering for ${allStops.length} stops`);
    
    const relevantStops = allStops.filter(stop => {
      const startCity = segment.startCity?.toLowerCase() || '';
      const endCity = segment.endCity?.toLowerCase() || '';
      const stopCity = stop.city_name?.toLowerCase() || '';
      const stopState = stop.state?.toLowerCase() || '';
      
      console.log(`🔍 [FIXED] Checking: ${stop.name} in ${stop.city_name}, ${stop.state} (${stop.category})`);
      
      // 1. ALWAYS include attractions and hidden gems near destination
      const isNearDestination = 
        stopCity.includes(endCity) || 
        endCity.includes(stopCity) ||
        stopCity === endCity;

      // 2. Include attractions in the same state as destination
      const endState = this.extractStateFromCity(segment.endCity);
      const isInDestinationState = 
        endState && stopState === endState.toLowerCase();

      // 3. Include Route 66 corridor attractions
      const isOnRoute66Corridor = this.isOnRoute66Corridor(stop, segment);

      // 4. PERMISSIVE: Include popular attractions within reasonable distance
      const isPopularAttraction = 
        stop.category === 'attraction' && 
        (stop.featured || (stop.description && stop.description.length > 50));

      // 5. ALWAYS include hidden gems - they're special
      const isHiddenGem = stop.category === 'hidden_gem';

      const isRelevant = isNearDestination || isInDestinationState || isOnRoute66Corridor || isPopularAttraction || isHiddenGem;
      
      console.log(`🔍 [FIXED] Geography check for ${stop.name}:`, {
        isNearDestination,
        isInDestinationState, 
        isOnRoute66Corridor,
        isPopularAttraction,
        isHiddenGem,
        finalDecision: isRelevant ? 'INCLUDE' : 'EXCLUDE'
      });

      if (isRelevant) {
        console.log(`✅ [FIXED] INCLUDING: ${stop.category} - ${stop.name} in ${stop.city_name}, ${stop.state}`);
      }

      return isRelevant;
    });

    console.log(`📍 [FIXED] PERMISSIVE filtering complete: ${relevantStops.length}/${allStops.length} stops passed`);
    console.log(`📍 [FIXED] Included stops:`, relevantStops.map(s => `${s.name} (${s.category})`));
    
    return relevantStops;
  }

  /**
   * Extract state from city string (format: "City, ST" or "City, State")
   */
  private static extractStateFromCity(cityWithState: string): string | null {
    if (!cityWithState || !cityWithState.includes(',')) {
      return null;
    }
    
    const parts = cityWithState.split(',');
    if (parts.length < 2) {
      return null;
    }
    
    const stateStr = parts[1].trim().toLowerCase();
    
    // Handle both 2-letter codes and full state names
    const stateMapping: Record<string, string> = {
      'illinois': 'il', 'il': 'il',
      'missouri': 'mo', 'mo': 'mo', 
      'kansas': 'ks', 'ks': 'ks',
      'oklahoma': 'ok', 'ok': 'ok',
      'texas': 'tx', 'tx': 'tx',
      'new mexico': 'nm', 'nm': 'nm',
      'arizona': 'az', 'az': 'az',
      'california': 'ca', 'ca': 'ca'
    };
    
    return stateMapping[stateStr] || stateStr;
  }

  /**
   * Check if a stop is on the Route 66 corridor between start and end cities
   */
  private static isOnRoute66Corridor(stop: TripStop, segment: DailySegment): boolean {
    const startState = this.extractStateFromCity(segment.startCity)?.toLowerCase();
    const endState = this.extractStateFromCity(segment.endCity)?.toLowerCase();
    const stopState = stop.state?.toLowerCase();
    
    if (!startState || !endState || !stopState) {
      return false;
    }
    
    const startIndex = this.ROUTE_66_STATES.indexOf(startState);
    const endIndex = this.ROUTE_66_STATES.indexOf(endState);
    const stopIndex = this.ROUTE_66_STATES.indexOf(stopState);
    
    // If any state is not on Route 66, can't determine corridor
    if (startIndex === -1 || endIndex === -1 || stopIndex === -1) {
      return false;
    }
    
    // Check if stop state is between start and end states on Route 66
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    const isOnCorridor = stopIndex >= minIndex && stopIndex <= maxIndex;
    
    console.log(`🛣️ [FIXED] Route 66 corridor check for ${stop.name}:`, {
      startState, endState, stopState,
      startIndex, endIndex, stopIndex,
      minIndex, maxIndex,
      isOnCorridor
    });
    
    return isOnCorridor;
  }
}
