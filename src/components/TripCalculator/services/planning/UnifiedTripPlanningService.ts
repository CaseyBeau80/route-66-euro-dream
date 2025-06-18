
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
    
    try {
      // Since we only support destination-focused, use HeritageCitiesPlanningService
      const tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
        startLocation,
        endLocation,
        travelDays,
        [] // Empty stops array - service will fetch its own
      );

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
