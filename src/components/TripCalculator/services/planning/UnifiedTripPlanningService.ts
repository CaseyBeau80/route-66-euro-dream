
import { TripPlan } from './TripPlanBuilder';
import { TripPlanValidator } from '../../planning/TripPlanValidator';
import { EnhancedSupabaseDataService } from '../data/EnhancedSupabaseDataService';
import { HeritageEnforcedTripBuilder } from './HeritageEnforcedTripBuilder';
import { TripPlanningOrchestrator } from './TripPlanningOrchestrator';

export interface UnifiedPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  error?: string;
  warnings?: string[];
  driveTimeValidation?: any;
  validationInfo?: any;
  tripStyle?: 'balanced' | 'destination-focused';
}

export class UnifiedTripPlanningService {
  /**
   * Unified trip planning that uses the orchestrator for both trip styles
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<UnifiedPlanningResult> {
    console.log(`🎯 UNIFIED TRIP PLANNING: ${tripStyle} style, ${startLocation} → ${endLocation}, ${totalDays} days`);

    try {
      // Use the orchestrator to handle the complete planning process
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        totalDays,
        tripStyle
      );

      // Build the final trip plan using the orchestration data
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        totalDays,
        tripStyle
      );

      console.log(`✅ Unified planning complete: ${tripPlan.segments?.length || 0} segments, ${tripPlan.totalDistance?.toFixed(0)}mi`);

      // Validate the trip plan
      const validation = TripPlanValidator.validateTripPlan(tripPlan);
      
      const warnings: string[] = [];
      if (validation.driveTimeValidation && !validation.driveTimeValidation.isValid) {
        warnings.push('Some days may have longer drive times than ideal');
      }

      return {
        success: true,
        tripPlan,
        warnings,
        driveTimeValidation: validation.driveTimeValidation,
        validationInfo: validation,
        tripStyle
      };

    } catch (error) {
      console.error('❌ Unified trip planning failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown planning error',
        warnings: ['Trip planning service encountered an error'],
        tripStyle
      };
    }
  }
}
