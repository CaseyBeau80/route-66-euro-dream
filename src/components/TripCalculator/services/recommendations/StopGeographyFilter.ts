
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopGeographyFilter {
  private static readonly MAX_DISTANCE_MILES = 100; // Increased from 50 to 100 miles
  private static readonly FALLBACK_DISTANCE_MILES = 200; // For fallback searches

  /**
   * Filter stops by route geography with enhanced fallback logic
   */
  static filterStopsByRouteGeography(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    console.log(`🌍 [GEOGRAPHY-FILTER] Starting geographic filtering for ${segment.endCity}`);
    console.log(`📊 [GEOGRAPHY-FILTER] Input stops: ${allStops.length}`);

    if (!segment.endCity || allStops.length === 0) {
      console.log(`❌ [GEOGRAPHY-FILTER] Invalid input: endCity=${segment.endCity}, stops=${allStops.length}`);
      return [];
    }

    // Extract destination city and state
    const { city: destinationCity, state: destinationState } = this.parseDestinationCity(segment.endCity);
    console.log(`🎯 [GEOGRAPHY-FILTER] Parsed destination: ${destinationCity}, ${destinationState}`);

    // STEP 1: Try exact city matches first
    const exactCityMatches = this.findExactCityMatches(allStops, destinationCity, destinationState);
    if (exactCityMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${exactCityMatches.length} exact city matches`);
      return exactCityMatches;
    }

    // STEP 2: Try state-based filtering
    const stateMatches = this.findStateMatches(allStops, destinationState);
    if (stateMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${stateMatches.length} state matches`);
      return stateMatches.slice(0, 10); // Limit to prevent too many results
    }

    // STEP 3: Try city name similarity matching
    const similarCityMatches = this.findSimilarCityMatches(allStops, destinationCity);
    if (similarCityMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${similarCityMatches.length} similar city matches`);
      return similarCityMatches;
    }

    // STEP 4: Fallback to any attractions/hidden gems (geography-agnostic)
    const fallbackStops = this.getFallbackStops(allStops);
    console.log(`🔄 [GEOGRAPHY-FILTER] Using fallback: ${fallbackStops.length} stops`);
    
    return fallbackStops;
  }

  /**
   * Parse destination city string to extract city and state
   */
  private static parseDestinationCity(endCity: string): { city: string; state: string } {
    if (!endCity.includes(',')) {
      return { city: endCity.trim(), state: '' };
    }

    const parts = endCity.split(',');
    return {
      city: parts[0].trim(),
      state: parts[1]?.trim() || ''
    };
  }

  /**
   * Find stops in the exact same city
   */
  private static findExactCityMatches(allStops: TripStop[], city: string, state: string): TripStop[] {
    return allStops.filter(stop => {
      const stopCity = (stop.city_name || stop.city || '').toLowerCase();
      const stopState = (stop.state || '').toLowerCase();
      
      const cityMatch = stopCity.includes(city.toLowerCase()) || city.toLowerCase().includes(stopCity);
      const stateMatch = state ? stopState === state.toLowerCase() : true;
      
      return cityMatch && stateMatch;
    });
  }

  /**
   * Find stops in the same state
   */
  private static findStateMatches(allStops: TripStop[], state: string): TripStop[] {
    if (!state) return [];

    return allStops.filter(stop => {
      const stopState = (stop.state || '').toLowerCase();
      return stopState === state.toLowerCase();
    });
  }

  /**
   * Find stops with similar city names
   */
  private static findSimilarCityMatches(allStops: TripStop[], city: string): TripStop[] {
    const cityLower = city.toLowerCase();
    
    return allStops.filter(stop => {
      const stopCity = (stop.city_name || stop.city || '').toLowerCase();
      
      // Check for partial matches
      return stopCity.includes(cityLower.substring(0, 3)) || 
             cityLower.includes(stopCity.substring(0, 3));
    });
  }

  /**
   * Get fallback stops when geographic filtering fails
   */
  private static getFallbackStops(allStops: TripStop[]): TripStop[] {
    // Prioritize attractions and hidden gems as fallbacks
    const fallbackStops = allStops.filter(stop => 
      stop.category === 'attraction' || 
      stop.category === 'hidden_gem' ||
      stop.category === 'destination_city' ||
      stop.category === 'diner'
    );

    console.log(`🔄 [GEOGRAPHY-FILTER] Fallback categories found:`, {
      attractions: fallbackStops.filter(s => s.category === 'attraction').length,
      hiddenGems: fallbackStops.filter(s => s.category === 'hidden_gem').length,
      destinationCities: fallbackStops.filter(s => s.category === 'destination_city').length,
      diners: fallbackStops.filter(s => s.category === 'diner').length
    });

    return fallbackStops.slice(0, 8); // Limit fallback results
  }
}
