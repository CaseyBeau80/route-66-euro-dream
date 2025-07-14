
import { TripStop } from '../../types/TripStop';

export class CityDisplayService {
  /**
   * Get standardized city display name from a TripStop - ALWAYS include state
   */
  static getCityDisplayName(stop: TripStop): string {
    if (!stop) {
      return 'Unknown Location';
    }
    
    const city = stop.city_name || stop.city || stop.name;
    const state = stop.state;
    
    // ENHANCED: Always include state for consistency and clarity
    if (state && state !== 'Unknown' && state.trim() !== '') {
      return `${city}, ${state}`;
    }
    
    // Fallback: city only if no valid state
    console.warn(`⚠️ CityDisplayService: No valid state for city "${city}" - displaying city only`);
    return city;
  }

  /**
   * Format city display string from a TripStop - ALWAYS include state
   */
  static formatCityDisplay(stop: TripStop): string {
    if (!stop) {
      return 'Unknown Location';
    }
    
    const city = stop.city_name || stop.city || stop.name;
    const state = stop.state;
    
    // ENHANCED: Always include state for consistency and clarity
    if (state && state !== 'Unknown' && state.trim() !== '') {
      return `${city}, ${state}`;
    }
    
    // Fallback: city only if no valid state
    console.warn(`⚠️ CityDisplayService: No valid state for city "${city}" - displaying city only`);
    return city;
  }

  /**
   * Format city display string from city and state - ALWAYS include state
   */
  static formatCityStateDisplay(city: string, state?: string): string {
    if (!city) {
      return 'Unknown Location';
    }
    
    // ENHANCED: Always include state for consistency and clarity
    if (state && state !== 'Unknown' && state.trim() !== '') {
      return `${city}, ${state}`;
    }
    
    // Fallback: city only if no valid state
    console.warn(`⚠️ CityDisplayService: No valid state for city "${city}" - displaying city only`);
    return city;
  }

  /**
   * Extract city name from various formats
   */
  static extractCityName(locationString: string): string {
    if (!locationString) {
      return 'Unknown';
    }
    
    // Handle "City, State" format
    const parts = locationString.split(',');
    return parts[0].trim();
  }

  /**
   * Extract state from various formats
   */
  static extractState(locationString: string): string | undefined {
    if (!locationString) {
      return undefined;
    }
    
    // Handle "City, State" format
    const parts = locationString.split(',');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    
    return undefined;
  }
}
