
interface CityCoordinates {
  lat: number;
  lng: number;
}

export class GeocodingService {
  private static readonly CITY_COORDINATES: { [key: string]: CityCoordinates } = {
    // Route 66 major cities with proper coordinates
    'chicago, il': { lat: 41.8781, lng: -87.6298 },
    'springfield, il': { lat: 39.7817, lng: -89.6501 },
    'st. louis, mo': { lat: 38.6270, lng: -90.1994 },
    'joplin, mo': { lat: 37.0842, lng: -94.5133 },
    'tulsa, ok': { lat: 36.1540, lng: -95.9928 },
    'oklahoma city, ok': { lat: 35.4676, lng: -97.5164 },
    'amarillo, tx': { lat: 35.2220, lng: -101.8313 },
    'albuquerque, nm': { lat: 35.0844, lng: -106.6504 },
    'santa fe, nm': { lat: 35.6870, lng: -105.9378 },
    'flagstaff, az': { lat: 35.1983, lng: -111.6513 },
    'williams, az': { lat: 35.2494, lng: -112.1901 },
    'kingman, az': { lat: 35.1895, lng: -114.0530 },
    'needles, ca': { lat: 34.8481, lng: -114.6142 },
    'barstow, ca': { lat: 34.8958, lng: -117.0228 },
    'san bernardino, ca': { lat: 34.1083, lng: -117.2898 },
    'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
    'santa monica, ca': { lat: 34.0195, lng: -118.4912 },
    
    // Add common variations and misspellings
    'st louis, mo': { lat: 38.6270, lng: -90.1994 },
    'saint louis, mo': { lat: 38.6270, lng: -90.1994 },
    'st. louis': { lat: 38.6270, lng: -90.1994 },
    'st louis': { lat: 38.6270, lng: -90.1994 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'springfield': { lat: 39.7817, lng: -89.6501 },
    'oklahoma city': { lat: 35.4676, lng: -97.5164 },
    'santa fe': { lat: 35.6870, lng: -105.9378 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'santa monica': { lat: 34.0195, lng: -118.4912 }
  };

  static async getCoordinates(cityName: string): Promise<CityCoordinates | null> {
    console.log('🗺️ Weather GeocodingService: Getting coordinates for:', cityName);
    
    if (!cityName || typeof cityName !== 'string') {
      console.warn('🗺️ Weather GeocodingService: Invalid city name provided');
      return null;
    }

    // Enhanced normalization - remove extra spaces and punctuation more carefully
    const normalizedName = cityName.toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s,.-]/g, '') // Remove special chars except common ones
      .replace(/\s*,\s*/g, ', ') // Normalize comma spacing
      .replace(/\s*\.\s*/g, '. ') // Normalize period spacing
      .replace(/\s+/g, ' ') // Clean up any remaining multiple spaces
      .trim();

    console.log('🗺️ Weather GeocodingService: Normalized name:', normalizedName);

    // Direct lookup
    if (this.CITY_COORDINATES[normalizedName]) {
      const coords = this.CITY_COORDINATES[normalizedName];
      console.log('✅ Weather GeocodingService: Found exact match for:', normalizedName, coords);
      return coords;
    }

    // Try without state abbreviation
    const cityWithoutState = normalizedName.split(',')[0].trim();
    if (this.CITY_COORDINATES[cityWithoutState]) {
      const coords = this.CITY_COORDINATES[cityWithoutState];
      console.log('✅ Weather GeocodingService: Found match without state for:', cityWithoutState, coords);
      return coords;
    }

    // Try fuzzy matching for common variations
    const fuzzyMatches = [
      normalizedName.replace(/saint/g, 'st.'),
      normalizedName.replace(/st\./g, 'saint'),
      normalizedName.replace(/st\./g, 'st'),
      normalizedName.replace(/\bst\b/g, 'st.'),
    ];

    for (const fuzzyName of fuzzyMatches) {
      if (this.CITY_COORDINATES[fuzzyName]) {
        const coords = this.CITY_COORDINATES[fuzzyName];
        console.log('✅ Weather GeocodingService: Found fuzzy match:', fuzzyName, coords);
        return coords;
      }
    }

    console.warn('⚠️ Weather GeocodingService: No coordinates found for', cityName, {
      normalizedName,
      cityWithoutState,
      availableCities: Object.keys(this.CITY_COORDINATES),
      fuzzyAttempts: fuzzyMatches
    });
    
    return null;
  }

  static addCoordinates(cityName: string, coordinates: CityCoordinates): void {
    const normalizedName = cityName.toLowerCase().trim();
    this.CITY_COORDINATES[normalizedName] = coordinates;
    console.log('🗺️ Weather GeocodingService: Added coordinates for:', normalizedName, coordinates);
  }

  static getAllCities(): string[] {
    return Object.keys(this.CITY_COORDINATES);
  }
}
