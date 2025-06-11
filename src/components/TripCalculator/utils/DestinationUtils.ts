
/**
 * Extract city and state from a destination string
 */
export function getDestinationCityWithState(destination: string): { city: string; state: string } {
  if (!destination) {
    return { city: '', state: '' };
  }
  
  // Handle formats like "Chicago, IL" or "St. Louis, MO"
  if (destination.includes(',')) {
    const parts = destination.split(',').map(part => part.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || ''
    };
  }
  
  // Handle single city names - try to map to known Route 66 cities
  const cityStateMap: Record<string, string> = {
    'Chicago': 'IL',
    'Springfield': 'IL',
    'St. Louis': 'MO',
    'Tulsa': 'OK',
    'Oklahoma City': 'OK',
    'Amarillo': 'TX',
    'Albuquerque': 'NM',
    'Flagstaff': 'AZ',
    'Los Angeles': 'CA',
    'Santa Monica': 'CA'
  };
  
  const state = cityStateMap[destination] || '';
  
  return {
    city: destination,
    state
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
  const majorCities = [
    'Chicago',
    'Springfield',
    'St. Louis',
    'Tulsa',
    'Oklahoma City',
    'Amarillo',
    'Albuquerque',
    'Flagstaff',
    'Los Angeles',
    'Santa Monica'
  ];
  
  return majorCities.some(majorCity => 
    city.toLowerCase().includes(majorCity.toLowerCase())
  );
}
