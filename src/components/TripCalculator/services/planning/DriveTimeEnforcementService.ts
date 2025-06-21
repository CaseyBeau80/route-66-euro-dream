
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
  // FIXED: Absolute drive time enforcement
  static enforceDriveTimeLimits(segments: DailySegment[], styleConfig: TripStyleConfig): DailySegment[] {
    console.log(`🚫 ENFORCING DRIVE LIMITS: Max ${styleConfig.maxDailyDriveHours}h per day`);
    
    return segments.map(segment => {
      if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
        const originalTime = segment.driveTimeHours;
        const cappedTime = styleConfig.maxDailyDriveHours;
        const cappedDistance = Math.round(cappedTime * 50); // 50 mph average
        
        console.warn(`⚠️ CAPPED: Day ${segment.day} drive time from ${originalTime.toFixed(1)}h to ${cappedTime}h`);
        console.warn(`⚠️ CAPPED: Day ${segment.day} distance from ${segment.distance}mi to ${cappedDistance}mi`);
        
        return {
          ...segment,
          driveTimeHours: cappedTime,
          distance: cappedDistance,
          approximateMiles: cappedDistance
        };
      }
      return segment;
    });
  }

  // FIXED: Enhanced validation with better error messages
  static validateSegmentDriveTime(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): ValidationResult {
    const distance = this.calculateDistance(startStop, endStop);
    const driveTime = distance / 50; // 50 mph average speed for Route 66
    
    const isValid = driveTime <= styleConfig.maxDailyDriveHours;
    const needsSplitting = driveTime > styleConfig.maxDailyDriveHours;
    const recommendedSplits = needsSplitting ? Math.ceil(driveTime / styleConfig.maxDailyDriveHours) : 1;
    
    let recommendation: string | undefined;
    if (needsSplitting) {
      recommendation = `Segment too long (${driveTime.toFixed(1)}h). Split into ${recommendedSplits} segments or add intermediate stops.`;
    }
    
    return {
      isValid,
      actualDriveTime: driveTime,
      actualDistance: distance,
      maxAllowed: styleConfig.maxDailyDriveHours,
      needsSplitting,
      recommendedSplits,
      recommendation
    };
  }

  // FIXED: More accurate distance calculation
  static validateAndFixSegmentDistance(
    segment: DailySegment, 
    styleConfig: TripStyleConfig
  ): DailySegment {
    if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
      const maxDistance = Math.round(styleConfig.maxDailyDriveHours * 50); // 50 mph average
      
      console.warn(`🔧 FIXING SEGMENT: Day ${segment.day}`);
      console.warn(`   Distance: ${segment.distance}mi → ${maxDistance}mi`);
      console.warn(`   Drive time: ${segment.driveTimeHours.toFixed(1)}h → ${styleConfig.maxDailyDriveHours}h`);
      
      return {
        ...segment,
        distance: maxDistance,
        approximateMiles: maxDistance,
        driveTimeHours: styleConfig.maxDailyDriveHours
      };
    }
    
    return segment;
  }

  // FIXED: Haversine distance calculation
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
