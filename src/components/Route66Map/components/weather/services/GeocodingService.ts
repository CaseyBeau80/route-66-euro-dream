
import { allRoute66Coordinates } from '../../../../TripCalculator/services/coordinates/Route66Coordinates';
import { CityNameNormalizationService } from '../../../../TripCalculator/services/CityNameNormalizationService';

interface CityCoordinates {
  lat: number;
  lng: number;
}

export class GeocodingService {
  static async getCoordinates(cityName: string): Promise<CityCoordinates | null> {
    console.log('🗺️ ENHANCED: Route66Map GeocodingService - Using comprehensive coordinates for:', cityName);
    
    if (!cityName || typeof cityName !== 'string') {
      console.warn('🗺️ ENHANCED: Route66Map GeocodingService - Invalid city name provided');
      return null;
    }

    // Use the comprehensive coordinate lookup
    const result = CityNameNormalizationService.findCoordinateMatch(cityName, allRoute66Coordinates);
    
    if (!result) {
      console.warn('⚠️ ENHANCED: Route66Map GeocodingService - No coordinates found for', cityName, {
        availableCount: Object.keys(allRoute66Coordinates).length,
        enhancedLookup: true
      });
      return null;
    }

    console.log('✅ ENHANCED: Route66Map GeocodingService - Found coordinates for:', cityName, result);
    return result;
  }

  static addCoordinates(cityName: string, coordinates: CityCoordinates): void {
    const normalizedName = cityName.toLowerCase().trim();
    allRoute66Coordinates[normalizedName] = coordinates;
    console.log('🗺️ ENHANCED: Route66Map GeocodingService - Added coordinates for:', normalizedName, coordinates);
  }

  static getAllCities(): string[] {
    return Object.keys(allRoute66Coordinates);
  }
}
