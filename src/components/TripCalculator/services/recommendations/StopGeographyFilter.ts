
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  private static readonly ROUTE_66_STATES = ['il', 'mo', 'ks', 'ok', 'tx', 'nm', 'az', 'ca'];

  /**
   * Enhanced geographic filtering based on route progression
   */
  static filterStopsByRouteGeography(
    segment: DailySegment,
    allStops: TripStop[]
  ): TripStop[] {
    console.log(`🗺️ [DEBUG] Starting enhanced route-based geographic filtering for ${allStops.length} stops`);
    
    const relevantStops = allStops.filter(stop => {
      const startCity = segment.startCity?.toLowerCase() || '';
      const endCity = segment.endCity?.toLowerCase() || '';
      const stopCity = stop.city_name?.toLowerCase() || '';
      const stopState = stop.state?.toLowerCase() || '';
      
      console.log(`🔍 [DEBUG] Checking stop: ${stop.name} in ${stop.city_name}, ${stop.state} (category: ${stop.category})`);
      
      // 1. Check if stop is in or near the start city
      const isNearStart = 
        stopCity.includes(startCity) || 
        startCity.includes(stopCity) ||
        stopCity === startCity;

      // 2. Check if stop is in or near the destination city
      const isNearDestination = 
        stopCity.includes(endCity) || 
        endCity.includes(stopCity) ||
        stopCity === endCity;

      // 3. Check if stop is in the same state as either start or end city
      const startState = this.extractStateFromCity(segment.startCity);
      const endState = this.extractStateFromCity(segment.endCity);
      const isInRouteStates = 
        (startState && stopState === startState.toLowerCase()) ||
        (endState && stopState === endState.toLowerCase());

      // 4. Check if stop is on a major Route 66 corridor between start and end
      const isOnRoute66Corridor = this.isOnRoute66Corridor(stop, segment);

      const isRelevant = isNearStart || isNearDestination || isInRouteStates || isOnRoute66Corridor;
      
      console.log(`🔍 [DEBUG] Geography check for ${stop.name}:`, {
        isNearStart,
        isNearDestination, 
        isInRouteStates,
        isOnRoute66Corridor,
        finalDecision: isRelevant ? 'INCLUDE' : 'EXCLUDE'
      });

      if (isRelevant) {
        console.log(`✅ [DEBUG] Including ${stop.category}: ${stop.name} in ${stop.city_name}, ${stop.state}`);
      }

      return isRelevant;
    });

    console.log(`📍 [DEBUG] Enhanced geographic filtering complete: ${relevantStops.length}/${allStops.length} stops passed`);
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
    
    return parts[1].trim();
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
    
    console.log(`🛣️ [DEBUG] Route 66 corridor check for ${stop.name}:`, {
      startState, endState, stopState,
      startIndex, endIndex, stopIndex,
      minIndex, maxIndex,
      isOnCorridor
    });
    
    return isOnCorridor;
  }
}
