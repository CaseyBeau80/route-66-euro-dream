
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { StopEnhancementService } from './StopEnhancementService';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distanceMiles: number;
  driveTimeHours: number;
}

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

export interface TripPlan {
  title: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  dailySegments: DailySegment[];
  wasAdjusted?: boolean;
  originalDays?: number;
}

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with enhanced segmentation and stop selection
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    startCityName: string,
    endCityName: string
  ): TripPlan {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance} miles`);

    // Smart trip day calculation
    const optimalDays = StopEnhancementService.calculateOptimalTripDays(totalDistance, requestedDays);
    const wasAdjusted = optimalDays !== requestedDays;
    
    if (wasAdjusted) {
      console.log(`🔄 Adjusted trip from ${requestedDays} to ${optimalDays} days for better daily distances`);
    }

    // Get and enhance stops along the route
    const routeStops = RouteStopSelectionService.getStopsAlongRoute(startStop, endStop, allStops);
    const enhancedStops = StopEnhancementService.ensureGeographicDiversity(startStop, endStop, routeStops);
    
    console.log(`🛤️ Enhanced route: ${enhancedStops.length} diverse stops selected`);

    // Plan daily segments with smart distribution
    const dailySegments = this.createSmartDailySegments(
      startStop,
      endStop,
      enhancedStops,
      optimalDays,
      totalDistance
    );

    const tripTitle = CityDisplayService.createTripTitle(startStop, endStop);

    return {
      title: tripTitle,
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: optimalDays,
      totalMiles: Math.round(totalDistance),
      dailySegments,
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined
    };
  }

  /**
   * Create daily segments with smart distance distribution
   */
  private static createSmartDailySegments(
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
      const targetCumulativeDistance = day * targetDailyDistance;
      
      // Select destination for this day
      const dayDestination = isLastDay 
        ? endStop 
        : this.selectOptimalDayDestination(
            currentStop, 
            endStop, 
            remainingStops, 
            targetCumulativeDistance - cumulativeDistance,
            totalDistance - cumulativeDistance
          );

      if (!dayDestination) continue;

      // Select stops for this segment
      const segmentStops = this.selectSegmentStops(currentStop, dayDestination, remainingStops);
      
      // Calculate distances and timings
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const subStopTimings = this.calculateValidSubStopTimings(currentStop, dayDestination, segmentStops);
      const totalSegmentDriveTime = subStopTimings.reduce((total, timing) => total + timing.driveTimeHours, 0);

      // Determine route section
      const progressPercent = ((cumulativeDistance + segmentDistance) / totalDistance) * 100;
      const routeSection = this.getRouteSection(progressPercent);

      const startCityDisplay = CityDisplayService.getCityDisplayName(currentStop);
      const endCityDisplay = CityDisplayService.getCityDisplayName(dayDestination);

      dailySegments.push({
        day,
        title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
        startCity: startCityDisplay,
        endCity: endCityDisplay,
        approximateMiles: Math.round(segmentDistance),
        recommendedStops: segmentStops,
        driveTimeHours: totalSegmentDriveTime > 0 ? totalSegmentDriveTime : Math.round((segmentDistance / 55) * 10) / 10,
        subStopTimings: subStopTimings,
        routeSection
      });

      // Update for next iteration
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      currentStop = dayDestination;
      cumulativeDistance += segmentDistance;
      
      console.log(`📅 Day ${day}: ${Math.round(segmentDistance)}mi (${routeSection}), ${segmentStops.length} stops`);
    }

    return dailySegments;
  }

  /**
   * Select optimal destination for a day based on distance targets
   */
  private static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    remainingTotalDistance: number
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    let bestStop = availableStops[0];
    let bestScore = Number.MAX_VALUE;

    for (const stop of availableStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Score based on how close to target distance
      const distanceScore = Math.abs(distanceFromCurrent - targetDistance);
      
      // Bonus for major stops and destination cities
      const importanceBonus = (stop.is_major_stop ? -100 : 0) + 
                             (stop.category === 'destination_city' ? -50 : 0);
      
      const finalScore = distanceScore + importanceBonus;

      if (finalScore < bestScore && distanceFromCurrent >= 10) { // Minimum 10 miles
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Select appropriate stops for a segment
   */
  private static selectSegmentStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[]
  ): TripStop[] {
    return RouteStopSelectionService.selectStopsForSegment(startStop, endStop, availableStops, 3);
  }

  /**
   * Calculate sub-stop timings with validation
   */
  private static calculateValidSubStopTimings(
    startStop: TripStop,
    endStop: TripStop,
    segmentStops: TripStop[]
  ): SubStopTiming[] {
    const timings: SubStopTiming[] = [];
    const fullPath = [startStop, ...segmentStops, endStop];
    
    for (let i = 0; i < fullPath.length - 1; i++) {
      const fromStop = fullPath[i];
      const toStop = fullPath[i + 1];
      
      // Validate segment before creating timing
      if (!StopEnhancementService.isValidSegment(fromStop, toStop)) {
        console.log(`⚠️ Skipping invalid segment: ${fromStop.name} to ${toStop.name}`);
        continue;
      }
      
      const distance = DistanceCalculationService.calculateDistance(
        fromStop.latitude, fromStop.longitude,
        toStop.latitude, toStop.longitude
      );
      
      const driveTime = distance / 55; // 55 mph average
      
      timings.push({
        fromStop,
        toStop,
        distanceMiles: Math.round(distance * 10) / 10,
        driveTimeHours: Math.round(driveTime * 10) / 10
      });
    }
    
    return timings;
  }

  /**
   * Determine route section based on progress percentage
   */
  private static getRouteSection(progressPercent: number): string {
    if (progressPercent <= 33) return 'Early Route';
    if (progressPercent <= 66) return 'Mid Route';
    return 'Final Stretch';
  }
}
