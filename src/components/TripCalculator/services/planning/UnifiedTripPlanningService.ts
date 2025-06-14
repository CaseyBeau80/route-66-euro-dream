
import { TripStop } from '../data/SupabaseDataService';
import { TripPlan } from './TripPlanBuilder';
import { TripPlanningService } from './TripPlanningService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66TripPlannerService } from '../Route66TripPlannerService';

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

      // Use the existing Route66TripPlannerService to plan the trip
      const tripPlan = await Route66TripPlannerService.planTrip(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      console.log('✅ UnifiedTripPlanningService: Trip planned successfully', {
        segmentCount: tripPlan.segments?.length || 0,
        totalDistance: tripPlan.totalDistance,
        tripStyle: tripPlan.tripStyle
      });

      return {
        success: true,
        tripPlan,
        tripStyle,
        warnings: [] // Could add warnings from the planning process if needed
      };

    } catch (error) {
      console.error('❌ UnifiedTripPlanningService: Error planning trip', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: errorMessage
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
