
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
  private static readonly ABSOLUTE_MIN_DAYS = 2;
  private static readonly ABSOLUTE_MAX_DAYS = 14; // Updated from 30 to 14 days
  private static readonly MAX_DAILY_DRIVE_HOURS = 10; // Safety limit
  
  /**
   * Validate travel days against route requirements
   */
  static validateTravelDays(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): DayValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
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
    
    // Calculate minimum days based on drive time limits
    const minDaysForSafety = Math.ceil(estimatedDistance / (this.MAX_DAILY_DRIVE_HOURS * 50));
    const minDaysForStyle = Math.ceil(estimatedDistance / (styleConfig.maxDailyDriveHours * 50));
    const minDaysRequired = Math.max(this.ABSOLUTE_MIN_DAYS, minDaysForStyle);
    
    // Calculate maximum recommended days (capped at 14 days)
    const maxDaysRecommended = Math.min(this.ABSOLUTE_MAX_DAYS, Math.ceil(estimatedDistance / 100));
    
    // Check absolute bounds
    if (requestedDays < this.ABSOLUTE_MIN_DAYS) {
      issues.push(`Minimum ${this.ABSOLUTE_MIN_DAYS} days required for any Route 66 trip`);
    }
    
    if (requestedDays > this.ABSOLUTE_MAX_DAYS) {
      issues.push(`Maximum ${this.ABSOLUTE_MAX_DAYS} days supported by the planner`);
    }
    
    // Check style-specific requirements
    if (requestedDays < minDaysRequired) {
      issues.push(`Too few days for ${styleConfig.style} style (${minDaysRequired}+ days recommended)`);
      recommendations.push(`Add ${minDaysRequired - requestedDays} more days for comfortable daily drives`);
    }
    
    if (requestedDays < minDaysForSafety) {
      issues.push(`Unsafe driving hours (${(estimatedDistance / requestedDays / 50).toFixed(1)}h/day average)`);
      recommendations.push('Consider more days to stay under 10 hours of daily driving');
    }
    
    // Check if too many days (updated for 14-day limit)
    if (requestedDays > maxDaysRecommended) {
      recommendations.push(`${requestedDays} days might be quite leisurely for this distance`);
    }
    
    const isValid = issues.length === 0 && 
                   requestedDays >= this.ABSOLUTE_MIN_DAYS && 
                   requestedDays <= this.ABSOLUTE_MAX_DAYS;
    
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
