
import { TripPlan } from './TripPlanTypes';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';

export class TripPlanningService {
  /**
   * Main trip planning service - FIXED: Only destination-focused
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🎯 TripPlanningService: Planning ${tripStyle} trip`);
    
    try {
      const result = await UnifiedTripPlanningService.planTrip(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      if (!result.success || !result.tripPlan) {
        throw new Error(result.error || 'Trip planning failed');
      }

      return result.tripPlan;

    } catch (error) {
      console.error('❌ TripPlanningService: Planning failed', error);
      throw error;
    }
  }
}
