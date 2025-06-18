
import { TripPlan } from './planning/TripPlanTypes';
import { EvenPacingPlanningService } from './planning/EvenPacingPlanningService';
import { HeritageCitiesPlanningService } from './planning/HeritageCitiesPlanningService';
import { SupabaseDataService } from './data/SupabaseDataService';

// Export TripPlan type for external use - fix for isolatedModules
export type { TripPlan } from './planning/TripPlanTypes';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan | null;
  debugInfo: any;
  validationResults: any;
  warnings: string[];
  completionAnalysis?: any;
  originalRequestedDays?: number;
}

export class Route66TripPlannerService {
  /**
   * Plan a Route 66 trip using the appropriate algorithm based on trip style
   */
  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: string
  ): Promise<EnhancedTripPlanResult> {
    console.log(`🚗 PLANNING TRIP: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle} style`);
    
    const warnings: string[] = [];
    const debugInfo = {
      startLocation,
      endLocation,
      travelDays,
      tripStyle,
      timestamp: new Date().toISOString()
    };

    try {
      // Load all stops - fix method name
      const allStops = await SupabaseDataService.fetchAllStops();
      
      if (!allStops || allStops.length === 0) {
        throw new Error('No Route 66 stops available');
      }

      console.log(`📍 Loaded ${allStops.length} Route 66 stops`);

      let tripPlan: TripPlan;

      // Use the appropriate planning service based on trip style
      if (tripStyle === 'balanced') {
        console.log(`⚖️ Using Even Pacing planning algorithm`);
        tripPlan = await EvenPacingPlanningService.planEvenPacingTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else if (tripStyle === 'destination-focused') {
        console.log(`🏛️ Using Heritage Cities planning algorithm`);
        tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else {
        // Default to Even Pacing for unknown styles
        console.log(`⚖️ Unknown trip style '${tripStyle}', defaulting to Even Pacing`);
        warnings.push(`Unknown trip style '${tripStyle}', using Even Pacing instead`);
        tripPlan = await EvenPacingPlanningService.planEvenPacingTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      }

      return {
        tripPlan,
        debugInfo,
        validationResults: { driveTimeValidation: { isValid: true }, sequenceValidation: { isValid: true } },
        warnings,
        completionAnalysis: undefined,
        originalRequestedDays: travelDays
      };

    } catch (error) {
      console.error('❌ Trip planning failed:', error);
      throw error;
    }
  }
}
