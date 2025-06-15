
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopGeographyFilter {
  private static readonly MAX_DISTANCE_MILES = 150; // Increased from 100 to 150 miles
  private static readonly FALLBACK_DISTANCE_MILES = 300; // Increased fallback range

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

    // STEP 2: Try partial city name matching
    const partialCityMatches = this.findPartialCityMatches(allStops, destinationCity, destinationState);
    if (partialCityMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${partialCityMatches.length} partial city matches`);
      return partialCityMatches;
    }

    // STEP 3: Try state-based filtering with broader criteria
    const stateMatches = this.findStateMatches(allStops, destinationState);
    if (stateMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${stateMatches.length} state matches`);
      return stateMatches.slice(0, 15); // Increased limit
    }

    // STEP 4: Try regional matching (neighboring states)
    const regionalMatches = this.findRegionalMatches(allStops, destinationState);
    if (regionalMatches.length > 0) {
      console.log(`✅ [GEOGRAPHY-FILTER] Found ${regionalMatches.length} regional matches`);
      return regionalMatches.slice(0, 10);
    }

    // STEP 5: Fallback to high-quality attractions regardless of location
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
      
      const cityMatch = stopCity === city.toLowerCase() || 
                       stopCity.includes(city.toLowerCase()) || 
                       city.toLowerCase().includes(stopCity);
      const stateMatch = state ? stopState === state.toLowerCase() : true;
      
      return cityMatch && stateMatch;
    });
  }

  /**
   * Find stops with partial city name matches
   */
  private static findPartialCityMatches(allStops: TripStop[], city: string, state: string): TripStop[] {
    const cityLower = city.toLowerCase();
    
    return allStops.filter(stop => {
      const stopCity = (stop.city_name || stop.city || '').toLowerCase();
      const stopState = (stop.state || '').toLowerCase();
      
      // Check for partial matches (at least 3 characters)
      const hasPartialMatch = cityLower.length >= 3 && stopCity.length >= 3 && (
        stopCity.includes(cityLower.substring(0, Math.min(cityLower.length, 5))) || 
        cityLower.includes(stopCity.substring(0, Math.min(stopCity.length, 5)))
      );
      
      const stateMatch = state ? stopState === state.toLowerCase() : true;
      
      return hasPartialMatch && stateMatch;
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
   * Find stops in neighboring states or regions
   */
  private static findRegionalMatches(allStops: TripStop[], state: string): TripStop[] {
    if (!state) return [];

    // Route 66 state groupings
    const route66Regions: Record<string, string[]> = {
      'illinois': ['missouri', 'indiana'],
      'missouri': ['illinois', 'kansas', 'oklahoma'],
      'kansas': ['missouri', 'oklahoma'],
      'oklahoma': ['kansas', 'texas', 'missouri'],
      'texas': ['oklahoma', 'new mexico'],
      'new mexico': ['texas', 'arizona'],
      'arizona': ['new mexico', 'california'],
      'california': ['arizona']
    };

    const stateLower = state.toLowerCase();
    const neighboringStates = route66Regions[stateLower] || [];

    return allStops.filter(stop => {
      const stopState = (stop.state || '').toLowerCase();
      return neighboringStates.includes(stopState);
    });
  }

  /**
   * Get fallback stops when geographic filtering fails
   */
  private static getFallbackStops(allStops: TripStop[]): TripStop[] {
    // Prioritize high-quality stops regardless of location
    const fallbackStops = allStops.filter(stop => {
      // Prefer featured stops, major destinations, and popular categories
      return stop.featured || 
             stop.is_major_stop || 
             stop.is_official_destination ||
             stop.category === 'attraction' || 
             stop.category === 'hidden_gem' ||
             stop.category === 'destination_city';
    });

    console.log(`🔄 [GEOGRAPHY-FILTER] Fallback categories found:`, {
      featured: fallbackStops.filter(s => s.featured).length,
      majorStops: fallbackStops.filter(s => s.is_major_stop).length,
      officialDestinations: fallbackStops.filter(s => s.is_official_destination).length,
      attractions: fallbackStops.filter(s => s.category === 'attraction').length,
      hiddenGems: fallbackStops.filter(s => s.category === 'hidden_gem').length,
      destinationCities: fallbackStops.filter(s => s.category === 'destination_city').length
    });

    return fallbackStops.slice(0, 12); // Increased fallback limit
  }
}
