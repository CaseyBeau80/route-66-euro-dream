
import { TripPlan } from './TripPlanTypes';
import { TripPlanningOrchestrator } from './TripPlanningOrchestrator';

export class GoogleMapsTripPlanner {
  /**
   * Plan trip using Google Maps integration - FIXED: Only destination-focused
   */
  static async planTripWithGoogleMaps(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🗺️ GoogleMapsTripPlanner: Planning ${tripStyle} trip`);
    
    try {
      // Use the orchestrator for Google Maps integration
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays,
        tripStyle
      );

      return tripPlan;

    } catch (error) {
      console.error('❌ GoogleMapsTripPlanner: Planning failed', error);
      throw error;
    }
  }
}
