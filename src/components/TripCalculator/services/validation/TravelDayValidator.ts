
import { DistanceEstimationService } from '../utils/DistanceEstimationService';
import { TripStyleConfig } from '../planning/TripStyleLogic';
import { Route66StopsService } from '../Route66StopsService';
import { StrictDestinationCityEnforcer } from '../planning/StrictDestinationCityEnforcer';

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
   * Get maximum days based on destination cities along route
   */
  static async getMaxDaysFromDestinationCities(
    startLocation: string,
    endLocation: string
  ): Promise<number> {
    try {
      const allStops = await Route66StopsService.getAllStops();
      const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
      
      // Find start and end cities
      const startCity = destinationCities.find(city => 
        city.name.toLowerCase() === startLocation.toLowerCase() ||
        city.city_name.toLowerCase() === startLocation.toLowerCase()
      );
      const endCity = destinationCities.find(city => 
        city.name.toLowerCase() === endLocation.toLowerCase() ||
        city.city_name.toLowerCase() === endLocation.toLowerCase()
      );
      
      if (!startCity || !endCity) {
        console.log(`🏛️ Could not find cities for ${startLocation} or ${endLocation}, using conservative estimate`);
        return Math.min(8, this.ABSOLUTE_MAX_DAYS); // Conservative fallback
      }
      
      // Count cities between start and end (inclusive)
      // For Route 66, we'll use longitude as a rough ordering since it's east-west
      const startLng = startCity.longitude;
      const endLng = endCity.longitude;
      const minLng = Math.min(startLng, endLng);
      const maxLng = Math.max(startLng, endLng);
      
      const citiesAlongRoute = destinationCities.filter(city => 
        city.longitude >= minLng && city.longitude <= maxLng
      );
      
      console.log(`🏛️ DEBUG: Cities along route from ${startLocation} to ${endLocation}:`, 
        citiesAlongRoute.map(c => `${c.name} (${c.longitude})`));
      console.log(`🏛️ DEBUG: Start lng: ${startLng}, End lng: ${endLng}, Min: ${minLng}, Max: ${maxLng}`);
      
      // FIXED: For adjacent cities, maximum should be 1 day
      // Count unique stops BETWEEN start and end (exclusive of endpoints)
      const stopsExcludingEndpoints = citiesAlongRoute.filter(city => 
        city.longitude !== startLng && city.longitude !== endLng
      );
      
      // Maximum days = intermediate stops + 1 (for the journey itself)
      const maxDays = Math.max(1, stopsExcludingEndpoints.length + 1);
      console.log(`🏛️ Max days from destination cities: ${maxDays} (${stopsExcludingEndpoints.length} intermediate stops between ${startLocation} and ${endLocation})`);
      
      return Math.min(maxDays, this.ABSOLUTE_MAX_DAYS);
    } catch (error) {
      console.error('Error calculating max days from destination cities:', error);
      return this.ABSOLUTE_MAX_DAYS;
    }
  }

  /**
   * Validate travel days against route requirements with STRICT 10h enforcement
   */
  static async validateTravelDays(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): Promise<DayValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    console.log('🔍 FULL DEBUG TravelDayValidator.validateTravelDays START:', {
      startLocation,
      endLocation,
      requestedDays,
      styleConfig,
      timestamp: new Date().toISOString()
    });
    
    // Get the ACTUAL maximum days based on destination cities along the route
    const maxDaysFromCities = await this.getMaxDaysFromDestinationCities(startLocation, endLocation);
    console.log(`🏛️ Maximum days from destination cities: ${maxDaysFromCities}`);
    
    // CRITICAL: Hard enforcement of bounds based on destination cities
    if (requestedDays < this.ABSOLUTE_MIN_DAYS) {
      issues.push(`Minimum ${this.ABSOLUTE_MIN_DAYS} day required for any Route 66 trip`);
      console.log('🔍 FULL DEBUG: Below minimum days');
    }
    
    if (requestedDays > maxDaysFromCities) {
      issues.push(`Maximum ${maxDaysFromCities} days available for this route (based on destination cities)`);
      console.log('🔍 FULL DEBUG: Above maximum days from destination cities');
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
        maxDaysRecommended: maxDaysFromCities,
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
    
    // Calculate maximum recommended days (capped by destination cities)
    const maxDaysRecommended = Math.min(maxDaysFromCities, Math.ceil(adjustedDistance / 100));
    
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
                   requestedDays <= maxDaysFromCities && 
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
  static async isValidDayCount(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): Promise<boolean> {
    // Quick check: must be within absolute minimum
    if (requestedDays < this.ABSOLUTE_MIN_DAYS) {
      return false;
    }
    
    // Check against destination city count
    const maxDaysFromCities = await this.getMaxDaysFromDestinationCities(startLocation, endLocation);
    if (requestedDays > maxDaysFromCities) {
      return false;
    }
    
    const result = await this.validateTravelDays(startLocation, endLocation, requestedDays, styleConfig);
    return result.isValid;
  }
  
  /**
   * Get minimum days required for a route
   */
  static async getMinimumDays(
    startLocation: string,
    endLocation: string,
    styleConfig: TripStyleConfig
  ): Promise<number> {
    const result = await this.validateTravelDays(startLocation, endLocation, 1, styleConfig);
    return result.minDaysRequired;
  }
}
