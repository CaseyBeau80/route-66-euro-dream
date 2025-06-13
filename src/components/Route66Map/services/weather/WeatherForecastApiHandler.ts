
import { WeatherApiClient } from './WeatherApiClient';
import { ForecastWeatherData } from './WeatherForecastService';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { EnhancedWeatherForecastMatcher } from '../../../TripCalculator/components/weather/EnhancedWeatherForecastMatcher';

export class WeatherForecastApiHandler {
  private apiClient: WeatherApiClient;

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
    
    console.log('🔧 PLAN: WeatherForecastApiHandler initialized with enhanced processing', {
      hasApiKey: !!apiKey,
      timestamp: new Date().toISOString(),
      planImplementation: true
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
    console.log('🔧 PLAN: WeatherForecastApiHandler.fetchLiveForecast - ENHANCED API PROCESSING', {
      cityName,
      coordinates: { lat, lng },
      targetDateString,
      daysFromToday,
      normalizedTargetDate: normalizedTargetDate.toISOString(),
      timestamp: new Date().toISOString(),
      planImplementation: true
    });

    if (!this.apiClient.hasApiKey()) {
      console.error('🔧 PLAN: No API key available for live forecast', {
        planImplementation: true
      });
      return null;
    }

    try {
      console.log('🔧 PLAN: Calling apiClient.getForecast with enhanced processing for', cityName);
      
      const forecastResponse = await this.apiClient.getForecast(lat, lng);
      
      console.log('🔧 PLAN: Raw forecast response received for', cityName, {
        hasForecast: !!forecastResponse,
        forecastLength: forecastResponse?.list?.length || 0,
        forecastData: forecastResponse ? {
          city: forecastResponse.city?.name,
          country: forecastResponse.city?.country,
          listLength: forecastResponse.list?.length,
          firstItem: forecastResponse.list?.[0] ? {
            dt: forecastResponse.list[0].dt,
            dtTxt: forecastResponse.list[0].dt_txt,
            temp: forecastResponse.list[0].main?.temp
          } : null
        } : null,
        planImplementation: true
      });

      if (!forecastResponse || !forecastResponse.list || forecastResponse.list.length === 0) {
        console.error('🔧 PLAN: Invalid or empty forecast response for', cityName, {
          planImplementation: true
        });
        return null;
      }

      // PLAN IMPLEMENTATION: Enhanced forecast data processing with better date handling
      const processedForecast: ForecastDay[] = forecastResponse.list.map((item: any, index: number) => {
        const forecastDate = new Date(item.dt * 1000);
        const dateString = forecastDate.toISOString().split('T')[0];
        
        console.log(`🔧 PLAN: Processing forecast item ${index + 1}/${forecastResponse.list.length} for ${cityName}:`, {
          originalDt: item.dt,
          forecastDate: forecastDate.toISOString(),
          dateString,
          temp: item.main?.temp,
          tempMax: item.main?.temp_max,
          tempMin: item.main?.temp_min,
          description: item.weather?.[0]?.description,
          planImplementation: true
        });
        
        return {
          date: dateString,
          dateString,
          temperature: {
            high: Math.round(item.main?.temp_max || item.main?.temp || 0),
            low: Math.round(item.main?.temp_min || item.main?.temp || 0)
          },
          description: item.weather?.[0]?.description || 'Unknown',
          icon: item.weather?.[0]?.icon || '01d',
          precipitationChance: Math.round((item.pop || 0) * 100).toString() + '%',
          humidity: item.main?.humidity || 0,
          windSpeed: Math.round((item.wind?.speed || 0) * 2.237) // Convert m/s to mph
        };
      });

      console.log('🔧 PLAN: Enhanced forecast processing completed for', cityName, {
        processedCount: processedForecast.length,
        availableDates: processedForecast.map(f => f.dateString),
        targetDateString,
        dateMatching: 'enhanced_matching_strategies',
        planImplementation: true
      });

      // PLAN IMPLEMENTATION: Use enhanced forecast matcher with improved strategies
      console.log('🔧 PLAN: Starting enhanced forecast matching for', cityName, {
        targetDateString,
        availableDates: processedForecast.map(f => f.dateString),
        matchingStrategies: ['exact', 'closest_72h', 'adjacent_3d', 'fallback'],
        planImplementation: true
      });

      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast,
        normalizedTargetDate,
        targetDateString,
        cityName
      );

      console.log('🔧 PLAN: Enhanced forecast matching result for', cityName, {
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo.matchType,
        matchedDate: matchResult.matchInfo.matchedDate,
        confidence: matchResult.matchInfo.confidence,
        daysOffset: matchResult.matchInfo.daysOffset,
        hoursOffset: matchResult.matchInfo.hoursOffset,
        planImplementation: true
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

        console.log('🔧 PLAN: Successfully created enhanced live forecast data for', cityName, {
          temperature: forecastData.temperature,
          highTemp: forecastData.highTemp,
          lowTemp: forecastData.lowTemp,
          isActualForecast: forecastData.isActualForecast,
          source: forecastData.source,
          matchInfo: forecastData.dateMatchInfo,
          planImplementation: true
        });

        return forecastData;
      } else {
        console.error('🔧 PLAN: Enhanced matching failed - no suitable forecast match found for', cityName, {
          targetDateString,
          availableDates: processedForecast.map(f => f.dateString),
          matchingStrategiesTried: ['exact', 'closest', 'adjacent', 'fallback'],
          planImplementation: true
        });
        return null;
      }

    } catch (error) {
      console.error('🔧 PLAN: Error in enhanced fetchLiveForecast for', cityName, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        planImplementation: true
      });
      return null;
    }
  }
}
