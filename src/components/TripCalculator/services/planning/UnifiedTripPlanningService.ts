
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
    
    // CRITICAL DEBUG: Log the EXACT parameters being passed
    console.log(`🚨 [UNIFIED DEBUG] EXACT parameters received:`);
    console.log(`   startLocation: "${startLocation}"`);
    console.log(`   endLocation: "${endLocation}"`);
    console.log(`   travelDays: ${travelDays}`);
    console.log(`   tripStyle: "${tripStyle}"`);
    
    try {
      // Since we only support destination-focused, use HeritageCitiesPlanningService
      console.log(`🏛️ Calling HeritageCitiesPlanningService...`);
      console.log(`🚨 [UNIFIED DEBUG] About to call HeritageCitiesPlanningService.planHeritageCitiesTrip with:`);
      console.log(`   startLocation parameter: "${startLocation}"`);
      console.log(`   endLocation parameter: "${endLocation}"`);
      
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
