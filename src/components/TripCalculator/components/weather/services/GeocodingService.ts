
import { CityNameNormalizationService } from '../../../services/CityNameNormalizationService';
import { allRoute66Coordinates } from '../../../services/coordinates/Route66Coordinates';

export class GeocodingService {
  static async getCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null {
    console.log('🗺️ ENHANCED: Weather GeocodingService - Enhanced coordinate lookup for:', JSON.stringify(cityName));
    
    if (!cityName || typeof cityName !== 'string') {
      console.error('❌ ENHANCED: Weather GeocodingService - Invalid city name provided:', cityName);
      return null;
    }

    // Use the comprehensive coordinate lookup from Trip Calculator
    const result = CityNameNormalizationService.findCoordinateMatch(cityName, allRoute66Coordinates);
    
    if (!result) {
      console.warn('❌ ENHANCED: Weather GeocodingService - No coordinates found for:', JSON.stringify(cityName));
      console.log('🗺️ ENHANCED: Available cities containing similar text:');
      
      const cityPart = cityName.toLowerCase().split(',')[0].trim();
      const suggestions = Object.keys(allRoute66Coordinates)
        .filter(key => key.toLowerCase().includes(cityPart))
        .slice(0, 5);
      
      console.log('🗺️ ENHANCED: Suggestions:', suggestions);
      console.log('🗺️ ENHANCED: Total available cities:', Object.keys(allRoute66Coordinates).length);
    } else {
      console.log('✅ ENHANCED: Weather GeocodingService - Found coordinates for:', cityName, '→', result);
    }

    return result;
  }

  static getAllAvailableCities(): string[] {
    return Object.keys(allRoute66Coordinates);
  }

  static debugSearchTerm(searchTerm: string): void {
    console.log('🔍 ENHANCED: Weather GeocodingService Debug for:', searchTerm);
    console.log('🔍 Normalized:', CityNameNormalizationService.normalizeSearchTerm(searchTerm));
    console.log('🔍 Available keys:', Object.keys(allRoute66Coordinates).filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  // Legacy methods for backward compatibility
  static normalizeSearchTerm(cityName: string): string {
    return CityNameNormalizationService.normalizeSearchTerm(cityName);
  }

  static findCoordinateMatch(searchTerm: string): { lat: number; lng: number } | null {
    return CityNameNormalizationService.findCoordinateMatch(searchTerm, allRoute66Coordinates);
  }
}
