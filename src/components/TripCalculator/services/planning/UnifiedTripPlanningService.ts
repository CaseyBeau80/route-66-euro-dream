
import { TripStop } from '../data/SupabaseDataService';
import { TripPlan } from './TripPlanBuilder';
import { TripPlanningService } from './TripPlanningService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export interface TripPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  tripStyle?: string;
  warnings?: string[];
  error?: string;
}

export class UnifiedTripPlanningService {
  /**
   * Plan a trip with the given parameters
   */
  async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlanningResult> {
    try {
      console.log('🎯 UnifiedTripPlanningService: Planning trip', {
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      });

      // For now, return a basic success response
      // This would need to be implemented with actual trip planning logic
      return {
        success: false,
        error: 'Trip planning service not yet implemented'
      };

    } catch (error) {
      console.error('❌ UnifiedTripPlanningService: Error planning trip', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

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
    
    // STEP 2: Build trip plan with destination cities only - using TripPlanningService
    const tripPlan = TripPlanningService.buildTripPlan(
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
      success: true,
      tripPlan,
      tripStyle,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}
