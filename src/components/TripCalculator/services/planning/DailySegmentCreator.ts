
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

    // Post-process segments to ensure data consistency
    const validatedSegments = this.validateAndFixSegmentData(dailySegments);

    console.log(`✅ Created ${validatedSegments.length} daily segments with enhanced balance metrics`);
    return validatedSegments;
  }

  /**
   * Validate and fix segment data for consistency
   */
  private static validateAndFixSegmentData(segments: DailySegment[]): DailySegment[] {
    return segments.map(segment => {
      // Ensure drivingTime and driveTimeHours are consistent
      const normalizedDriveTime = Math.max(segment.drivingTime || 0, 0.5); // Minimum 30 minutes
      
      // Validate drive time is reasonable (max 12 hours per day)
      const validatedDriveTime = Math.min(normalizedDriveTime, 12);
      
      if (validatedDriveTime !== normalizedDriveTime) {
        console.warn(`⚠️ Day ${segment.day}: Adjusted excessive drive time from ${normalizedDriveTime.toFixed(1)}h to ${validatedDriveTime.toFixed(1)}h`);
      }

      return {
        ...segment,
        drivingTime: validatedDriveTime,
        driveTimeHours: validatedDriveTime,
        // Ensure distance is consistent
        distance: Math.max(segment.distance || 0, 1),
        approximateMiles: Math.round(segment.distance || 0)
      };
    });
  }

  private static selectDestinations(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    const destinations: TripStop[] = [];
    
    // Calculate total distance for the trip
    const totalTripDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const segmentDistance = totalTripDistance / totalDays;

    // Select destinations based on distance intervals
    for (let day = 1; day < totalDays; day++) {
      const targetDistance = segmentDistance * day;
      const destination = this.findNearestStop(startStop, enhancedStops, targetDistance);
      if (destination && !destinations.find(d => d.id === destination.id)) {
        destinations.push(destination);
      }
    }

    console.log(`📍 Selected ${destinations.length} destinations for ${totalDays}-day trip`);
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
    // Use more realistic speed calculation
    const averageDriveTime = totalDistance / totalDays / 50; // 50 mph realistic average
    const targets: DriveTimeTarget[] = [];

    for (let day = 1; day <= totalDays; day++) {
      targets.push({
        day,
        targetHours: averageDriveTime,
        minHours: Math.max(averageDriveTime * 0.7, 1.0), // Minimum 1 hour
        maxHours: Math.min(averageDriveTime * 1.3, 8.0), // Maximum 8 hours
        priority: 'balanced'
      });
    }

    return targets;
  }
}
