
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { SegmentCreationLoop } from './SegmentCreationLoop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentTiming } from './SubStopTimingCalculator';

// Re-export types for backward compatibility
export type { SegmentTiming };

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  distance: number; // Distance in miles
  drivingTime: number; // Driving time in hours
  driveTimeHours: number; // Alternative name for drivingTime
  recommendedStops: TripStop[];
  attractions?: string[]; // List of attraction names
  subStopTimings: SegmentTiming[]; // Changed from SubStopTiming to SegmentTiming
  routeSection: string;
  driveTimeCategory: {
    category: string;
    color: string;
    message: string; // Changed from description to message
  };
  balanceMetrics?: any;
  destination?: {
    city: string;
    state?: string;
  };
}

export class DailySegmentCreator {
  /**
   * Create balanced daily segments using enhanced drive time balancing
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`📊 Creating ${totalDays} balanced daily segments for ${Math.round(totalDistance)} mile trip`);

    // Create destinations for each day (excluding start/end)
    const destinations = this.selectDestinations(startStop, endStop, enhancedStops, totalDays);
    
    // Calculate drive time targets for balanced segments
    const driveTimeTargets = this.calculateDriveTimeTargets(totalDistance, totalDays);
    
    // Enhanced balance metrics
    const balanceMetrics = {
      totalDistance,
      totalDays,
      targetAverageDriveTime: totalDistance / totalDays / 65, // Assuming 65 mph average
      balanceStrategy: 'enhanced_geographic_diversity'
    };

    // Create the daily segments
    const dailySegments = SegmentCreationLoop.createDailySegments(
      startStop,
      destinations,
      endStop,
      enhancedStops,
      totalDistance,
      driveTimeTargets,
      balanceMetrics
    );

    console.log(`✅ Created ${dailySegments.length} daily segments with enhanced balance metrics`);
    return dailySegments;
  }

  private static selectDestinations(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    const destinations: TripStop[] = [];
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    ) / totalDays;

    // Select destinations based on distance intervals
    for (let day = 1; day < totalDays; day++) {
      const targetDistance = segmentDistance * day;
      const destination = this.findNearestStop(startStop, enhancedStops, targetDistance);
      if (destination) {
        destinations.push(destination);
      }
    }

    return destinations;
  }

  private static findNearestStop(
    startStop: TripStop,
    stops: TripStop[],
    targetDistance: number
  ): TripStop | null {
    let nearestStop: TripStop | null = null;
    let minDistanceDiff = Infinity;

    for (const stop of stops) {
      const distance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const distanceDiff = Math.abs(distance - targetDistance);
      
      if (distanceDiff < minDistanceDiff) {
        minDistanceDiff = distanceDiff;
        nearestStop = stop;
      }
    }

    return nearestStop;
  }

  private static calculateDriveTimeTargets(
    totalDistance: number,
    totalDays: number
  ): DriveTimeTarget[] {
    const averageDriveTime = (totalDistance / totalDays) / 65; // 65 mph average
    const targets: DriveTimeTarget[] = [];

    for (let day = 1; day <= totalDays; day++) {
      targets.push({
        day, // Add the day property
        targetHours: averageDriveTime,
        minHours: averageDriveTime * 0.7,
        maxHours: averageDriveTime * 1.3,
        priority: 'balanced'
      });
    }

    return targets;
  }
}
