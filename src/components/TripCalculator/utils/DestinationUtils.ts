
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
