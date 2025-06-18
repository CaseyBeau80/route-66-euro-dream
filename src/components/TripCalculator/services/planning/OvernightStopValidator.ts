
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export class OvernightStopValidator {
  /**
   * Validate overnight stops and return warnings
   */
  static validateOvernightStops(overnightStops: TripStop[]): string[] {
    const warnings: string[] = [];
    
    overnightStops.forEach((stop: TripStop) => {
      if (!this.isValidTripStop(stop)) {
        warnings.push(`Invalid stop data found and was removed from overnight stops`);
        return;
      }
      
      // Access name property BEFORE the type guard check to avoid type narrowing issues
      const stopName = stop.name || 'Unknown Stop';
      const isDestCity = StrictDestinationCityEnforcer.isDestinationCity(stop);
      
      if (!isDestCity) {
        warnings.push(`${stopName} is not a destination city and was removed from overnight stops`);
      }
    });
    
    return warnings;
  }
  
  /**
   * Type guard function to ensure proper type inference
   */
  private static isValidTripStop(stop: any): stop is TripStop {
    return stop && 
           typeof stop === 'object' && 
           typeof stop.name === 'string' &&
           typeof stop.id === 'string';
  }
}
