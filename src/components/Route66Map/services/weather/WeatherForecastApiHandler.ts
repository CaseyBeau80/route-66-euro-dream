
import { WeatherApiClient } from './WeatherApiClient';
import { ForecastWeatherData } from './WeatherForecastService';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { EnhancedWeatherForecastMatcher } from '../../../TripCalculator/components/weather/EnhancedWeatherForecastMatcher';

export class WeatherForecastApiHandler {
  private apiClient: WeatherApiClient;

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
    
    console.log('🔧 FIXED: WeatherForecastApiHandler initialized', {
      hasApiKey: !!apiKey,
      timestamp: new Date().toISOString()
    });
  }

  async fetchLiveForecast(
    lat: number,
    lng: number,
    cityName: string,
    normalizedTargetDate: Date,
    targetDateString: string,
    daysFromToday: number
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 FIXED: WeatherForecastApiHandler.fetchLiveForecast - STARTING', {
      cityName,
      coordinates: { lat, lng },
      targetDateString,
      daysFromToday,
      normalizedTargetDate: normalizedTargetDate.toISOString(),
      timestamp: new Date().toISOString()
    });

    if (!this.apiClient.hasApiKey()) {
      console.error('🔧 FIXED: No API key available for live forecast');
      return null;
    }

    try {
      // Attempt to get forecast data from the API
      console.log('🔧 FIXED: Calling apiClient.getForecast for', cityName);
      
      const forecastResponse = await this.apiClient.getForecast(lat, lng);
      
      console.log('🔧 FIXED: Raw forecast response received for', cityName, {
        hasForecast: !!forecastResponse,
        forecastLength: forecastResponse?.list?.length || 0,
        forecastData: forecastResponse ? {
          city: forecastResponse.city?.name,
          country: forecastResponse.city?.country,
          listLength: forecastResponse.list?.length
        } : null
      });

      if (!forecastResponse || !forecastResponse.list || forecastResponse.list.length === 0) {
        console.error('🔧 FIXED: Invalid or empty forecast response for', cityName);
        return null;
      }

      // Process the forecast data into ForecastDay format matching the expected types
      const processedForecast: ForecastDay[] = forecastResponse.list.map((item: any, index: number) => {
        const forecastDate = new Date(item.dt * 1000);
        const dateString = forecastDate.toISOString().split('T')[0];
        
        return {
          date: dateString,
          dateString,
          temperature: {
            high: Math.round(item.main?.temp_max || 0),
            low: Math.round(item.main?.temp_min || 0)
          },
          description: item.weather?.[0]?.description || 'Unknown',
          icon: item.weather?.[0]?.icon || '01d',
          precipitationChance: Math.round((item.pop || 0) * 100).toString() + '%',
          humidity: item.main?.humidity || 0,
          windSpeed: Math.round((item.wind?.speed || 0) * 2.237) // Convert m/s to mph
        };
      });

      console.log('🔧 FIXED: Processed forecast data for', cityName, {
        processedCount: processedForecast.length,
        availableDates: processedForecast.map(f => f.dateString),
        targetDateString
      });

      // Use EnhancedWeatherForecastMatcher to find the best match
      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast,
        normalizedTargetDate,
        targetDateString,
        cityName
      );

      console.log('🔧 FIXED: Forecast matching result for', cityName, {
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo.matchType,
        matchedDate: matchResult.matchInfo.matchedDate,
        confidence: matchResult.matchInfo.confidence,
        daysOffset: matchResult.matchInfo.daysOffset
      });

      if (matchResult.matchedForecast) {
        const forecastData: ForecastWeatherData = {
          temperature: matchResult.matchedForecast.temperature.high,
          highTemp: matchResult.matchedForecast.temperature.high,
          lowTemp: matchResult.matchedForecast.temperature.low,
          description: matchResult.matchedForecast.description,
          icon: matchResult.matchedForecast.icon,
          humidity: matchResult.matchedForecast.humidity,
          windSpeed: matchResult.matchedForecast.windSpeed,
          precipitationChance: parseInt(matchResult.matchedForecast.precipitationChance.replace('%', '')),
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: normalizedTargetDate,
          isActualForecast: true,
          source: 'live_forecast',
          matchedForecastDay: matchResult.matchedForecast,
          dateMatchInfo: {
            ...matchResult.matchInfo,
            source: 'live_forecast'
          }
        };

        console.log('🔧 FIXED: Successfully created live forecast data for', cityName, {
          temperature: forecastData.temperature,
          isActualForecast: forecastData.isActualForecast,
          source: forecastData.source,
          matchInfo: forecastData.dateMatchInfo
        });

        return forecastData;
      } else {
        console.error('🔧 FIXED: No suitable forecast match found for', cityName, {
          targetDateString,
          availableDates: processedForecast.map(f => f.dateString)
        });
        return null;
      }

    } catch (error) {
      console.error('🔧 FIXED: Error in fetchLiveForecast for', cityName, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return null;
    }
  }
}
