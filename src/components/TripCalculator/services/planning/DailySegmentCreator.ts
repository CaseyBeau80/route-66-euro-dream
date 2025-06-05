
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { DestinationSelectionService } from './DestinationSelectionService';
import { SubStopTimingCalculator, SubStopTiming } from './SubStopTimingCalculator';
import { RouteProgressCalculator } from './RouteProgressCalculator';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';

// Export SubStopTiming for external use
export type { SubStopTiming };

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  recommendedStops: TripStop[];
  driveTimeHours: number;
  subStopTimings: SubStopTiming[];
  routeSection?: string;
  driveTimeCategory?: {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color: string;
  };
}

export class DailySegmentCreator {
  /**
   * Create daily segments with balanced drive time distribution
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    tripDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🎯 Creating balanced daily segments for ${tripDays} days, ${Math.round(totalDistance)} miles`);

    // Calculate drive time targets for each day
    const driveTimeTargets = DriveTimeBalancingService.calculateDriveTimeTargets(
      totalDistance,
      tripDays
    );

    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    let remainingStops = [...enhancedStops];
    let cumulativeDistance = 0;

    for (let day = 1; day <= tripDays; day++) {
      const isLastDay = day === tripDays;
      const driveTimeTarget = driveTimeTargets[day - 1];
      
      // Select destination for this day using drive time balancing
      const dayDestination = isLastDay 
        ? endStop 
        : DestinationSelectionService.selectOptimalDayDestination(
            currentStop, 
            endStop, 
            remainingStops, 
            0, // Not used in drive time mode
            driveTimeTarget
          );

      if (!dayDestination) continue;

      // Calculate distances and timings
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const actualDriveTime = segmentDistance / 50; // 50 mph average

      // Select stops for this segment
      const segmentStops = this.selectSegmentStops(
        currentStop, 
        dayDestination, 
        remainingStops, 
        actualDriveTime
      );
      
      const subStopTimings = SubStopTimingCalculator.calculateValidSubStopTimings(
        currentStop, 
        dayDestination, 
        segmentStops
      );
      
      const totalSegmentDriveTime = SubStopTimingCalculator.calculateTotalDriveTime(subStopTimings);
      const finalDriveTime = totalSegmentDriveTime > 0 ? totalSegmentDriveTime : actualDriveTime;

      // Get drive time category for this segment
      const driveTimeCategory = DriveTimeBalancingService.getDriveTimeCategory(finalDriveTime);

      // Determine route section
      const progressPercent = RouteProgressCalculator.calculateCumulativeProgress(
        cumulativeDistance + segmentDistance, 
        totalDistance
      );
      const routeSection = RouteProgressCalculator.getRouteSection(progressPercent);

      const startCityDisplay = CityDisplayService.getCityDisplayName(currentStop);
      const endCityDisplay = CityDisplayService.getCityDisplayName(dayDestination);

      dailySegments.push({
        day,
        title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
        startCity: startCityDisplay,
        endCity: endCityDisplay,
        approximateMiles: Math.round(segmentDistance),
        recommendedStops: segmentStops,
        driveTimeHours: Math.round(finalDriveTime * 10) / 10,
        subStopTimings: subStopTimings,
        routeSection,
        driveTimeCategory
      });

      // Update for next iteration - remove used stops
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      // Remove the day destination from remaining stops if it's not the final destination
      if (!isLastDay) {
        const destIndex = remainingStops.findIndex(s => s.id === dayDestination.id);
        if (destIndex > -1) remainingStops.splice(destIndex, 1);
      }

      currentStop = dayDestination;
      cumulativeDistance += segmentDistance;
      
      console.log(`📅 Day ${day}: ${Math.round(segmentDistance)}mi, ${finalDriveTime.toFixed(1)}h drive (${driveTimeCategory.category}), ${segmentStops.length} stops`);
    }

    // Validate the balance
    const segmentData = dailySegments.map(s => ({
      distance: s.approximateMiles,
      driveTimeHours: s.driveTimeHours
    }));
    
    const validation = DriveTimeBalancingService.validateDriveTimeBalance(segmentData, driveTimeTargets);
    
    if (!validation.isBalanced) {
      console.log('⚠️ Drive time balance issues:', validation.issues);
      console.log('💡 Suggestions:', validation.suggestions);
    } else {
      console.log('✅ Drive times are well balanced across all days');
    }

    return dailySegments;
  }

  /**
   * Legacy method for backward compatibility - now uses balanced approach
   */
  static createSmartDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    tripDays: number,
    totalDistance: number
  ): DailySegment[] {
    return this.createBalancedDailySegments(startStop, endStop, enhancedStops, tripDays, totalDistance);
  }

  /**
   * Select appropriate stops for a segment with drive time consideration
   */
  private static selectSegmentStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    driveTimeHours: number
  ): TripStop[] {
    return RouteStopSelectionService.selectStopsForSegment(startStop, endStop, availableStops, 2, driveTimeHours);
  }
}
