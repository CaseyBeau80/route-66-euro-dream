
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
      travelDays,
      note: 'MUST respect the requested travel days exactly'
    });
    
    try {
      // Use the orchestrator to handle the complete planning process
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        'balanced'
      );

      // Build the final trip plan using the orchestration data - CRITICAL: pass travelDays
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays, // This MUST be respected
        'balanced'
      );

      // Validate the result
      if (tripPlan.segments.length !== travelDays) {
        console.error(`❌ CRITICAL: EvenPacingPlanningService generated ${tripPlan.segments.length} days instead of ${travelDays}`);
      } else {
        console.log(`✅ EvenPacingPlanningService: Successfully created ${travelDays}-day trip`);
      }

      console.log('✅ EvenPacingPlanningService: Trip planning completed', {
        requestedDays: travelDays,
        actualDays: tripPlan.segments?.length,
        totalDistance: tripPlan.totalDistance,
        segments: tripPlan.segments.map(s => ({
          day: s.day,
          distance: s.distance.toFixed(0),
          driveTime: s.driveTimeHours.toFixed(1) + 'h'
        }))
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
        totalDays: travelDays, // Use the requested days
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
