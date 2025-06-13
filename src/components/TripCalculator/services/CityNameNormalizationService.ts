
export class CityNameNormalizationService {
  static normalizeSearchTerm(cityName: string): string {
    console.log('🗺️ CityNameNormalizationService: Normalizing search term:', cityName);
    
    // Convert to lowercase and handle common variations
    let normalized = cityName.toLowerCase().trim();
    
    // Handle Saint/St. variations
    normalized = normalized.replace(/\bsaint\b/g, 'st.');
    normalized = normalized.replace(/\bst\b/g, 'st.');
    
    // Handle Devil's Elbow variations
    normalized = normalized.replace(/devil's elbow/g, 'devils elbow');
    normalized = normalized.replace(/devils elbow/g, 'devil\'s elbow');
    
    // Remove extra spaces and normalize punctuation
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    console.log('🗺️ CityNameNormalizationService: Normalized result:', normalized, 'from original:', cityName);
    return normalized;
  }

  static findCoordinateMatch(searchTerm: string, coordinates: { [key: string]: { lat: number; lng: number } }): { lat: number; lng: number } | null {
    const normalizedSearch = this.normalizeSearchTerm(searchTerm);
    
    console.log('🗺️ CityNameNormalizationService: Searching for coordinates with normalized term:', normalizedSearch);
    
    // Try exact match first
    for (const [key, coords] of Object.entries(coordinates)) {
      if (this.normalizeSearchTerm(key) === normalizedSearch) {
        console.log('✅ CityNameNormalizationService: Found exact match:', key, '→', coords);
        return coords;
      }
    }
    
    // Try partial matches (city name without state)
    const cityPart = normalizedSearch.split(',')[0].trim();
    console.log('🗺️ CityNameNormalizationService: Trying partial match with city part:', cityPart);
    
    for (const [key, coords] of Object.entries(coordinates)) {
      const keyCity = this.normalizeSearchTerm(key).split(',')[0].trim();
      if (keyCity === cityPart) {
        console.log('✅ CityNameNormalizationService: Found partial match:', key, '→', coords);
        return coords;
      }
    }
    
    // Try fuzzy matching for common variations
    for (const [key, coords] of Object.entries(coordinates)) {
      const keyNormalized = this.normalizeSearchTerm(key);
      if (keyNormalized.includes(cityPart) || cityPart.includes(keyNormalized.split(',')[0].trim())) {
        console.log('✅ CityNameNormalizationService: Found fuzzy match:', key, '→', coords);
        return coords;
      }
    }
    
    console.log('❌ CityNameNormalizationService: No match found for:', searchTerm);
    return null;
  }
}
