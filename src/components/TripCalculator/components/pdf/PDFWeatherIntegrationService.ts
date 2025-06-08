
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { getHistoricalWeatherData } from '../weather/SeasonalWeatherService';

export class PDFWeatherIntegrationService {
  static isWeatherServiceAvailable(): boolean {
    // Check if we have API keys or weather service available
    return true; // For now, always return true to show seasonal fallbacks
  }

  static async enrichSegmentsWithWeather(
    segments: DailySegment[],
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('🌤️ PDFWeatherIntegrationService: Enriching segments with weather data...');

    if (!segments || segments.length === 0) {
      console.log('⚠️ No segments provided for weather enrichment');
      return segments;
    }

    const enrichedSegments = await Promise.all(
      segments.map(async (segment, index) => {
        try {
          const segmentDate = tripStartDate 
            ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
            : new Date();

          console.log(`🌤️ Processing weather for Day ${segment.day} (${segment.endCity}) on ${segmentDate.toISOString()}`);

          // Check if weather data already exists
          const existingWeather = segment.weather || segment.weatherData || 
                                 (segment.destination as any)?.weather || 
                                 (segment.destination as any)?.weatherData;

          if (existingWeather && existingWeather.lowTemp && existingWeather.highTemp) {
            console.log(`✅ Weather already exists for ${segment.endCity}`);
            return {
              ...segment,
              weather: existingWeather,
              weatherData: existingWeather
            };
          }

          // Get seasonal fallback data
          const historicalData = getHistoricalWeatherData(segment.endCity, segmentDate);
          
          const weatherInfo = {
            cityName: segment.endCity,
            lowTemp: historicalData.low,
            highTemp: historicalData.high,
            description: historicalData.condition,
            humidity: historicalData.humidity,
            windSpeed: historicalData.windSpeed,
            isActualForecast: false,
            source: 'historical',
            date: segmentDate.toISOString()
          };

          console.log(`✅ Added weather for ${segment.endCity}:`, weatherInfo);

          return {
            ...segment,
            weather: weatherInfo,
            weatherData: weatherInfo
          };

        } catch (error) {
          console.error(`❌ Failed to get weather for ${segment.endCity}:`, error);
          return segment; // Return original segment if weather fetch fails
        }
      })
    );

    console.log('✅ Weather enrichment completed:', {
      totalSegments: segments.length,
      enrichedSegments: enrichedSegments.length,
      segmentsWithWeather: enrichedSegments.filter(s => s.weather || s.weatherData).length
    });

    return enrichedSegments;
  }
}
