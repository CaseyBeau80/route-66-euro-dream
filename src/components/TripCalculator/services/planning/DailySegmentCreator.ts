
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { SegmentCreationLoop } from './SegmentCreationLoop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentTiming, DailySegment, DriveTimeCategory, RecommendedStop } from './TripPlanBuilder';

// Re-export types for backward compatibility
export type { SegmentTiming, DailySegment };

// Redefine DailySegmentCreatorResult with compatible types
export interface DailySegmentCreatorResult extends Omit<DailySegment, 'driveTimeCategory'> {
  title: string;
  distance: number; // Distance in miles
  drivingTime: number; // Driving time in hours
  recommendedStops: RecommendedStop[]; // Change from TripStop[] to RecommendedStop[]
  attractions?: string[] | any[]; // List of attraction names
  subStopTimings: SegmentTiming[]; // Timings for sub-stops
  routeSection: string;
  driveTimeCategory: {
    category: 'short' | 'optimal' | 'long' | 'extreme';
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
   * FIXED: Use the actual trip days requested, not auto-calculated
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    requestedTotalDays: number, // Use the REQUESTED days, not calculated
    totalDistance: number
  ): DailySegment[] {
    console.log(`📊 Creating ${requestedTotalDays} balanced daily segments for ${Math.round(totalDistance)} mile trip (USING REQUESTED DAYS)`);

    // Create destinations for each day (excluding start/end)
    const destinations = this.selectDestinations(startStop, endStop, enhancedStops, requestedTotalDays);
    
    // Calculate drive time targets for balanced segments
    const driveTimeTargets = this.calculateDriveTimeTargets(totalDistance, requestedTotalDays);
    
    // Enhanced balance metrics
    const balanceMetrics = {
      totalDistance,
      totalDays: requestedTotalDays, // Use requested days
      targetAverageDriveTime: totalDistance / requestedTotalDays / 60, // Using 60 mph for realistic average
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

    console.log(`✅ Created ${validatedSegments.length} daily segments with enhanced balance metrics (REQUESTED: ${requestedTotalDays} days)`);
    return validatedSegments;
  }

  /**
   * Validate and fix segment data for consistency - IMPROVED VALIDATION
   */
  private static validateAndFixSegmentData(segments: DailySegment[]): DailySegment[] {
    return segments.map(segment => {
      // Calculate realistic drive time based on distance
      const realisticDriveTime = this.calculateRealisticDriveTime(segment.distance || segment.approximateMiles || 0);
      
      // Use the more realistic value between calculated and existing
      const currentDriveTime = segment.drivingTime || segment.driveTimeHours || 0;
      let validatedDriveTime = realisticDriveTime;
      
      // If current drive time seems unrealistic (too high), use calculated
      if (currentDriveTime > realisticDriveTime * 2) {
        console.warn(`⚠️ Day ${segment.day}: Correcting excessive drive time from ${currentDriveTime.toFixed(1)}h to ${validatedDriveTime.toFixed(1)}h for ${segment.distance}mi`);
      } else if (currentDriveTime > 0 && Math.abs(currentDriveTime - realisticDriveTime) < 2) {
        // If current time is reasonable and close to calculated, keep it
        validatedDriveTime = currentDriveTime;
      }

      // Set default title if missing
      const title = segment.title || `Day ${segment.day}: ${segment.startCity} to ${segment.endCity}`;

      return {
        ...segment,
        title,
        drivingTime: validatedDriveTime,
        driveTimeHours: validatedDriveTime,
        // Ensure distance is consistent
        distance: Math.max(segment.distance || segment.approximateMiles || 0, 1),
        approximateMiles: Math.round(segment.distance || segment.approximateMiles || 0),
        // Ensure these properties exist with at least empty arrays
        subStopTimings: segment.subStopTimings || [],
        attractions: segment.attractions || [],
        // Ensure routeSection exists 
        routeSection: segment.routeSection || `Route 66 - Day ${segment.day}`,
        // Ensure driveTimeCategory has required structure
        driveTimeCategory: segment.driveTimeCategory || {
          category: 'optimal',
          message: 'Optimal driving time',
          color: 'blue'
        }
      };
    });
  }

  /**
   * Calculate realistic drive time based on distance
   */
  private static calculateRealisticDriveTime(distance: number): number {
    let avgSpeed: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed roads
    } else {
      avgSpeed = 65; // Highway
    }
    
    const baseTime = distance / avgSpeed;
    const bufferMultiplier = distance < 100 ? 1.1 : 1.05;
    
    return Math.max(baseTime * bufferMultiplier, 0.5);
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
    // Use realistic speed calculation - 60 mph average for Route 66
    const averageDriveTime = totalDistance / totalDays / 60;
    const targets: DriveTimeTarget[] = [];

    for (let day = 1; day <= totalDays; day++) {
      targets.push({
        day,
        targetHours: averageDriveTime,
        minHours: Math.max(averageDriveTime * 0.7, 1.0), // Minimum 1 hour
        maxHours: Math.min(averageDriveTime * 1.3, 6.0), // Maximum 6 hours
        priority: 'balanced'
      });
    }

    return targets;
  }
}
