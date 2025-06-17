
import { TripStop } from '../data/SupabaseDataService';

export class CityDisplayService {
  /**
   * Get consistent city display name
   */
  static getCityDisplayName(stop: TripStop): string {
    if (!stop) return '';

    // Use name if available, otherwise fall back to city
    const cityName = stop.name || stop.city || stop.city_name || '';
    const state = stop.state || '';

    if (cityName && state) {
      // Handle cases where name already includes state
      if (cityName.includes(',') && cityName.includes(state)) {
        return cityName;
      }
      return `${cityName}, ${state}`;
    }

    return cityName;
  }

  /**
   * Get city name without state
   */
  static getCityNameOnly(stop: TripStop): string {
    if (!stop) return '';
    
    const fullName = stop.name || stop.city || stop.city_name || '';
    
    // If it includes comma, take only the part before comma
    if (fullName.includes(',')) {
      return fullName.split(',')[0].trim();
    }
    
    return fullName;
  }

  /**
   * Format destination city for consistent display
   */
  static formatDestinationCity(cityName: string, state?: string): string {
    if (!cityName) return '';
    
    // If already formatted with state, return as-is
    if (cityName.includes(',') && cityName.includes(state || '')) {
      return cityName;
    }
    
    // Add state if provided
    if (state) {
      return `${cityName}, ${state}`;
    }
    
    return cityName;
  }
}
