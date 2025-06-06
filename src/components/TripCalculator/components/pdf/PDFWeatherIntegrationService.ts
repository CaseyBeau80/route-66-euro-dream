
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';

export class PDFWeatherIntegrationService {
  private static weatherService = EnhancedWeatherService.getInstance();

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
        
        const weatherData = await this.weatherService.getWeatherData(cityName, segmentDate);
        
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
