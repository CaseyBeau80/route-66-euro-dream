
import { CityMatcher } from './CityMatcher';

/**
 * Extract city and state from a destination string
 */
export function getDestinationCityWithState(destination: string): { city: string; state: string } {
  if (!destination) {
    return { city: '', state: '' };
  }
  
  // Handle formats like "Chicago, IL" or "St. Louis, MO"
  const commaResult = CityMatcher.parseCommaFormat(destination);
  if (commaResult.state) {
    return commaResult;
  }
  
  // Find the matching city mapping from Route 66 data
  const matchedMapping = CityMatcher.findCityMapping(destination);
  
  if (matchedMapping) {
    return {
      city: destination,
      state: matchedMapping.state
    };
  }
  
  return {
    city: destination,
    state: ''
  };
}

/**
 * Extract just the city name from a destination string or object
 */
export function getDestinationCity(destination: string | { city: string; state?: string; }): string {
  if (!destination) return '';
  
  // If it's already an object with city property, return the city
  if (typeof destination === 'object' && destination.city) {
    return destination.city;
  }
  
  // If it's a string, extract the city using the existing logic
  if (typeof destination === 'string') {
    const { city } = getDestinationCityWithState(destination);
    return city;
  }
  
  return '';
}

/**
 * Format destination with city and state
 */
export function formatDestination(city: string, state: string): string {
  if (!city) return '';
  if (!state) return city;
  return `${city}, ${state}`;
}

/**
 * Check if a destination is a major Route 66 city
 */
export function isMajorRoute66City(city: string): boolean {
  return CityMatcher.isMajorRoute66City(city);
}
