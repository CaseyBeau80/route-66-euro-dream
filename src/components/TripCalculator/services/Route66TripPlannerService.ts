import { EnhancedSupabaseDataService } from './data/EnhancedSupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SegmentTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { UnifiedTripPlanningService } from './planning/UnifiedTripPlanningService';
import { CityDisplayService } from './utils/CityDisplayService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { CityStateDisambiguationService } from './utils/CityStateDisambiguationService';

// Re-export types for backward compatibility
export type { DailySegment, TripPlan, SegmentTiming };
export type TripStop = import('../types/TripStop').TripStop;

export class Route66TripPlannerService {
  static async planTrip(
    startCityName: string, 
    endCityName: string, 
    tripDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    console.log(`🗺️ ENHANCED CITY MATCHING: ${tripDays}-day ${tripStyle} trip from ${startCityName} to ${endCityName}`);

    // Use enhanced data service with fallback tracking
    const allStops = await EnhancedSupabaseDataService.fetchAllStops();
    console.log(`📊 ENHANCED: Total stops available for planning: ${allStops.length}`);
    
    // STRICT: Filter to only destination cities for processing
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    console.log(`🔒 ENHANCED: Processing only ${destinationCitiesOnly.length} destination cities from ${allStops.length} total stops`);
    
    // Enhanced city matching function with proper state disambiguation
    const findCityStopWithDisambiguation = (cityName: string): TripStop | undefined => {
      console.log(`🔍 ENHANCED MATCHING: Searching for "${cityName}"`);
      
      // Use disambiguation service to find best matches
      const matches = CityStateDisambiguationService.findBestMatch(cityName, destinationCitiesOnly);
      
      if (matches.length === 0) {
        console.log(`❌ ENHANCED MATCHING: No matches found for "${cityName}"`);
        return undefined;
      }

      if (matches.length === 1) {
        console.log(`✅ ENHANCED MATCHING: Single match found for "${cityName}": ${matches[0].name}, ${matches[0].state}`);
        return matches[0] as TripStop;
      }

      // Multiple matches found - need disambiguation
      const { city: searchCity, state: searchState } = CityStateDisambiguationService.parseCityState(cityName);
      
      if (searchState) {
        // State was specified, find exact match
        const exactMatch = matches.find(match => match.state.toUpperCase() === searchState.toUpperCase());
        if (exactMatch) {
          console.log(`✅ ENHANCED MATCHING: Exact state match found for "${cityName}": ${exactMatch.name}, ${exactMatch.state}`);
          return exactMatch as TripStop;
        }
      }

      // No state specified or exact match not found
      console.log(`⚠️ ENHANCED MATCHING: Multiple matches found for "${cityName}":`);
      matches.forEach(match => {
        console.log(`   - ${match.name}, ${match.state}`);
      });

      // For ambiguous cities, use Route 66 preference
      if (CityStateDisambiguationService.isAmbiguousCity(searchCity)) {
        const preference = CityStateDisambiguationService.getRoute66Preference(searchCity);
        if (preference) {
          const preferredMatch = matches.find(match => 
            match.state.toUpperCase() === preference.state.toUpperCase()
          );
          if (preferredMatch) {
            console.log(`🎯 ENHANCED MATCHING: Using Route 66 preference for "${cityName}": ${preferredMatch.name}, ${preferredMatch.state}`);
            return preferredMatch as TripStop;
          }
        }
      }

      // Return first match as fallback
      console.log(`⚠️ ENHANCED MATCHING: Using first match as fallback for "${cityName}": ${matches[0].name}, ${matches[0].state}`);
      return matches[0] as TripStop;
    };
    
    // Find start and end stops with enhanced disambiguation
    const startStop = findCityStopWithDisambiguation(startCityName);
    const endStop = findCityStopWithDisambiguation(endCityName);

    console.log('🔍 ENHANCED: Start stop found:', startStop ? { 
      name: startStop.name, 
      city_display: CityDisplayService.getCityDisplayName(startStop),
      category: startStop.category,
      state: startStop.state,
      dataSource: EnhancedSupabaseDataService.isUsingFallback() ? 'fallback' : 'supabase'
    } : 'NOT FOUND');
    
    console.log('🔍 ENHANCED: End stop found:', endStop ? { 
      name: endStop.name, 
      city_display: CityDisplayService.getCityDisplayName(endStop),
      category: endStop.category,
      state: endStop.state,
      dataSource: EnhancedSupabaseDataService.isUsingFallback() ? 'fallback' : 'supabase'
    } : 'NOT FOUND');

    // Enhanced validation with better error messages
    const { startStop: validatedStartStop, endStop: validatedEndStop } = TripPlanValidator.validateStops(
      startStop,
      endStop,
      startCityName,
      endCityName,
      destinationCitiesOnly // Only pass destination cities for validation
    );

    // Use UnifiedTripPlanningService with the specified trip style and destination cities only
    const planningResult = UnifiedTripPlanningService.createTripPlan(
      validatedStartStop,
      validatedEndStop,
      destinationCitiesOnly, // Only pass destination cities
      tripDays,
      startCityName,
      endCityName,
      tripStyle
    );

    console.log('🎯 ENHANCED: Final trip plan created:', {
      title: planningResult.tripPlan.title,
      tripStyle: planningResult.tripStyle,
      warnings: planningResult.warnings?.length || 0,
      segmentsCount: planningResult.tripPlan.segments.length,
      startCity: `${validatedStartStop.name}, ${validatedStartStop.state}`,
      endCity: `${validatedEndStop.name}, ${validatedEndStop.state}`,
      dataSource: EnhancedSupabaseDataService.isUsingFallback() ? 'fallback' : 'supabase',
      destinationCitiesOnly: true
    });
    
    return planningResult.tripPlan;
  }

  /**
   * Get data source status for debugging
   */
  static getDataSourceStatus(): string {
    return EnhancedSupabaseDataService.getDataSourceMessage();
  }

  /**
   * Check if using fallback data
   */
  static isUsingFallbackData(): boolean {
    return EnhancedSupabaseDataService.isUsingFallback();
  }

  /**
   * Get count of destination cities only
   */
  static async getDestinationCitiesCount(): Promise<number> {
    const allStops = await EnhancedSupabaseDataService.fetchAllStops();
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    return destinationCitiesOnly.length;
  }
}
