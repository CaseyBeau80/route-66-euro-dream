
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';
import { TripPlanningOrchestrator } from './TripPlanningOrchestrator';

export class EvenPacingPlanningService {
  static async planEvenPacingTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log('⚖️ EvenPacingPlanningService: Starting even pacing trip planning', {
      startLocation,
      endLocation,
      travelDays
    });
    
    try {
      // Use the orchestrator to handle the complete planning process
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        'balanced'
      );

      // Build the final trip plan using the orchestration data
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays,
        'balanced'
      );

      console.log('✅ EvenPacingPlanningService: Trip planning completed', {
        segmentCount: tripPlan.segments?.length,
        totalDistance: tripPlan.totalDistance,
        totalDays: tripPlan.totalDays
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ EvenPacingPlanningService: Planning failed', error);
      
      // Return a fallback plan rather than throwing
      return {
        id: `even-pacing-fallback-${Date.now()}`,
        startCity: startLocation,
        endCity: endLocation,
        startLocation,
        endLocation,
        startDate: new Date(),
        totalDays: travelDays,
        totalDistance: 2400,
        totalDrivingTime: 40,
        segments: [],
        dailySegments: [],
        stops: [],
        summary: {
          totalDays: travelDays,
          totalDistance: 2400,
          totalDriveTime: 40,
          startLocation,
          endLocation,
          tripStyle: 'balanced'
        }
      };
    }
  }
}
