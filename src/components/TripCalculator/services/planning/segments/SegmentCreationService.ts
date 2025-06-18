
import { DailySegment } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';
import { TripStyleConfig } from '../TripStyleLogic';

export class SegmentCreationService {
  static async createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment | null> {
    // Stub implementation
    const distance = 250; // Mock distance
    const driveTime = distance / 60; // Mock drive time

    if (driveTime > styleConfig.maxDailyDriveHours) {
      return null;
    }

    return {
      day,
      title: `Day ${day}: ${startStop.name} to ${endStop.name}`,
      startCity: startStop.name,
      endCity: endStop.name,
      distance,
      approximateMiles: distance,
      driveTimeHours: driveTime,
      drivingTime: driveTime,
      destination: {
        city: endStop.name,
        state: endStop.state || 'Unknown'
      },
      stops: [],
      recommendedStops: [],
      attractions: []
    };
  }

  static async createCappedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment> {
    const cappedDistance = styleConfig.maxDailyDriveHours * 60; // Max distance based on drive time
    
    return {
      day,
      title: `Day ${day}: ${startStop.name} to ${endStop.name} (Capped)`,
      startCity: startStop.name,
      endCity: endStop.name,
      distance: cappedDistance,
      approximateMiles: cappedDistance,
      driveTimeHours: styleConfig.maxDailyDriveHours,
      drivingTime: styleConfig.maxDailyDriveHours,
      destination: {
        city: endStop.name,
        state: endStop.state || 'Unknown'
      },
      stops: [],
      recommendedStops: [],
      attractions: []
    };
  }
}
