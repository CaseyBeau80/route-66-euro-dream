
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { DestinationSelectionService } from './DestinationSelectionService';
import { SubStopTimingCalculator, SubStopTiming } from './SubStopTimingCalculator';
import { RouteProgressCalculator } from './RouteProgressCalculator';

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
}

export class DailySegmentCreator {
  /**
   * Create daily segments with smart distance distribution and destination city targeting
   */
  static createSmartDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    tripDays: number,
    totalDistance: number
  ): DailySegment[] {
    const dailySegments: DailySegment[] = [];
    const targetDailyDistance = totalDistance / tripDays;
    
    let currentStop = startStop;
    let remainingStops = [...enhancedStops];
    let cumulativeDistance = 0;

    for (let day = 1; day <= tripDays; day++) {
      const isLastDay = day === tripDays;
      const remainingDistance = totalDistance - cumulativeDistance;
      const remainingDays = tripDays - day + 1;
      
      // Select destination for this day with enhanced logic using the new service
      const dayDestination = isLastDay 
        ? endStop 
        : DestinationSelectionService.selectOptimalDayDestination(
            currentStop, 
            endStop, 
            remainingStops, 
            remainingDistance / remainingDays
          );

      if (!dayDestination) continue;

      // Select stops for this segment with destination city priority
      const segmentStops = this.selectSegmentStops(currentStop, dayDestination, remainingStops);
      
      // Calculate distances and timings with validation
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const subStopTimings = SubStopTimingCalculator.calculateValidSubStopTimings(
        currentStop, 
        dayDestination, 
        segmentStops
      );
      
      const totalSegmentDriveTime = SubStopTimingCalculator.calculateTotalDriveTime(subStopTimings);

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
        driveTimeHours: totalSegmentDriveTime > 0 ? totalSegmentDriveTime : Math.round((segmentDistance / 50) * 10) / 10,
        subStopTimings: subStopTimings,
        routeSection
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
      
      console.log(`📅 Day ${day}: ${Math.round(segmentDistance)}mi (${routeSection}), ${segmentStops.length} stops`);
    }

    return dailySegments;
  }

  /**
   * Select appropriate stops for a segment with destination city priority
   */
  private static selectSegmentStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[]
  ): TripStop[] {
    return RouteStopSelectionService.selectStopsForSegment(startStop, endStop, availableStops, 2);
  }
}
