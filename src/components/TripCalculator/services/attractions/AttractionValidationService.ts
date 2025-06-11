
import { TripStop } from '../../types/TripStop';

export class AttractionValidationService {
  static validateStopData(stop: TripStop): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!stop.id) issues.push('Missing stop ID');
    if (!stop.name) issues.push('Missing stop name');
    if (!stop.city_name) issues.push('Missing city name');
    if (!stop.state) issues.push('Missing state');
    if (typeof stop.latitude !== 'number' || stop.latitude === 0) issues.push('Invalid latitude');
    if (typeof stop.longitude !== 'number' || stop.longitude === 0) issues.push('Invalid longitude');
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static validateDestinationCity(city: TripStop, cityName: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!city) {
      issues.push(`Destination city "${cityName}" not found in database`);
      return { isValid: false, issues };
    }

    const validation = this.validateStopData(city);
    if (!validation.isValid) {
      issues.push(`Destination city "${cityName}" has invalid data: ${validation.issues.join(', ')}`);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
