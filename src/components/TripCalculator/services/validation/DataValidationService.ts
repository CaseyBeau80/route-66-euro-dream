import { TripStop } from '../../types/TripStop';
import { DailySegment, TripPlan } from '../planning/TripPlanBuilder';
import { ErrorHandlingService } from '../error/ErrorHandlingService';

export class DataValidationService {
  /**
   * Validate a trip stop object
   */
  static validateTripStop(stop: any, context: string = 'TripStop'): stop is TripStop {
    if (!stop || typeof stop !== 'object') {
      ErrorHandlingService.logError(
        new Error(`Invalid stop object in ${context}`),
        'DataValidation'
      );
      return false;
    }

    const requiredFields = ['id', 'name', 'category'];
    const missingFields = requiredFields.filter(field => !stop[field]);
    
    if (missingFields.length > 0) {
      ErrorHandlingService.logError(
        new Error(`Missing required fields in ${context}: ${missingFields.join(', ')}`),
        'DataValidation'
      );
      return false;
    }

    return true;
  }

  /**
   * Validate an array of trip stops
   */
  static validateTripStops(stops: any[], context: string = 'TripStops'): TripStop[] {
    if (!Array.isArray(stops)) {
      ErrorHandlingService.logError(
        new Error(`Expected array of stops in ${context}, got ${typeof stops}`),
        'DataValidation'
      );
      return [];
    }

    return stops.filter((stop, index) => 
      this.validateTripStop(stop, `${context}[${index}]`)
    ) as TripStop[];
  }

  /**
   * Validate a daily segment - now properly typed as a type guard
   */
  static validateDailySegment(segment: any, context: string = 'DailySegment'): segment is DailySegment {
    if (!segment || typeof segment !== 'object') {
      ErrorHandlingService.logError(
        new Error(`Invalid segment object in ${context}`),
        'DataValidation'
      );
      return false;
    }

    const requiredFields = ['day', 'startCity', 'endCity', 'driveTimeHours'];
    const missingFields = requiredFields.filter(field => segment[field] === undefined);
    
    if (missingFields.length > 0) {
      ErrorHandlingService.logError(
        new Error(`Missing required fields in ${context}: ${missingFields.join(', ')}`),
        'DataValidation'
      );
      return false;
    }

    // Validate numeric fields
    if (typeof segment.driveTimeHours !== 'number' || segment.driveTimeHours < 0) {
      ErrorHandlingService.logError(
        new Error(`Invalid driveTimeHours in ${context}: ${segment.driveTimeHours}`),
        'DataValidation'
      );
      return false;
    }

    return true;
  }

  /**
   * Validate and sanitize trip plan data
   */
  static validateTripPlan(plan: any, context: string = 'TripPlan'): TripPlan | null {
    if (!plan || typeof plan !== 'object') {
      ErrorHandlingService.logError(
        new Error(`Invalid trip plan object in ${context}`),
        'DataValidation'
      );
      return null;
    }

    try {
      // Validate required fields
      const requiredFields = ['title', 'startCity', 'endCity', 'totalDays', 'segments'];
      const missingFields = requiredFields.filter(field => plan[field] === undefined);
      
      if (missingFields.length > 0) {
        ErrorHandlingService.logError(
          new Error(`Missing required fields in ${context}: ${missingFields.join(', ')}`),
          'DataValidation'
        );
        return null;
      }

      // Validate segments array
      if (!Array.isArray(plan.segments)) {
        ErrorHandlingService.logError(
          new Error(`Invalid segments array in ${context}`),
          'DataValidation'
        );
        return null;
      }

      // Validate each segment
      const validSegments = plan.segments.filter((segment: any, index: number) =>
        this.validateDailySegment(segment, `${context}.segments[${index}]`)
      );

      // Return sanitized trip plan
      return {
        ...plan,
        segments: validSegments,
        dailySegments: validSegments, // Ensure alias is consistent
        totalDistance: typeof plan.totalDistance === 'number' ? plan.totalDistance : 0,
        totalMiles: typeof plan.totalMiles === 'number' ? plan.totalMiles : plan.totalDistance || 0,
        totalDrivingTime: typeof plan.totalDrivingTime === 'number' ? plan.totalDrivingTime : 0
      };
    } catch (error) {
      ErrorHandlingService.logError(error as Error, `${context} validation`);
      return null;
    }
  }

  /**
   * Safe array access with validation
   */
  static safeArrayAccess<T>(
    array: any,
    index: number,
    context: string,
    validator?: (item: any) => item is T
  ): T | undefined {
    if (!Array.isArray(array)) {
      ErrorHandlingService.logError(
        new Error(`Expected array in ${context}, got ${typeof array}`),
        'DataValidation'
      );
      return undefined;
    }

    if (index < 0 || index >= array.length) {
      return undefined;
    }

    const item = array[index];
    
    if (validator && !validator(item)) {
      ErrorHandlingService.logError(
        new Error(`Invalid item at index ${index} in ${context}`),
        'DataValidation'
      );
      return undefined;
    }

    return item;
  }
}
