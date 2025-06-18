
import { TripStop } from '../../../types/TripStop';
import { DailySegment, DriveTimeCategory } from '../TripPlanTypes';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { CityDisplayService } from '../../utils/CityDisplayService';
import { DriveTimeCalculator } from '../utils/DriveTimeCalculator';
import { StopCurationService } from '../utils/StopCurationService';

export class BalancedSegmentCreator {
  /**
   * Create daily segments with balanced drive times
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    let currentStop = startStop;

    // Filter remaining stops (excluding start, end, and destinations)
    const usedStopIds = new Set([startStop.id, endStop.id, ...destinations.map(d => d.id)]);
    const remainingStops = allStops.filter(stop => !usedStopIds.has(stop.id));

    console.log(`🎯 Creating balanced segments with ${remainingStops.length} remaining stops`);

    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );
      const driveTimeHours = DriveTimeCalculator.calculateDriveTime(segmentDistance);

      // Enhanced stop curation for this segment
      const segmentStops = StopCurationService.curateStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops,
        Math.min(5, Math.floor(driveTimeHours) + 2)
      );

      // Create drive time category with balance awareness
      const driveTimeCategory = this.getBalancedDriveTimeCategory(driveTimeHours);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${CityDisplayService.getCityDisplayName(currentStop)} to ${CityDisplayService.getCityDisplayName(dayDestination)}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(dayDestination),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: dayDestination.city || dayDestination.city_name,
          state: dayDestination.state
        },
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city || stop.city_name,
          category: stop.category || 'attraction' // Add required category property
        })),
        driveTimeCategory,
        routeSection: day <= Math.ceil(totalDays / 3) ? 'Early Route' : 
                     day <= Math.ceil(2 * totalDays / 3) ? 'Mid Route' : 'Final Stretch'
      };

      segments.push(segment);
      currentStop = dayDestination;

      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name}, ${driveTimeHours.toFixed(1)}h ${DriveTimeCalculator.isOptimalDriveTime(driveTimeHours) ? '✅' : '⚠️'}`);
    }

    return segments;
  }

  /**
   * Balanced drive time category with balance awareness
   */
  private static getBalancedDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - Relaxed pace, plenty of time for attractions`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - Perfect balance of driving and sightseeing`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - Substantial day, but manageable`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - Very long day, consider adding stops`,
        color: 'text-red-800'
      };
    }
  }
}
