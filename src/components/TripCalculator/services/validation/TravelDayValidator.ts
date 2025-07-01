
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
  private static readonly ROUTE66_AVERAGE_SPEED = 45; // More realistic Route 66 speed (was 50)
  private static readonly SAFETY_BUFFER = 1.15; // 15% safety buffer for Route 66 conditions
  
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
    
    console.log('🔍 FULL DEBUG TravelDayValidator.validateTravelDays START:', {
      startLocation,
      endLocation,
      requestedDays,
      styleConfig,
      timestamp: new Date().toISOString()
    });
    
    // CRITICAL: Hard enforcement of absolute bounds
    if (requestedDays < this.ABSOLUTE_MIN_DAYS) {
      issues.push(`Minimum ${this.ABSOLUTE_MIN_DAYS} day required for any Route 66 trip`);
      console.log('🔍 FULL DEBUG: Below minimum days');
    }
    
    if (requestedDays > this.ABSOLUTE_MAX_DAYS) {
      issues.push(`Maximum ${this.ABSOLUTE_MAX_DAYS} days supported by the planner - please reduce your trip duration`);
      console.log('🔍 FULL DEBUG: Above maximum days');
    }

    // Get estimated distance
    const estimatedDistance = DistanceEstimationService.estimateDistance(
      startLocation,
      endLocation
    );
    
    console.log('🔍 FULL DEBUG: Distance estimation:', {
      estimatedDistance,
      hasDistance: !!estimatedDistance
    });
    
    if (!estimatedDistance) {
      console.log('🔍 FULL DEBUG: No distance - returning error result');
      return {
        isValid: false,
        minDaysRequired: this.ABSOLUTE_MIN_DAYS,
        maxDaysRecommended: this.ABSOLUTE_MAX_DAYS,
        currentDays: requestedDays,
        issues: ['Cannot calculate distance for this route'],
        recommendations: ['Please select valid start and end locations']
      };
    }
    
    // FIXED: More conservative calculation with safety buffer for Route 66
    const adjustedDistance = estimatedDistance * this.SAFETY_BUFFER;
    const minDaysForAbsoluteSafety = Math.ceil(adjustedDistance / (this.MAX_DAILY_DRIVE_HOURS * this.ROUTE66_AVERAGE_SPEED));
    const minDaysForStyle = Math.ceil(adjustedDistance / (styleConfig.maxDailyDriveHours * this.ROUTE66_AVERAGE_SPEED));
    const minDaysRequired = Math.max(this.ABSOLUTE_MIN_DAYS, minDaysForAbsoluteSafety, minDaysForStyle);
    
    console.log('🔍 FULL DEBUG: FIXED Day calculations:', {
      estimatedDistance,
      adjustedDistance,
      route66Speed: this.ROUTE66_AVERAGE_SPEED,
      safetyBuffer: this.SAFETY_BUFFER,
      minDaysForAbsoluteSafety,
      minDaysForStyle,
      minDaysRequired,
      requestedDays,
      needsAdjustment: minDaysRequired > requestedDays,
      calculation: `${adjustedDistance.toFixed(0)} miles / (${this.MAX_DAILY_DRIVE_HOURS} hours * ${this.ROUTE66_AVERAGE_SPEED} mph) = ${minDaysForAbsoluteSafety} days`
    });
    
    // Calculate maximum recommended days (capped at 14 days)
    const maxDaysRecommended = Math.min(this.ABSOLUTE_MAX_DAYS, Math.ceil(adjustedDistance / 100));
    
    // CRITICAL FIX: Check if minimum days required is greater than requested days
    if (minDaysRequired > requestedDays) {
      console.log('🔥 FULL DEBUG: DAY ADJUSTMENT TRIGGERED!');
      issues.push(`Route requires minimum ${minDaysRequired} days for safe daily driving limits`);
      recommendations.push(`Increase trip duration to ${minDaysRequired} days to ensure safe daily drives`);
    }
    
    // Check STRICT 10-hour constraint with new speed
    if (requestedDays >= this.ABSOLUTE_MIN_DAYS && requestedDays <= this.ABSOLUTE_MAX_DAYS) {
      const averageDailyHours = adjustedDistance / requestedDays / this.ROUTE66_AVERAGE_SPEED;
      
      console.log('🔍 FULL DEBUG: Daily driving hours with new calculation:', {
        averageDailyHours,
        exceedsLimit: averageDailyHours > this.MAX_DAILY_DRIVE_HOURS
      });
      
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
    
    // CRITICAL FIX: Trip is INVALID if it needs adjustment OR has hard limit violations
    const isValid = requestedDays >= this.ABSOLUTE_MIN_DAYS && 
                   requestedDays <= this.ABSOLUTE_MAX_DAYS && 
                   requestedDays >= minDaysRequired; // MUST meet minimum requirement
    
    const result = {
      isValid,
      minDaysRequired,
      maxDaysRecommended,
      currentDays: requestedDays,
      issues,
      recommendations
    };
    
    console.log('🔥 FULL DEBUG: TravelDayValidator final result (FIXED):', {
      ...result,
      willTriggerAdjustment: !isValid && minDaysRequired > requestedDays,
      improvedCalculation: `${this.ROUTE66_AVERAGE_SPEED}mph avg speed, ${this.SAFETY_BUFFER}x safety buffer`
    });
    
    return result;
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
