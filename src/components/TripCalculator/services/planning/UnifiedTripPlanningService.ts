
import { TripPlan } from './TripPlanTypes';
import { HeritageCitiesPlanningService } from './HeritageCitiesPlanningService';

export interface UnifiedPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  error?: string;
  warnings?: string[];
  tripStyle: 'destination-focused';
}

export class UnifiedTripPlanningService {
  /**
   * Unified trip planning service - FIXED: Only destination-focused
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<UnifiedPlanningResult> {
    console.log(`🎯 UnifiedTripPlanningService: Planning ${tripStyle} trip`);
    console.log(`📍 Route: ${startLocation} → ${endLocation}, ${travelDays} days`);
    console.log(`🚀 DEBUG: UnifiedTripPlanningService.planTrip called!`);
    
    try {
      // Since we only support destination-focused, use HeritageCitiesPlanningService
      console.log(`🏛️ Calling HeritageCitiesPlanningService...`);
      const tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
        startLocation,
        endLocation,
        travelDays,
        [] // Empty stops array - service will fetch its own
      );

      console.log(`✅ HeritageCitiesPlanningService completed successfully`);
      return {
        success: true,
        tripPlan,
        tripStyle,
        warnings: []
      };

    } catch (error) {
      console.error('❌ UnifiedTripPlanningService: Planning failed', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Trip planning failed',
        tripStyle,
        warnings: []
      };
    }
  }
}
