
import { TripPlan } from './TripPlanTypes';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';

export class TripPlanningServiceV2 {
  /**
   * Version 2 of trip planning service - FIXED: Only destination-focused
   */
  static async planAdvancedTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚀 TripPlanningServiceV2: Advanced planning for ${tripStyle} trip`);
    
    try {
      const result = await UnifiedTripPlanningService.planTrip(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      if (!result.success || !result.tripPlan) {
        throw new Error(result.error || 'Advanced trip planning failed');
      }

      return result.tripPlan;

    } catch (error) {
      console.error('❌ TripPlanningServiceV2: Advanced planning failed', error);
      throw error;
    }
  }
}
