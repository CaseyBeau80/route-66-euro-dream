
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { getWeatherDataForTripDate } from '../weather/getWeatherDataForTripDate';
import { GeocodingService } from '../../services/GeocodingService';

export class PDFWeatherIntegrationService {
  static isWeatherServiceAvailable(): boolean {
    return true; // Always return true to enable weather processing
  }

  static async enrichSegmentsWithWeather(
    segments: DailySegment[],
    tripStartDate?: Date
  ): Promise<DailySegment[]> {
    console.log('🌤️ PDFWeatherIntegrationService: Enriching segments with weather data using UI logic...');

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

          // Check if weather data already exists and is complete
          const existingWeather = segment.weather || segment.weatherData || 
                                 (segment.destination as any)?.weather || 
                                 (segment.destination as any)?.weatherData;

          if (existingWeather && existingWeather.lowTemp && existingWeather.highTemp) {
            console.log(`✅ Weather already exists for ${segment.endCity}:`, {
              high: existingWeather.highTemp,
              low: existingWeather.lowTemp,
              isActual: existingWeather.isActualForecast
            });
            return {
              ...segment,
              weather: existingWeather,
              weatherData: existingWeather
            };
          }

          // Get coordinates for the city
          const coordinates = GeocodingService.getCoordinatesForCity(segment.endCity);
          
          // Use the same weather logic as the UI
          const weatherDisplayData = await getWeatherDataForTripDate(
            segment.endCity,
            segmentDate,
            coordinates || undefined
          );

          if (weatherDisplayData) {
            const weatherInfo = {
              cityName: segment.endCity,
              lowTemp: weatherDisplayData.lowTemp,
              highTemp: weatherDisplayData.highTemp,
              description: weatherDisplayData.description,
              humidity: weatherDisplayData.humidity,
              windSpeed: weatherDisplayData.windSpeed,
              precipitationChance: weatherDisplayData.precipitationChance,
              isActualForecast: weatherDisplayData.isActualForecast || false,
              source: weatherDisplayData.source,
              date: segmentDate.toISOString()
            };

            console.log(`✅ Enhanced weather for ${segment.endCity}:`, {
              high: weatherInfo.highTemp,
              low: weatherInfo.lowTemp,
              source: weatherInfo.source,
              isActual: weatherInfo.isActualForecast
            });

            return {
              ...segment,
              weather: weatherInfo,
              weatherData: weatherInfo
            };
          } else {
            console.log(`⚠️ No weather data available for ${segment.endCity}`);
            return segment;
          }

        } catch (error) {
          console.error(`❌ Failed to get weather for ${segment.endCity}:`, error);
          return segment; // Return original segment if weather fetch fails
        }
      })
    );

    const weatherStats = {
      totalSegments: segments.length,
      enrichedSegments: enrichedSegments.length,
      segmentsWithWeather: enrichedSegments.filter(s => s.weather || s.weatherData).length,
      forecastSegments: enrichedSegments.filter(s => 
        (s.weather?.isActualForecast) || (s.weatherData?.isActualForecast)
      ).length
    };

    console.log('✅ PDF Weather enrichment completed:', weatherStats);

    return enrichedSegments;
  }
}
