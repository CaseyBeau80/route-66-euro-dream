
import { DistanceEstimationService } from '../utils/DistanceEstimationService';
import { TripStyleConfig } from '../planning/TripStyleLogic';

export interface DayValidationResult {
  isValid: boolean;
  minDaysRequired: number;
  maxDaysRecommended: number;
  currentDays: number;
  issues: string[];
  recommendations: string[];
}

export class TravelDayValidator {
  private static readonly ABSOLUTE_MIN_DAYS = 1;
  private static readonly ABSOLUTE_MAX_DAYS = 14;
  private static readonly MAX_DAILY_DRIVE_HOURS = 10; // STRICT 10-hour limit
  
  /**
   * Validate travel days against route requirements with STRICT 10h enforcement
   */
  static validateTravelDays(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): DayValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // CRITICAL: Hard enforcement of absolute bounds
    if (requestedDays < this.ABSOLUTE_MIN_DAYS) {
      issues.push(`Minimum ${this.ABSOLUTE_MIN_DAYS} day required for any Route 66 trip`);
    }
    
    if (requestedDays > this.ABSOLUTE_MAX_DAYS) {
      issues.push(`Maximum ${this.ABSOLUTE_MAX_DAYS} days supported by the planner - please reduce your trip duration`);
    }

    // Get estimated distance
    const estimatedDistance = DistanceEstimationService.estimateDistance(
      startLocation,
      endLocation
    );
    
    if (!estimatedDistance) {
      return {
        isValid: false,
        minDaysRequired: this.ABSOLUTE_MIN_DAYS,
        maxDaysRecommended: this.ABSOLUTE_MAX_DAYS,
        currentDays: requestedDays,
        issues: ['Cannot calculate distance for this route'],
        recommendations: ['Please select valid start and end locations']
      };
    }
    
    // Calculate minimum days based on STRICT 10-hour limit
    const minDaysForAbsoluteSafety = Math.ceil(estimatedDistance / (this.MAX_DAILY_DRIVE_HOURS * 50));
    const minDaysForStyle = Math.ceil(estimatedDistance / (styleConfig.maxDailyDriveHours * 50));
    const minDaysRequired = Math.max(this.ABSOLUTE_MIN_DAYS, minDaysForAbsoluteSafety, minDaysForStyle);
    
    // Calculate maximum recommended days (capped at 14 days)
    const maxDaysRecommended = Math.min(this.ABSOLUTE_MAX_DAYS, Math.ceil(estimatedDistance / 100));
    
    // Check STRICT 10-hour constraint first
    if (requestedDays >= this.ABSOLUTE_MIN_DAYS && requestedDays <= this.ABSOLUTE_MAX_DAYS) {
      const averageDailyHours = estimatedDistance / requestedDays / 50; // Assuming 50 mph average
      
      if (averageDailyHours > this.MAX_DAILY_DRIVE_HOURS) {
        issues.push(`CRITICAL: Average ${averageDailyHours.toFixed(1)}h/day exceeds 10-hour absolute maximum`);
        recommendations.push(`Add ${minDaysForAbsoluteSafety - requestedDays} more days to stay under 10-hour limit`);
      }
      
      // Style-specific requirements (only if under 10h limit)
      if (requestedDays < minDaysRequired && averageDailyHours <= this.MAX_DAILY_DRIVE_HOURS) {
        issues.push(`Too few days for ${styleConfig.style} style (${minDaysRequired}+ days recommended)`);
        recommendations.push(`Add ${minDaysRequired - requestedDays} more days for comfortable daily drives`);
      }
      
      // Check if too many days (updated for 14-day limit)
      if (requestedDays > maxDaysRecommended) {
        recommendations.push(`${requestedDays} days might be quite leisurely for this distance`);
      }
    }
    
    // CRITICAL: Form is only valid if within absolute bounds AND under 10h/day average
    const isValid = requestedDays >= this.ABSOLUTE_MIN_DAYS && 
                   requestedDays <= this.ABSOLUTE_MAX_DAYS && 
                   issues.length === 0;
    
    return {
      isValid,
      minDaysRequired,
      maxDaysRecommended,
      currentDays: requestedDays,
      issues,
      recommendations
    };
  }
  
  /**
   * Get quick validation status for form
   */
  static isValidDayCount(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): boolean {
    // Quick check: must be within absolute bounds
    if (requestedDays < this.ABSOLUTE_MIN_DAYS || requestedDays > this.ABSOLUTE_MAX_DAYS) {
      return false;
    }
    
    const result = this.validateTravelDays(startLocation, endLocation, requestedDays, styleConfig);
    return result.isValid;
  }
  
  /**
   * Get minimum days required for a route
   */
  static getMinimumDays(
    startLocation: string,
    endLocation: string,
    styleConfig: TripStyleConfig
  ): number {
    const result = this.validateTravelDays(startLocation, endLocation, 1, styleConfig);
    return result.minDaysRequired;
  }
}
