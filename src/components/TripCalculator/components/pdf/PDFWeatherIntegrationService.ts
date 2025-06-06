
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { GeocodingService } from '../../services/GeocodingService';

export class PDFWeatherIntegrationService {
  private static weatherService = EnhancedWeatherService.getInstance();

  /**
   * Enhanced city coordinates lookup using GeocodingService
   */
  private static getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
    console.log(`🗺️ PDFWeatherIntegrationService: Looking up coordinates for "${cityName}"`);
    
    // First try the comprehensive GeocodingService
    let coordinates = GeocodingService.getCoordinatesForCity(cityName);
    
    if (coordinates) {
      console.log(`✅ Found coordinates via GeocodingService for ${cityName}:`, coordinates);
      return coordinates;
    }

    // Fallback: try cleaning up the city name and searching again
    const cleanCityName = cityName.split(',')[0].trim();
    if (cleanCityName !== cityName) {
      coordinates = GeocodingService.getCoordinatesForCity(cleanCityName);
      if (coordinates) {
        console.log(`✅ Found coordinates via cleaned name "${cleanCityName}":`, coordinates);
        return coordinates;
      }
    }

    // Additional fallback coordinates for commonly missed cities
    const additionalCoords: Record<string, { lat: number; lng: number }> = {
      'Tucumcari': { lat: 35.1717, lng: -103.7253 },
      'Tulsa': { lat: 36.1540, lng: -95.9928 },
      'Santa Rosa': { lat: 34.9381, lng: -104.6819 },
      'Gallup': { lat: 35.5281, lng: -108.7426 },
      'Winslow': { lat: 35.0242, lng: -110.7073 },
      'Williams': { lat: 35.2494, lng: -112.1901 },
      'Seligman': { lat: 35.3261, lng: -112.8721 },
      'Needles': { lat: 34.8481, lng: -114.6144 },
      'Victorville': { lat: 34.5362, lng: -117.2911 }
    };

    if (additionalCoords[cleanCityName]) {
      console.log(`✅ Found coordinates via fallback for ${cleanCityName}:`, additionalCoords[cleanCityName]);
      return additionalCoords[cleanCityName];
    }

    console.warn(`❌ No coordinates found for "${cityName}" after all attempts`);
    return null;
  }

  /**
   * Fetch weather data for all segments in a trip plan
   */
  static async enrichSegmentsWithWeather(
    segments: DailySegment[],
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('🌤️ PDFWeatherIntegrationService: Enriching segments with weather data...');
    
    if (!this.weatherService.hasApiKey()) {
      console.log('⚠️ No weather API key available, skipping weather enrichment');
      return segments;
    }

    const enrichedSegments: DailySegment[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      try {
        const segmentDate = tripStartDate 
          ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
          : null;

        console.log(`🌤️ Processing segment ${i + 1}/${segments.length}: ${segment.endCity} on day ${segment.day}`);

        // Extract city name from endCity (remove state if present)
        const cityName = segment.endCity.split(',')[0].trim();
        
        // Get coordinates for the city
        const coordinates = this.getCityCoordinates(cityName);
        
        if (!coordinates) {
          console.warn(`❌ No coordinates found for ${cityName}, skipping weather`);
          enrichedSegments.push(segment);
          continue;
        }

        let weatherData = null;

        if (segmentDate) {
          // Try to get weather for specific date
          console.log(`🗓️ Fetching weather for ${cityName} on ${segmentDate.toDateString()}`);
          weatherData = await this.weatherService.getWeatherForDate(
            coordinates.lat, 
            coordinates.lng, 
            cityName, 
            segmentDate
          );
        } else {
          // Get current weather
          console.log(`🌤️ Fetching current weather for ${cityName}`);
          weatherData = await this.weatherService.getWeatherData(
            coordinates.lat, 
            coordinates.lng, 
            cityName
          );
        }
        
        const enrichedSegment = {
          ...segment,
          weather: weatherData,
          weatherData: weatherData // Also store in weatherData for compatibility
        };

        console.log(`✅ Weather data added for ${segment.endCity}:`, {
          hasWeather: !!weatherData,
          temperature: weatherData?.temperature,
          description: weatherData?.description
        });
        enrichedSegments.push(enrichedSegment);

        // Add a small delay between API calls to avoid rate limiting
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`❌ Failed to fetch weather for ${segment.endCity}:`, error);
        // Add segment without weather data
        enrichedSegments.push(segment);
      }
    }

    console.log(`🌤️ Weather enrichment completed. ${enrichedSegments.filter(s => s.weather).length}/${enrichedSegments.length} segments have weather data.`);
    return enrichedSegments;
  }

  /**
   * Check if weather service is available
   */
  static isWeatherServiceAvailable(): boolean {
    return this.weatherService.hasApiKey();
  }
}
