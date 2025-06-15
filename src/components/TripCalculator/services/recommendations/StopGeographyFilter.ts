
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';

export class StopGeographyFilter {
  /**
   * Filter stops by route geography with very generous fallback logic
   */
  static filterStopsByRouteGeography(segment: DailySegment, allStops: TripStop[]): TripStop[] {
    console.log(`🌍 [ENHANCED-GEO] Starting geographic filtering for ${segment.endCity}`);
    console.log(`📊 [ENHANCED-GEO] Input: ${allStops.length} stops`);

    if (!segment.endCity || allStops.length === 0) {
      console.log(`❌ [ENHANCED-GEO] Invalid input`);
      return [];
    }

    // Extract destination info
    const { city: destinationCity, state: destinationState } = this.parseDestinationCity(segment.endCity);
    console.log(`🎯 [ENHANCED-GEO] Target: ${destinationCity}, ${destinationState}`);

    // STEP 1: Exact city matches (highest priority)
    const exactMatches = this.findExactCityMatches(allStops, destinationCity, destinationState);
    if (exactMatches.length >= 2) {
      console.log(`✅ [ENHANCED-GEO] Found ${exactMatches.length} exact city matches`);
      return exactMatches;
    }

    // STEP 2: State matches (good fallback)
    const stateMatches = this.findStateMatches(allStops, destinationState);
    if (stateMatches.length >= 2) {
      console.log(`✅ [ENHANCED-GEO] Found ${stateMatches.length} state matches`);
      return stateMatches.slice(0, 10); // Limit to prevent overwhelming
    }

    // STEP 3: Regional matches (neighboring states)
    const regionalMatches = this.findRegionalMatches(allStops, destinationState);
    if (regionalMatches.length >= 2) {
      console.log(`✅ [ENHANCED-GEO] Found ${regionalMatches.length} regional matches`);
      return regionalMatches.slice(0, 8);
    }

    // STEP 4: Route 66 attractions (broad search)
    const route66Matches = this.findRoute66Attractions(allStops);
    if (route66Matches.length >= 2) {
      console.log(`✅ [ENHANCED-GEO] Found ${route66Matches.length} Route 66 attractions`);
      return route66Matches.slice(0, 6);
    }

    // STEP 5: High-quality stops regardless of location
    const qualityMatches = this.getHighQualityStops(allStops);
    console.log(`🔄 [ENHANCED-GEO] Final fallback: ${qualityMatches.length} quality stops`);
    
    return qualityMatches.slice(0, 5);
  }

  /**
   * Parse destination city string
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
   * Find exact city matches with fuzzy matching
   */
  private static findExactCityMatches(allStops: TripStop[], city: string, state: string): TripStop[] {
    const cityLower = city.toLowerCase();
    const stateLower = state.toLowerCase();
    
    return allStops.filter(stop => {
      const stopCity = (stop.city_name || stop.city || '').toLowerCase();
      const stopState = (stop.state || '').toLowerCase();
      
      const cityMatch = stopCity === cityLower || 
                       stopCity.includes(cityLower) || 
                       cityLower.includes(stopCity) ||
                       this.fuzzyMatch(stopCity, cityLower);
                       
      const stateMatch = !state || stopState === stateLower || this.fuzzyMatch(stopState, stateLower);
      
      return cityMatch && stateMatch;
    });
  }

  /**
   * Simple fuzzy matching for names
   */
  private static fuzzyMatch(str1: string, str2: string): boolean {
    if (!str1 || !str2) return false;
    
    const clean1 = str1.replace(/\b(city|town|village|st|saint)\b/g, '').trim();
    const clean2 = str2.replace(/\b(city|town|village|st|saint)\b/g, '').trim();
    
    return clean1.length > 0 && clean2.length > 0 && 
           (clean1.includes(clean2) || clean2.includes(clean1));
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
   * Find stops in neighboring Route 66 states
   */
  private static findRegionalMatches(allStops: TripStop[], state: string): TripStop[] {
    if (!state) return [];

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
   * Find Route 66 specific attractions
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
             stop.is_major_stop ||
             stop.featured;
    });
  }

  /**
   * Get high-quality stops for final fallback
   */
  private static getHighQualityStops(allStops: TripStop[]): TripStop[] {
    return allStops.filter(stop => {
      return stop.featured || 
             stop.is_major_stop || 
             stop.is_official_destination ||
             (stop.description && stop.description.length > 50) ||
             stop.image_url ||
             stop.thumbnail_url;
    }).sort((a, b) => {
      // Prioritize featured and major stops
      const aScore = (a.featured ? 10 : 0) + (a.is_major_stop ? 5 : 0);
      const bScore = (b.featured ? 10 : 0) + (b.is_major_stop ? 5 : 0);
      return bScore - aScore;
    });
  }
}
