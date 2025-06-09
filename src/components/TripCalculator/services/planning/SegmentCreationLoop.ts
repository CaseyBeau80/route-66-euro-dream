
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { DailySegment, DriveTimeCategory, RecommendedStop, SegmentTiming } from './TripPlanBuilder';
import { SegmentStopCurator } from './SegmentStopCurator';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { SegmentMetricsCalculator } from './SegmentMetricsCalculator';
import { SegmentValidationHelper } from './SegmentValidationHelper';

export class SegmentCreationLoop {
  /**
   * Create all daily segments through iterative loop
   */
  static createDailySegments(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any
  ): DailySegment[] {
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    let workingRemainingStops = [...remainingStops];

    const totalDays = destinations.length + 1;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];
      const driveTimeTarget = driveTimeTargets[day - 1];

      // Validate segment
      if (!SegmentValidationHelper.validateDestination(currentStop, dayDestination, day)) {
        continue;
      }

      // Create the segment
      const segment = this.createSingleSegment(
        currentStop,
        dayDestination,
        workingRemainingStops,
        totalDistance,
        dailySegments,
        day,
        driveTimeTarget,
        balanceMetrics
      );

      if (segment) {
        dailySegments.push(segment);

        // Update for next iteration - use the actual segment stops that were selected
        // Convert RecommendedStop to TripStop if needed
        const tripStops = segment.recommendedStops?.map(stop => ({
          ...stop,
          description: stop.description || `Discover ${stop.name} along your Route 66 journey`,
          category: stop.category || 'attraction',
          city_name: stop.city_name || 'Unknown',
          city: stop.city || stop.city_name || 'Unknown',
          state: stop.state || 'Unknown',
        } as TripStop)) || [];
        
        workingRemainingStops = SegmentStopCurator.removeUsedStops(
          workingRemainingStops, 
          tripStops
        );
        currentStop = dayDestination;

        // Log segment creation
        this.logSegmentCreation(segment, day, dayDestination);
      }
    }

    return dailySegments;
  }

  /**
   * Create a single daily segment
   */
  private static createSingleSegment(
    currentStop: TripStop,
    dayDestination: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    dailySegments: DailySegment[],
    day: number,
    driveTimeTarget: DriveTimeTarget,
    balanceMetrics: any
  ): DailySegment | null {
    // Curate stops for this segment
    const { segmentStops, curatedSelection } = SegmentStopCurator.curateStopsForSegment(
      currentStop,
      dayDestination,
      remainingStops
    );
    
    console.log(`🎯 Day ${day} curated ${segmentStops.length} stops:`, segmentStops.map(s => s.name));
    
    // Calculate segment timings and drive time
    const { segmentTimings, totalSegmentDriveTime, segmentDistance } = 
      SegmentTimingCalculator.calculateSegmentTimings(currentStop, dayDestination, segmentStops);

    // Get drive time category for this segment
    const driveTimeCategory = SegmentTimingCalculator.getDriveTimeCategory(totalSegmentDriveTime) as DriveTimeCategory;

    // Calculate route progression metrics
    const { routeSection } = SegmentMetricsCalculator.calculateRouteMetrics(
      day, 
      segmentDistance, 
      totalDistance, 
      dailySegments
    );

    // Create city display names with state information
    const { startCityDisplay, endCityDisplay } = SegmentMetricsCalculator.createCityDisplays(
      currentStop, 
      dayDestination
    );

    // Create attractions list with proper object structure
    const attractions = segmentStops.map(stop => ({
      name: stop.name,
      title: stop.name,
      description: stop.description,
      city: stop.city || stop.city_name
    }));

    // Convert TripStop[] to RecommendedStop[] to satisfy type requirements
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name || 'Unknown'
    }));

    // Convert SubStopTiming[] to SegmentTiming[] to match TripPlanBuilder interface
    const convertedSegmentTimings: SegmentTiming[] = segmentTimings.map(timing => ({
      fromStop: timing.fromStop,
      toStop: timing.toStop,
      distance: timing.distance,
      driveTime: timing.drivingTime, // Map drivingTime to driveTime
      distanceMiles: timing.distanceMiles,
      driveTimeHours: timing.driveTimeHours,
      drivingTime: timing.drivingTime
    }));

    return {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      approximateMiles: Math.round(segmentDistance),
      distance: segmentDistance,
      drivingTime: totalSegmentDriveTime,
      driveTimeHours: Math.round(totalSegmentDriveTime * 10) / 10,
      recommendedStops,
      attractions,
      subStopTimings: convertedSegmentTimings,
      routeSection,
      driveTimeCategory,
      destination: {
        city: dayDestination.name,
        state: dayDestination.state
      }
      // REMOVED: balanceMetrics property - not part of DailySegment interface
    };
  }

  /**
   * Log segment creation details
   */
  private static logSegmentCreation(
    segment: DailySegment,
    day: number,
    dayDestination: TripStop
  ): void {
    console.log(`✅ Day ${day}: ${segment.approximateMiles}mi to ${dayDestination.name} (${dayDestination.category}), ${segment.driveTimeHours}h drive (${segment.driveTimeCategory?.category}), ${segment.recommendedStops?.length} curated stops, ${segment.routeSection}`);
  }
}
