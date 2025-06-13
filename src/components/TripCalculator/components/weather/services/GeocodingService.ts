
import { GeocodingService as MainGeocodingService } from '../../../services/GeocodingService';

export class GeocodingService {
  static async getCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    console.log('🗺️ Weather GeocodingService: Getting coordinates for:', cityName);
    
    const coordinates = MainGeocodingService.getCoordinatesForCity(cityName);
    
    if (!coordinates) {
      console.warn('❌ Weather GeocodingService: No coordinates found for:', cityName);
      return null;
    }
    
    console.log('✅ Weather GeocodingService: Found coordinates for:', cityName, coordinates);
    return coordinates;
  }
}
