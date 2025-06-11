
import { route66CityMappings, majorRoute66Cities } from './CityStateMapping';

/**
 * City matching utilities for finding and validating Route 66 cities
 */
export class CityMatcher {
  /**
   * Find matching city mapping
   */
  static findCityMapping(destination: string) {
    return route66CityMappings.find(mapping => {
      const cityMatch = mapping.city.toLowerCase() === destination.toLowerCase();
      const aliasMatch = mapping.aliases?.some(alias => alias.toLowerCase() === destination.toLowerCase());
      return cityMatch || aliasMatch;
    });
  }

  /**
   * Check if a destination is a major Route 66 city
   */
  static isMajorRoute66City(city: string): boolean {
    return majorRoute66Cities.some(majorCity => 
      city.toLowerCase().includes(majorCity.toLowerCase())
    );
  }

  /**
   * Extract city and state from destination string with comma format
   */
  static parseCommaFormat(destination: string): { city: string; state: string } {
    if (destination.includes(',')) {
      const parts = destination.split(',').map(part => part.trim());
      return {
        city: parts[0] || '',
        state: parts[1] || ''
      };
    }
    return { city: destination, state: '' };
  }
}
