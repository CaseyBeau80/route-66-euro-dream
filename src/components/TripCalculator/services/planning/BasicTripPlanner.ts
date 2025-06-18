
import { TripPlan } from './TripPlanTypes';
import { TripPlanningOrchestrator, OrchestrationData } from './TripPlanningOrchestrator';

export class BasicTripPlanner {
  /**
   * Plan a basic trip with enhanced logic - FIXED: Only destination-focused
   */
  static async planBasicTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚗 BASIC PLANNING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    try {
      // Orchestrate the planning process
      const orchestrationData: OrchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      // Build the final trip plan
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      return tripPlan;

    } catch (error) {
      console.error('❌ BASIC Trip planning failed:', error);
      throw error;
    }
  }

  /**
   * Map drive time category for compatibility
   */
  private static mapDriveTimeCategory(category: string): 'short' | 'optimal' | 'long' | 'extreme' {
    switch (category) {
      case 'moderate':
        return 'optimal';
      case 'comfortable':
        return 'short';
      case 'extended':
        return 'long';
      default:
        return 'optimal';
    }
  }
}
