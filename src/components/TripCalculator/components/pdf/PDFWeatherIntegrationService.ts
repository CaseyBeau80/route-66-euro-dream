
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { getWeatherDataForTripDate } from '../weather/getWeatherDataForTripDate';
import { WeatherCountingService } from '../weather/services/WeatherCountingService';
import { WeatherPersistenceService } from '../weather/services/WeatherPersistenceService';
import { WeatherDataNormalizer } from '../weather/services/WeatherDataNormalizer';

export class PDFWeatherIntegrationService {
  static async enrichSegmentsWithWeather(
    segments: DailySegment[], 
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('🌤️ PDFWeatherIntegrationService: Enhanced weather enrichment starting...');
    
    if (!segments || segments.length === 0) {
      console.log('⚠️ No segments to enrich');
      return [];
    }

    if (!tripStartDate) {
      console.log('⚠️ No trip start date provided, checking for existing weather data');
      // Generate summary with existing data
      const summary = WeatherCountingService.generateWeatherSummary(segments);
      console.log('📊 Existing weather summary:', summary);
      return segments;
    }

    // Clean up expired cache entries
    WeatherPersistenceService.clearExpiredEntries();

    const enrichedSegments: DailySegment[] = [];

    for (const segment of segments) {
      try {
        const segmentDate = new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
        
        console.log(`🌤️ Processing weather for Day ${segment.day} (${segment.endCity}) on ${segmentDate.toISOString()}`);
        
        // Check for cached data first
        let weatherData = null;
        const cachedWeather = WeatherPersistenceService.getWeatherData(segment.endCity, segmentDate);
        
        if (cachedWeather) {
          console.log(`💾 Using cached weather for Day ${segment.day}`);
          weatherData = {
            temperature: cachedWeather.temperature,
            highTemp: cachedWeather.highTemp,
            lowTemp: cachedWeather.lowTemp,
            description: cachedWeather.description,
            icon: cachedWeather.icon,
            humidity: cachedWeather.humidity,
            windSpeed: cachedWeather.windSpeed,
            precipitationChance: cachedWeather.precipitationChance,
            cityName: cachedWeather.cityName,
            isActualForecast: cachedWeather.isActualForecast,
            dateMatchInfo: cachedWeather.dateMatchInfo
          };
        } else {
          // Attempt to fetch new weather data
          try {
            weatherData = await getWeatherDataForTripDate(segment.endCity, segmentDate);
            
            // Normalize and persist the new data
            if (weatherData) {
              const normalized = WeatherDataNormalizer.normalizeWeatherData(
                weatherData, 
                segment.endCity, 
                segmentDate
              );
              
              if (normalized) {
                WeatherPersistenceService.storeWeatherData(segment.endCity, segmentDate, normalized);
                console.log(`💾 Persisted new weather data for Day ${segment.day}`);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch weather for Day ${segment.day}:`, error);
          }
        }
        
        const enrichedSegment = {
          ...segment,
          weather: weatherData,
          weatherData: weatherData // Backup property
        };
        
        enrichedSegments.push(enrichedSegment);
        console.log(`✅ Weather data enriched for Day ${segment.day}`);
        
      } catch (error) {
        console.warn(`⚠️ Failed to process weather for Day ${segment.day} (${segment.endCity}):`, error);
        
        // Add segment without weather data
        enrichedSegments.push({
          ...segment,
          weather: null,
          weatherData: null
        });
      }
    }

    // Generate final weather summary
    const finalSummary = WeatherCountingService.generateWeatherSummary(enrichedSegments, tripStartDate);
    console.log('📊 Final weather enrichment summary:', finalSummary);

    console.log(`✅ Enhanced weather enrichment completed: ${enrichedSegments.length} segments processed`);
    console.log('📊 Weather coverage:', {
      total: finalSummary.totalSegments,
      withWeather: finalSummary.segmentsWithWeather,
      liveForecast: finalSummary.segmentsWithLiveForecast,
      coverage: finalSummary.coveragePercentage + '%'
    });

    return enrichedSegments;
  }

  /**
   * Get weather statistics for PDF export validation
   */
  static getWeatherExportStats(segments: DailySegment[], tripStartDate?: Date) {
    const summary = WeatherCountingService.generateWeatherSummary(segments, tripStartDate);
    const isReady = WeatherCountingService.isWeatherReadyForExport(summary);
    const quality = WeatherCountingService.getWeatherQuality(summary);

    return {
      summary,
      isReady,
      quality,
      message: this.getWeatherStatusMessage(summary, quality)
    };
  }

  private static getWeatherStatusMessage(
    summary: { coveragePercentage: number; liveForecastPercentage: number },
    quality: string
  ): string {
    if (quality === 'excellent') {
      return `Excellent weather coverage (${summary.liveForecastPercentage}% live forecasts)`;
    } else if (quality === 'good') {
      return `Good weather coverage (${summary.liveForecastPercentage}% live forecasts)`;
    } else if (quality === 'fair') {
      return `Fair weather coverage (${summary.coveragePercentage}% coverage)`;
    } else {
      return `Limited weather data available (${summary.coveragePercentage}% coverage)`;
    }
  }
}
