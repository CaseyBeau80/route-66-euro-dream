
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './DailySegmentCreator';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DriveTimeCategory } from './TripPlanBuilder';

export class DynamicRebalancingService {
  static createRebalancedSegments(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    for (let day = 1; day <= totalDays; day++) {
      const segmentDistance = totalDistance / totalDays;
      const driveTime = segmentDistance / 65; // 65 mph average
      const driveTimeCategory = DriveTimeBalancingService.getDriveTimeCategory(driveTime) as DriveTimeCategory;

      segments.push({
        day,
        title: `Day ${day}: Rebalanced Route`,
        startCity: day === 1 ? startStop.name : `Stop ${day - 1}`,
        endCity: day === totalDays ? endStop.name : `Stop ${day}`,
        approximateMiles: Math.round(segmentDistance),
        distance: segmentDistance,
        drivingTime: driveTime,
        driveTimeHours: driveTime,
        recommendedStops: [],
        attractions: [],
        subStopTimings: [],
        routeSection: day <= totalDays / 3 ? 'Early Route' : 
                     day <= (2 * totalDays) / 3 ? 'Mid Route' : 'Final Stretch',
        driveTimeCategory,
        destination: {
          city: day === totalDays ? endStop.name : `Stop ${day}`,
          state: day === totalDays ? endStop.state : undefined
        }
      });
    }

    return segments;
  }
}
