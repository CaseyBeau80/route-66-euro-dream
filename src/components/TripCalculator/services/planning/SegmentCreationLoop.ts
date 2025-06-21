
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { DailySegment, DriveTimeCategory, RecommendedStop, SegmentTiming } from './TripPlanTypes';
import { SegmentStopCurator } from './SegmentStopCurator';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { SegmentMetricsCalculator } from './SegmentMetricsCalculator';
import { SegmentValidationHelper } from './SegmentValidationHelper';

export class SegmentCreationLoop {
  /**
   * Create all daily segments through iterative loop
   */
  static async createDailySegments(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any
  ): Promise<DailySegment[]> {
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
      const segment = await this.createSingleSegment(
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
  private static async createSingleSegment(
    currentStop: TripStop,
    dayDestination: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    dailySegments: DailySegment[],
    day: number,
    driveTimeTarget: DriveTimeTarget,
    balanceMetrics: any
  ): Promise<DailySegment | null> {
    // Curate stops for this segment
    const { segmentStops, curatedSelection } = SegmentStopCurator.curateStopsForSegment(
      currentStop,
      dayDestination,
      remainingStops
    );
    
    console.log(`🎯 Day ${day} curated ${segmentStops.length} stops:`, segmentStops.map(s => s.name));
    
    // Calculate segment timings and drive time - now with await
    const { segmentTimings, totalSegmentDriveTime, segmentDistance, isGoogleMapsData, dataAccuracy } = 
      await SegmentTimingCalculator.calculateSegmentTimings(currentStop, dayDestination, segmentStops);

    // Get drive time category for this segment - Fix type by creating proper DriveTimeCategory object
    const categoryType = SegmentTimingCalculator.categorizedriveTime(totalSegmentDriveTime);
    const driveTimeCategory: DriveTimeCategory = {
      category: categoryType,
      message: this.getDriveTimeMessage(categoryType),
      color: this.getDriveTimeColor(categoryType)
    };

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
      city: stop.city || stop.city_name,
      category: stop.category || 'attraction'
    }));

    // Convert TripStop[] to RecommendedStop[] to satisfy type requirements with stopId
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
      stopId: stop.id,
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name
    }));

    // Convert segmentTimings to SubStopTiming format with required properties
    const subStopTimings = segmentTimings.map(timing => ({
      ...timing,
      distance: timing.distanceMiles, // Add required distance property
      drivingTime: timing.driveTimeHours // Add required drivingTime property
    }));

    // Build the daily segment with all required properties
    const dailySegment: DailySegment = {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      driveTimeHours: totalSegmentDriveTime,
      drivingTime: totalSegmentDriveTime,
      destination: {
        city: dayDestination.city || dayDestination.city_name,
        state: dayDestination.state
      },
      recommendedStops,
      isGoogleMapsData,
      attractions,
      subStopTimings,
      routeSection,
      driveTimeCategory,
      dataAccuracy
    };

    return dailySegment;
  }

  /**
   * Get drive time message based on category
   */
  private static getDriveTimeMessage(category: 'short' | 'optimal' | 'long' | 'extreme'): string {
    switch (category) {
      case 'short': return 'Light driving day - plenty of time for sightseeing';
      case 'optimal': return 'Balanced driving and exploration time';
      case 'long': return 'Long driving day - plan your stops carefully';
      case 'extreme': return 'Very long driving day - consider breaking this segment';
      default: return 'Moderate driving day';
    }
  }

  /**
   * Get drive time color based on category
   */
  private static getDriveTimeColor(category: 'short' | 'optimal' | 'long' | 'extreme'): string {
    switch (category) {
      case 'short': return 'text-green-600';
      case 'optimal': return 'text-blue-600';
      case 'long': return 'text-orange-600';
      case 'extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Log segment creation details
   */
  private static logSegmentCreation(segment: DailySegment, day: number, destination: TripStop): void {
    console.log(`✅ Day ${day} segment created: ${segment.startCity} → ${segment.endCity} (${segment.distance.toFixed(1)}mi, ${segment.driveTimeHours.toFixed(1)}h)`);
  }
}
