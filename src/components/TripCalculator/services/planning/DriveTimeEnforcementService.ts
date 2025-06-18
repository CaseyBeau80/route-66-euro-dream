
import { DailySegment } from './TripPlanTypes';
import { TripStyleConfig } from './TripStyleLogic';
import { TripStop } from '../../types/TripStop';

export interface ValidationResult {
  isValid: boolean;
  actualDriveTime: number;
  actualDistance: number;
  maxAllowed: number;
  needsSplitting: boolean;
  recommendedSplits: number;
  recommendation?: string;
}

export class DriveTimeEnforcementService {
  static enforceDriveTimeLimits(segments: DailySegment[], styleConfig: TripStyleConfig): DailySegment[] {
    return segments.map(segment => {
      if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
        console.warn(`Capping drive time for day ${segment.day} from ${segment.driveTimeHours}h to ${styleConfig.maxDailyDriveHours}h`);
        return {
          ...segment,
          driveTimeHours: styleConfig.maxDailyDriveHours,
          drivingTime: styleConfig.maxDailyDriveHours
        };
      }
      return segment;
    });
  }

  static validateAndFixSegmentDistance(
    segment: DailySegment, 
    styleConfig: TripStyleConfig
  ): DailySegment {
    // Validate and fix segment if drive time exceeds limits
    if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
      const maxDistance = styleConfig.maxDailyDriveHours * 50; // Assuming 50 mph average
      
      console.warn(`Fixing segment distance from ${segment.distance} to ${maxDistance} miles`);
      
      return {
        ...segment,
        distance: maxDistance,
        approximateMiles: maxDistance,
        driveTimeHours: styleConfig.maxDailyDriveHours,
        drivingTime: styleConfig.maxDailyDriveHours
      };
    }
    
    return segment;
  }

  // Added missing method for validation between two stops
  static validateSegmentDriveTime(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): ValidationResult {
    const distance = this.calculateDistance(startStop, endStop);
    const driveTime = distance / 55; // Assuming 55 mph average speed
    
    const isValid = driveTime <= styleConfig.maxDailyDriveHours;
    const needsSplitting = driveTime > styleConfig.maxDailyDriveHours;
    const recommendedSplits = needsSplitting ? Math.ceil(driveTime / styleConfig.maxDailyDriveHours) : 1;
    
    return {
      isValid,
      actualDriveTime: driveTime,
      actualDistance: distance,
      maxAllowed: styleConfig.maxDailyDriveHours,
      needsSplitting,
      recommendedSplits,
      recommendation: needsSplitting ? `Consider splitting into ${recommendedSplits} segments` : undefined
    };
  }

  private static calculateDistance(startStop: TripStop, endStop: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(endStop.latitude - startStop.latitude);
    const dLon = this.toRad(endStop.longitude - startStop.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(startStop.latitude)) * Math.cos(this.toRad(endStop.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
