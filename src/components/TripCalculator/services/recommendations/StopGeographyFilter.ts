
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  private static readonly ROUTE_66_STATES = ['il', 'mo', 'ks', 'ok', 'tx', 'nm', 'az', 'ca'];

  /**
   * MUCH MORE PERMISSIVE geographic filtering to capture attractions
   */
  static filterStopsByRouteGeography(
    segment: DailySegment,
    allStops: TripStop[]
  ): TripStop[] {
    console.log(`🗺️ [ULTRA-PERMISSIVE] Starting geographic filtering for ${allStops.length} stops`);
    console.log(`🗺️ [ULTRA-PERMISSIVE] Segment: ${segment.startCity} → ${segment.endCity}`);
    
    const relevantStops = allStops.filter(stop => {
      const startCity = segment.startCity?.toLowerCase() || '';
      const endCity = segment.endCity?.toLowerCase() || '';
      const stopCity = stop.city_name?.toLowerCase() || '';
      const stopState = stop.state?.toLowerCase() || '';
      
      // CRITICAL: Extract just city names without state for comparison
      const startCityOnly = startCity.split(',')[0].trim();
      const endCityOnly = endCity.split(',')[0].trim();
      
      console.log(`🔍 [ULTRA-PERMISSIVE] Checking: ${stop.name} in ${stop.city_name}, ${stop.state} (${stop.category})`);
      
      // 1. ALWAYS include attractions and hidden gems - these are what we want!
      const isAttraction = stop.category === 'attraction' || stop.category === 'hidden_gem';
      
      // 2. Include stops in destination city (loose matching)
      const isNearDestination = 
        stopCity.includes(endCityOnly) || 
        endCityOnly.includes(stopCity) ||
        stopCity === endCityOnly ||
        // Also check against start city
        stopCity.includes(startCityOnly) || 
        startCityOnly.includes(stopCity) ||
        stopCity === startCityOnly;

      // 3. Include stops in the same state as destination
      const endState = this.extractStateFromCity(segment.endCity);
      const startState = this.extractStateFromCity(segment.startCity);
      const isInRelevantState = 
        (endState && stopState === endState.toLowerCase()) ||
        (startState && stopState === startState.toLowerCase());

      // 4. Include Route 66 corridor attractions
      const isOnRoute66Corridor = this.isOnRoute66Corridor(stop, segment);

      // 5. Include any featured stops regardless of location
      const isFeatured = stop.featured === true;

      // ULTRA-PERMISSIVE: Include if ANY condition is met
      const isRelevant = isAttraction || isNearDestination || isInRelevantState || isOnRoute66Corridor || isFeatured;
      
      console.log(`🔍 [ULTRA-PERMISSIVE] ${stop.name}:`, {
        isAttraction,
        isNearDestination, 
        isInRelevantState,
        isOnRoute66Corridor,
        isFeatured,
        finalDecision: isRelevant ? 'INCLUDE' : 'EXCLUDE'
      });

      if (isRelevant) {
        console.log(`✅ [ULTRA-PERMISSIVE] INCLUDING: ${stop.category} - ${stop.name} in ${stop.city_name}, ${stop.state}`);
      }

      return isRelevant;
    });

    console.log(`📍 [ULTRA-PERMISSIVE] Filtering complete: ${relevantStops.length}/${allStops.length} stops passed`);
    console.log(`📍 [ULTRA-PERMISSIVE] Included stops:`, relevantStops.map(s => `${s.name} (${s.category}) in ${s.city_name}, ${s.state}`));
    
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
    
    console.log(`🛣️ [ULTRA-PERMISSIVE] Route 66 corridor check for ${stop.name}:`, {
      startState, endState, stopState,
      startIndex, endIndex, stopIndex,
      minIndex, maxIndex,
      isOnCorridor
    });
    
    return isOnCorridor;
  }
}
