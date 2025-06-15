
import { EnhancedSupabaseDataService } from './data/EnhancedSupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SegmentTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { UnifiedTripPlanningService } from './planning/UnifiedTripPlanningService';
import { CityDisplayService } from './utils/CityDisplayService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { TripStop } from '../types/TripStop';

// Re-export types for backward compatibility
export type { DailySegment, TripPlan, SegmentTiming, TripStop };

export class Route66TripPlannerService {
  static async planTrip(
    startCityName: string, 
    endCityName: string, 
    tripDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    console.log(`🗺️ STRICT PLANNING: ${tripDays}-day ${tripStyle} trip from ${startCityName} to ${endCityName}`);

    // Use enhanced data service with fallback tracking
    const allStops = await EnhancedSupabaseDataService.fetchAllStops();
    console.log(`📊 STRICT: Total stops available for planning: ${allStops.length}`);
    
    // STRICT: Filter to only destination cities for processing
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    console.log(`🔒 STRICT: Processing only ${destinationCitiesOnly.length} destination cities from ${allStops.length} total stops`);
    
    // Log data source status
    const dataSourceInfo = EnhancedSupabaseDataService.getDataSourceInfo();
    if (dataSourceInfo) {
      console.log(`📡 STRICT: Data Source: ${EnhancedSupabaseDataService.getDataSourceMessage()}`);
      
      if (!dataSourceInfo.isUsingSupabase) {
        console.warn(`⚠️ STRICT: Using fallback data due to: ${dataSourceInfo.fallbackReason}`);
      }
    }
    
    // Enhanced city matching function with improved fuzzy matching
    const findCityStop = (cityName: string): TripStop | undefined => {
      // Parse city and state from input (e.g., "Springfield, IL" or "Chicago, IL")
      const parts = cityName.split(',').map(part => part.trim());
      const cityOnly = parts[0].toLowerCase();
      const stateOnly = parts.length > 1 ? parts[1].toLowerCase() : null;
      
      console.log(`🔍 STRICT: Searching for city: "${cityOnly}", state: "${stateOnly}" from input: "${cityName}"`);
      
      // Special handling for Santa Fe - most common search terms
      if (cityOnly.includes('santa fe') || cityOnly.includes('santa_fe')) {
        const santaFe = destinationCitiesOnly.find(stop => 
          stop.name.toLowerCase().includes('santa fe') && 
          (!stateOnly || stop.state.toLowerCase().includes(stateOnly))
        );
        
        if (santaFe) {
          console.log(`🎯 STRICT: Found Santa Fe via special handling: ${santaFe.name} in ${CityDisplayService.getCityDisplayName(santaFe)}`);
          return santaFe;
        }
      }
      
      // Tier 1: Exact city + state matching (most precise) - destination cities only
      if (stateOnly) {
        const exactMatch = destinationCitiesOnly.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          // Check for exact matches with city and state
          const exactCityStateMatch = stopCity === cityOnly && stopState === stateOnly;
          const nameExactStateMatch = stopName === cityOnly && stopState === stateOnly;
          
          return exactCityStateMatch || nameExactStateMatch;
        });
        
        if (exactMatch) {
          console.log(`✅ STRICT: Found exact city+state match: ${exactMatch.name} in ${CityDisplayService.getCityDisplayName(exactMatch)}`);
          return exactMatch;
        }

        // Try partial matches with correct state - destination cities only
        const partialMatch = destinationCitiesOnly.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          if (stopState !== stateOnly) return false;
          
          const cityContains = stopCity.includes(cityOnly) || cityOnly.includes(stopCity);
          const nameContains = stopName.includes(cityOnly) || cityOnly.includes(stopName);
          
          return cityContains || nameContains;
        });
        
        if (partialMatch) {
          console.log(`✅ STRICT: Found partial city+state match: ${partialMatch.name} in ${CityDisplayService.getCityDisplayName(partialMatch)}`);
          return partialMatch;
        }
      }
      
      // Tier 2: City-only matching (fallback) - destination cities only
      const cityOnlyMatches = destinationCitiesOnly.filter(stop => {
        const stopCity = stop.city_name.toLowerCase();
        const stopName = stop.name.toLowerCase();
        
        // Exact matches first
        if (stopCity === cityOnly || stopName === cityOnly) {
          return true;
        }
        
        // Then partial matches
        return stopCity.includes(cityOnly) || stopName.includes(cityOnly) || 
               cityOnly.includes(stopCity) || cityOnly.includes(stopName);
      });

      if (cityOnlyMatches.length > 0) {
        // Return first match since all are destination cities
        const firstMatch = cityOnlyMatches[0];
        console.log(`✅ STRICT: Found destination city match: ${firstMatch.name} in ${CityDisplayService.getCityDisplayName(firstMatch)}`);
        if (stateOnly && firstMatch.state.toLowerCase() !== stateOnly) {
          console.log(`⚠️ STRICT: Warning: State mismatch! Expected ${stateOnly}, found ${firstMatch.state}`);
        }
        return firstMatch;
      }
      
      console.log(`❌ STRICT: No destination city match found for "${cityName}"`);
      
      // Enhanced error logging for debugging
      if (EnhancedSupabaseDataService.isUsingFallback()) {
        console.log(`💡 STRICT: Search failed with fallback data. Reason: ${EnhancedSupabaseDataService.getDataSourceInfo()?.fallbackReason}`);
        console.log(`📋 STRICT: Available destination cities in fallback:`, destinationCitiesOnly
          .map(stop => `${stop.name}, ${stop.state}`)
          .sort()
        );
      }
      
      return undefined;
    };
    
    // Find start and end stops with enhanced matching
    const startStop = findCityStop(startCityName);
    const endStop = findCityStop(endCityName);

    console.log('🔍 STRICT: Start stop found:', startStop ? { 
      name: startStop.name, 
      city_display: CityDisplayService.getCityDisplayName(startStop),
      category: startStop.category,
      dataSource: EnhancedSupabaseDataService.isUsingFallback() ? 'fallback' : 'supabase'
    } : 'NOT FOUND');
    
    console.log('🔍 STRICT: End stop found:', endStop ? { 
      name: endStop.name, 
      city_display: CityDisplayService.getCityDisplayName(endStop),
      category: endStop.category,
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

    console.log('🎯 STRICT: Final trip plan created:', {
      title: planningResult.tripPlan.title,
      tripStyle: planningResult.tripStyle,
      warnings: planningResult.warnings?.length || 0,
      segmentsCount: planningResult.tripPlan.segments.length,
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
