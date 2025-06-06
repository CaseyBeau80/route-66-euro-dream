
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export class PDFWeatherIntegrationService {
  private static weatherService = EnhancedWeatherService.getInstance();

  /**
   * Simple geocoding function to get approximate coordinates for major Route 66 cities
   */
  private static getCityCoordinates(cityName: string): { lat: number; lng: number } | null {
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'St. Louis': { lat: 38.6270, lng: -90.1994 },
      'Springfield': { lat: 39.7817, lng: -89.6501 },
      'Joplin': { lat: 37.0842, lng: -94.5133 },
      'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
      'Amarillo': { lat: 35.2220, lng: -101.8313 },
      'Santa Fe': { lat: 35.6870, lng: -105.9378 },
      'Albuquerque': { lat: 35.0844, lng: -106.6504 },
      'Flagstaff': { lat: 35.1983, lng: -111.6513 },
      'Kingman': { lat: 35.1894, lng: -114.0530 },
      'Barstow': { lat: 34.8958, lng: -117.0228 },
      'San Bernardino': { lat: 34.1083, lng: -117.2898 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Santa Monica': { lat: 34.0195, lng: -118.4912 }
    };

    // Try exact match first
    if (cityCoords[cityName]) {
      return cityCoords[cityName];
    }

    // Try partial match (remove state abbreviations)
    const cleanCityName = cityName.split(',')[0].trim();
    if (cityCoords[cleanCityName]) {
      return cityCoords[cleanCityName];
    }

    // Try finding a partial match
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (city.toLowerCase().includes(cleanCityName.toLowerCase()) || 
          cleanCityName.toLowerCase().includes(city.toLowerCase())) {
        return coords;
      }
    }

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

    for (const segment of segments) {
      try {
        const segmentDate = tripStartDate 
          ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
          : null;

        console.log(`🌤️ Fetching weather for ${segment.endCity} on day ${segment.day}`);

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
          weatherData = await this.weatherService.getWeatherForDate(
            coordinates.lat, 
            coordinates.lng, 
            cityName, 
            segmentDate
          );
        } else {
          // Get current weather
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

        console.log(`✅ Weather data added for ${segment.endCity}:`, weatherData);
        enrichedSegments.push(enrichedSegment);
      } catch (error) {
        console.error(`❌ Failed to fetch weather for ${segment.endCity}:`, error);
        // Add segment without weather data
        enrichedSegments.push(segment);
      }
    }

    return enrichedSegments;
  }

  /**
   * Check if weather service is available
   */
  static isWeatherServiceAvailable(): boolean {
    return this.weatherService.hasApiKey();
  }
}
