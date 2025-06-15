
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  private static readonly MAX_DISTANCE_MILES = 400; // Significantly increased for better coverage
  private static readonly FALLBACK_DISTANCE_MILES = 800; // Much larger fallback range

  /**
   * Filter stops by route geography with VERY generous fallback logic
   */
  static filterStopsByRouteGeography(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    console.log(`🌍 [CRITICAL-GEOGRAPHY] Starting GENEROUS geographic filtering for ${segment.endCity}`);
    console.log(`📊 [CRITICAL-GEOGRAPHY] Input stops: ${allStops.length}`);

    if (!segment.endCity || allStops.length === 0) {
      console.log(`❌ [CRITICAL-GEOGRAPHY] Invalid input: endCity=${segment.endCity}, stops=${allStops.length}`);
      return [];
    }

    // Extract destination city and state
    const { city: destinationCity, state: destinationState } = this.parseDestinationCity(segment.endCity);
    console.log(`🎯 [CRITICAL-GEOGRAPHY] Parsed destination: ${destinationCity}, ${destinationState}`);

    // STEP 1: Try exact city matches first
    const exactCityMatches = this.findExactCityMatches(allStops, destinationCity, destinationState);
    if (exactCityMatches.length > 0) {
      console.log(`✅ [CRITICAL-GEOGRAPHY] Found ${exactCityMatches.length} exact city matches`);
      return exactCityMatches;
    }

    // STEP 2: Try state-based filtering with MUCH broader criteria
    const stateMatches = this.findStateMatches(allStops, destinationState);
    if (stateMatches.length > 0) {
      console.log(`✅ [CRITICAL-GEOGRAPHY] Found ${stateMatches.length} state matches`);
      return stateMatches; // Return ALL state matches, don't limit
    }

    // STEP 3: Try regional matching (neighboring states) - VERY generous
    const regionalMatches = this.findRegionalMatches(allStops, destinationState);
    if (regionalMatches.length > 0) {
      console.log(`✅ [CRITICAL-GEOGRAPHY] Found ${regionalMatches.length} regional matches`);
      return regionalMatches; // Return ALL regional matches
    }

    // STEP 4: Try Route 66 attractions regardless of location
    const route66Matches = this.findRoute66Attractions(allStops);
    if (route66Matches.length > 0) {
      console.log(`✅ [CRITICAL-GEOGRAPHY] Found ${route66Matches.length} Route 66 attractions`);
      return route66Matches;
    }

    // STEP 5: LAST RESORT - return ANY high-quality stops
    const fallbackStops = this.getFallbackStops(allStops);
    console.log(`🔄 [CRITICAL-GEOGRAPHY] LAST RESORT fallback: ${fallbackStops.length} stops`);
    
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
   * Find stops in the exact same city with VERY loose matching
   */
  private static findExactCityMatches(allStops: TripStop[], city: string, state: string): TripStop[] {
    return allStops.filter(stop => {
      const stopCity = (stop.city_name || stop.city || '').toLowerCase();
      const stopState = (stop.state || '').toLowerCase();
      
      // VERY generous city matching
      const cityMatch = stopCity === city.toLowerCase() || 
                       stopCity.includes(city.toLowerCase()) || 
                       city.toLowerCase().includes(stopCity) ||
                       this.fuzzyMatch(stopCity, city.toLowerCase());
                       
      const stateMatch = state ? (stopState === state.toLowerCase() || this.fuzzyMatch(stopState, state.toLowerCase())) : true;
      
      return cityMatch && stateMatch;
    });
  }

  /**
   * Simple fuzzy matching for city names
   */
  private static fuzzyMatch(str1: string, str2: string): boolean {
    if (!str1 || !str2) return false;
    
    // Remove common words and check for partial matches
    const clean1 = str1.replace(/\b(city|town|village|st|saint)\b/g, '').trim();
    const clean2 = str2.replace(/\b(city|town|village|st|saint)\b/g, '').trim();
    
    return clean1.includes(clean2) || clean2.includes(clean1);
  }

  /**
   * Find stops in the same state - return ALL of them
   */
  private static findStateMatches(allStops: TripStop[], state: string): TripStop[] {
    if (!state) return [];

    return allStops.filter(stop => {
      const stopState = (stop.state || '').toLowerCase();
      return stopState === state.toLowerCase() || this.fuzzyMatch(stopState, state.toLowerCase());
    });
  }

  /**
   * Find stops in neighboring states or regions - VERY generous
   */
  private static findRegionalMatches(allStops: TripStop[], state: string): TripStop[] {
    if (!state) return [];

    // MUCH more generous Route 66 state groupings
    const route66Regions: Record<string, string[]> = {
      'illinois': ['missouri', 'indiana', 'iowa', 'wisconsin', 'kentucky'],
      'missouri': ['illinois', 'kansas', 'oklahoma', 'arkansas', 'tennessee', 'kentucky', 'iowa', 'nebraska'],
      'kansas': ['missouri', 'oklahoma', 'nebraska', 'colorado'],
      'oklahoma': ['kansas', 'texas', 'missouri', 'arkansas', 'new mexico'],
      'texas': ['oklahoma', 'new mexico', 'louisiana', 'arkansas'],
      'new mexico': ['texas', 'arizona', 'colorado', 'oklahoma'],
      'arizona': ['new mexico', 'california', 'nevada', 'utah'],
      'california': ['arizona', 'nevada']
    };

    const stateLower = state.toLowerCase();
    const neighboringStates = route66Regions[stateLower] || [];

    return allStops.filter(stop => {
      const stopState = (stop.state || '').toLowerCase();
      return neighboringStates.includes(stopState);
    });
  }

  /**
   * Find Route 66 specific attractions - VERY broad search
   */
  private static findRoute66Attractions(allStops: TripStop[]): TripStop[] {
    return allStops.filter(stop => {
      const name = stop.name.toLowerCase();
      const description = (stop.description || '').toLowerCase();
      
      return name.includes('route 66') || 
             name.includes('rt 66') ||
             name.includes('route66') ||
             description.includes('route 66') ||
             description.includes('historic highway') ||
             stop.category === 'route66_waypoint' ||
             stop.category === 'destination_city' ||
             stop.category === 'attraction' ||
             stop.is_major_stop ||
             stop.featured;
    });
  }

  /**
   * Get fallback stops when ALL geographic filtering fails - return the BEST stops
   */
  private static getFallbackStops(allStops: TripStop[]): TripStop[] {
    // Return ALL high-quality stops regardless of location
    const fallbackStops = allStops.filter(stop => {
      return stop.featured || 
             stop.is_major_stop || 
             stop.is_official_destination ||
             stop.category === 'attraction' || 
             stop.category === 'hidden_gem' ||
             stop.category === 'destination_city' ||
             stop.category === 'drive_in' ||
             stop.category === 'diner' ||
             (stop.description && stop.description.length > 50) ||
             stop.image_url ||
             stop.thumbnail_url;
    });

    console.log(`🔄 [CRITICAL-GEOGRAPHY] Fallback criteria analysis:`, {
      featured: fallbackStops.filter(s => s.featured).length,
      majorStops: fallbackStops.filter(s => s.is_major_stop).length,
      officialDestinations: fallbackStops.filter(s => s.is_official_destination).length,
      attractions: fallbackStops.filter(s => s.category === 'attraction').length,
      hiddenGems: fallbackStops.filter(s => s.category === 'hidden_gem').length,
      destinationCities: fallbackStops.filter(s => s.category === 'destination_city').length,
      withDescriptions: fallbackStops.filter(s => s.description && s.description.length > 50).length,
      withImages: fallbackStops.filter(s => s.image_url || s.thumbnail_url).length
    });

    return fallbackStops; // Return ALL quality stops, no limiting
  }
}
