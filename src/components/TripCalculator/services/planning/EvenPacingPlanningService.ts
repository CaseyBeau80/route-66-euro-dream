
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
    console.log('⚖️ EvenPacingPlanningService: Redirecting to heritage cities planning', {
      startLocation,
      endLocation,
      travelDays,
      note: 'Now using destination-focused approach with 10h drive limits'
    });
    
    try {
      // Use the orchestrator with destination-focused style (heritage cities)
      const orchestrationData = await TripPlanningOrchestrator.orchestrateTripPlanning(
        startLocation,
        endLocation,
        travelDays,
        'destination-focused'
      );

      // Build the final trip plan - CRITICAL: pass exact travelDays
      const tripPlan = await TripPlanningOrchestrator.buildTripPlan(
        orchestrationData,
        startLocation,
        endLocation,
        travelDays, // MUST be respected exactly
        'destination-focused'
      );

      // Validate the result
      if (tripPlan.segments.length !== travelDays) {
        console.error(`❌ CRITICAL: EvenPacingPlanningService generated ${tripPlan.segments.length} days instead of ${travelDays}`);
      } else {
        console.log(`✅ EvenPacingPlanningService: Successfully created ${travelDays}-day heritage cities trip`);
      }

      console.log('✅ Heritage Cities Planning completed', {
        requestedDays: travelDays,
        actualDays: tripPlan.segments?.length,
        totalDistance: tripPlan.totalDistance,
        maxDriveTime: Math.max(...tripPlan.segments.map(s => s.driveTimeHours)),
        segments: tripPlan.segments.map(s => ({
          day: s.day,
          distance: s.distance.toFixed(0),
          driveTime: s.driveTimeHours.toFixed(1) + 'h'
        }))
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ EvenPacingPlanningService: Planning failed', error);
      
      // Return a fallback plan
      return {
        id: `heritage-fallback-${Date.now()}`,
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
          tripStyle: 'destination-focused'
        }
      };
    }
  }
}
