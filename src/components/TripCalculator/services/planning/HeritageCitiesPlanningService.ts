
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';
import { TripPlanningOrchestrator } from './TripPlanningOrchestrator';

export class HeritageCitiesPlanningService {
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log('🏛️ HeritageCitiesPlanningService: Starting heritage cities trip planning', {
      startLocation,
      endLocation,
      travelDays
    });
    
    try {
      // Use the orchestrator with destination-focused style
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        'destination-focused'
      );

      // Build the final trip plan using the orchestration data
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays,
        'destination-focused'
      );

      console.log('✅ HeritageCitiesPlanningService: Heritage cities trip planning completed', {
        segmentCount: tripPlan.segments?.length,
        totalDistance: tripPlan.totalDistance,
        totalDays: tripPlan.totalDays
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ HeritageCitiesPlanningService: Planning failed', error);
      
      // Return a fallback plan rather than throwing
      return {
        id: `heritage-cities-fallback-${Date.now()}`,
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
          tripStyle: 'destination-focused'
        }
      };
    }
  }
}
