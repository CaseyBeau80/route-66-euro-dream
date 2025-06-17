
export class CityDisplayService {
  /**
   * Get standardized city display name with state abbreviation
   */
  static getCityDisplayName(stop: any): string {
    if (!stop) return 'Unknown';
    
    // Use city_name if available, otherwise use name
    const cityName = stop.city_name || stop.city || stop.name || 'Unknown';
    const state = stop.state || '';
    
    // Remove state from city name if it's already included
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/i, '').trim();
    
    // Return format: "City, ST"
    if (state) {
      return `${cleanCityName}, ${state.toUpperCase()}`;
    }
    
    return cleanCityName;
  }

  /**
   * Parse city and state from input string
   */
  static parseCityStateInput(input: string): { city: string; state: string } {
    if (!input) return { city: '', state: '' };
    
    const parts = input.split(',').map(part => part.trim());
    
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1].toUpperCase()
      };
    }
    
    return {
      city: input.trim(),
      state: ''
    };
  }

  /**
   * Normalize city name for comparison
   */
  static normalizeCityName(cityName: string): string {
    return cityName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Normalize spaces
  }
}
