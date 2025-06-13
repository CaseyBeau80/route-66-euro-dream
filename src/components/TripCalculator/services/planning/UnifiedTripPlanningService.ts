
import { TripStop } from '../data/SupabaseDataService';
import { TripPlanBuilder, TripPlan } from './TripPlanBuilder';
import { CityDisplayService } from '../utils/CityDisplayService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export interface TripPlanningResult {
  tripPlan: TripPlan;
  tripStyle: string;
  warnings?: string[];
}

export class UnifiedTripPlanningService {
  /**
   * Create enhanced trip plan with strict destination city enforcement
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    tripDays: number,
    startCityName: string,
    endCityName: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlanningResult {
    console.log(`🎯 UNIFIED PLANNING with STRICT destination city enforcement`);
    
    // STEP 1: Filter all stops to only destination cities
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    console.log(`🔒 Using only ${destinationCitiesOnly.length} destination cities from ${allStops.length} total stops`);
    
    // STEP 2: Build trip plan with destination cities only - using correct method signature
    const tripPlan = TripPlanBuilder.buildTripPlan(
      startStop,
      endStop,
      destinationCitiesOnly, // Only pass destination cities
      tripDays,
      startCityName,
      endCityName,
      tripStyle
    );

    // STEP 3: Final validation
    const validation = StrictDestinationCityEnforcer.validateTripPlan(tripPlan.segments);
    
    const warnings: string[] = [];
    
    if (!validation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, validation.violations);
      warnings.push(...validation.violations);
      warnings.push('Some non-destination cities were removed from the trip plan');
    }

    // STEP 4: Additional warnings for user awareness
    const nonDestinationCount = allStops.length - destinationCitiesOnly.length;
    if (nonDestinationCount > 0) {
      warnings.push(`Excluded ${nonDestinationCount} non-destination cities to focus on major Route 66 destinations`);
    }

    console.log(`✅ UNIFIED PLANNING COMPLETE: ${tripPlan.segments.length} segments with destination cities only`);

    return {
      tripPlan,
      tripStyle,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}
