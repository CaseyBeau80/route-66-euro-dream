import { DailySegment } from './DailySegmentCreator';
import { DriveTimeCategory } from './TripPlanBuilder';

export interface DriveTimeValidationResult {
  isValid: boolean;
  issues: string[];
  adjustedSegments?: DailySegment[];
}

export class DriveTimeValidationService {
  private static readonly MAX_DAILY_DRIVE_TIME = 10; // hours
  private static readonly MIN_DAILY_DRIVE_TIME = 0.5; // hours
  private static readonly RECOMMENDED_MAX_DRIVE_TIME = 8; // hours

  /**
   * Validate drive times across all segments and fix issues
   */
  static validateAndFixDriveTimes(segments: DailySegment[]): DriveTimeValidationResult {
    const issues: string[] = [];
    const adjustedSegments: DailySegment[] = [];

    for (const segment of segments) {
      const adjustedSegment = this.validateSegmentDriveTime(segment);
      
      if (adjustedSegment.drivingTime !== segment.drivingTime) {
        issues.push(`Day ${segment.day}: Adjusted drive time from ${segment.drivingTime.toFixed(1)}h to ${adjustedSegment.drivingTime.toFixed(1)}h`);
      }

      adjustedSegments.push(adjustedSegment);
    }

    // Check for overall balance
    const totalDriveTime = adjustedSegments.reduce((sum, seg) => sum + seg.drivingTime, 0);
    const averageDriveTime = totalDriveTime / adjustedSegments.length;
    
    if (averageDriveTime > this.RECOMMENDED_MAX_DRIVE_TIME) {
      issues.push(`Average daily drive time (${averageDriveTime.toFixed(1)}h) exceeds recommended maximum (${this.RECOMMENDED_MAX_DRIVE_TIME}h)`);
    }

    const isValid = issues.length === 0;

    if (!isValid) {
      console.warn('🚨 Drive time validation issues found:', issues);
    } else {
      console.log('✅ All drive times are within acceptable ranges');
    }

    return {
      isValid,
      issues,
      adjustedSegments
    };
  }

  /**
   * Validate and fix a single segment's drive time
   */
  private static validateSegmentDriveTime(segment: DailySegment): DailySegment {
    let adjustedDriveTime = segment.drivingTime;

    // Fix extreme values
    if (adjustedDriveTime > this.MAX_DAILY_DRIVE_TIME) {
      adjustedDriveTime = this.MAX_DAILY_DRIVE_TIME;
    } else if (adjustedDriveTime < this.MIN_DAILY_DRIVE_TIME) {
      adjustedDriveTime = this.MIN_DAILY_DRIVE_TIME;
    }

    // If drive time was adjusted, recalculate dependent values
    if (adjustedDriveTime !== segment.drivingTime) {
      return {
        ...segment,
        drivingTime: adjustedDriveTime,
        driveTimeHours: adjustedDriveTime,
        // Update drive time category if needed
        driveTimeCategory: this.calculateDriveTimeCategory(adjustedDriveTime)
      };
    }

    return segment;
  }

  /**
   * Calculate drive time category for validation
   */
  private static calculateDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours < 3) {
      return {
        category: 'short',
        color: 'text-green-700',
        message: 'Short drive day - perfect for exploring attractions along the way'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        color: 'text-blue-700',
        message: 'Optimal drive time - balanced between driving and sightseeing'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        color: 'text-orange-700',
        message: 'Long drive day - consider breaking up with more stops'
      };
    } else {
      return {
        category: 'extreme',
        color: 'text-red-700',
        message: 'Very long drive - recommend splitting this day'
      };
    }
  }

  /**
   * Check if trip needs additional days due to excessive drive times
   */
  static recommendTripExtension(segments: DailySegment[]): {
    shouldExtend: boolean;
    recommendedDays: number;
    reason: string;
  } {
    const extremeDays = segments.filter(seg => seg.drivingTime > this.RECOMMENDED_MAX_DRIVE_TIME);
    
    if (extremeDays.length === 0) {
      return {
        shouldExtend: false,
        recommendedDays: segments.length,
        reason: 'Current trip duration is appropriate'
      };
    }

    const additionalDaysNeeded = Math.ceil(extremeDays.length * 0.5);
    
    return {
      shouldExtend: true,
      recommendedDays: segments.length + additionalDaysNeeded,
      reason: `${extremeDays.length} days exceed recommended drive time. Consider extending trip by ${additionalDaysNeeded} day(s)`
    };
  }
}
