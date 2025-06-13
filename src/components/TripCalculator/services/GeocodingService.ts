
import { CityNameNormalizationService } from './CityNameNormalizationService';
import { allRoute66Coordinates } from './coordinates/Route66Coordinates';

export class GeocodingService {
  static getCoordinatesForCity(cityName: string): { lat: number; lng: number } | null {
    console.log('🗺️ GeocodingService: Looking up coordinates for:', JSON.stringify(cityName));
    
    if (!cityName || typeof cityName !== 'string') {
      console.error('❌ GeocodingService: Invalid city name provided:', cityName);
      return null;
    }

    const result = CityNameNormalizationService.findCoordinateMatch(cityName, allRoute66Coordinates);
    
    if (!result) {
      console.warn('❌ GeocodingService: No coordinates found for:', JSON.stringify(cityName));
      console.log('🗺️ GeocodingService: Suggestion - Available cities containing similar text:');
      
      const cityPart = cityName.toLowerCase().split(',')[0].trim();
      const suggestions = Object.keys(allRoute66Coordinates)
        .filter(key => key.toLowerCase().includes(cityPart))
        .slice(0, 5);
      
      console.log('🗺️ GeocodingService: Suggestions:', suggestions);
    } else {
      console.log('✅ GeocodingService: Found coordinates for:', cityName, '→', result);
    }

    return result;
  }

  static getAllAvailableCities(): string[] {
    return Object.keys(allRoute66Coordinates);
  }

  static debugSearchTerm(searchTerm: string): void {
    console.log('🔍 GeocodingService Debug for:', searchTerm);
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
