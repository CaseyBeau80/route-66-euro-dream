
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';
import { EnhancedWeatherForecastMatcher } from '../../../TripCalculator/components/weather/EnhancedWeatherForecastMatcher';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';
import { WeatherDataDebugger } from '../../../TripCalculator/components/weather/WeatherDataDebugger';
import { WeatherDebugService } from '../../../TripCalculator/components/weather/services/WeatherDebugService';

export interface ForecastWeatherData extends WeatherData {
  forecast: ForecastDay[];
  forecastDate: Date;
  isActualForecast: boolean;
  highTemp?: number;
  lowTemp?: number;
  precipitationChance?: number;
  matchedForecastDay?: ForecastDay;
  source?: 'live_forecast' | 'historical_fallback';
  dateMatchInfo?: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
    daysOffset: number;
    hoursOffset?: number;
    source: 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate' | 'historical_fallback';
    confidence?: 'high' | 'medium' | 'low';
    availableDates?: string[];
  };
}

export class WeatherForecastService {
  private apiClient: WeatherApiClient;
  private readonly FORECAST_THRESHOLD_DAYS = 5; // FIXED: 0-5 days from now

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
    
    console.log('🔧 DEBUG: WeatherForecastService constructor called', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🚨 ENHANCED: WeatherForecastService.getWeatherForDate ENTRY POINT', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng },
      timestamp: new Date().toISOString()
    });

    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    const daysFromNow = Math.ceil((normalizedTargetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('🚨 ENHANCED: Date processing for live forecast', {
      cityName,
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      daysFromNow,
      withinForecastRange: daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      todayCheck: new Date().toISOString().split('T')[0],
      isToday: targetDateString === new Date().toISOString().split('T')[0]
    });

    // ENHANCED: Use 0-5 days range for live forecasts with explicit source marking
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      console.log('🚨 ENHANCED: Attempting live forecast API call (0-5 days range)', {
        cityName,
        targetDateString,
        daysFromNow,
        coordinates: { lat, lng },
        reason: 'within_live_forecast_range'
      });

      const actualForecast = await this.getActualForecast(lat, lng, cityName, normalizedTargetDate, targetDateString, daysFromNow);
      
      WeatherDebugService.logForecastApiRawResponse(cityName, actualForecast);

      if (actualForecast) {
        console.log('🚨 ENHANCED: RETURNING LIVE FORECAST WITH EXPLICIT SOURCE', {
          cityName,
          targetDateString,
          finalResult: {
            temperature: actualForecast.temperature,
            highTemp: actualForecast.highTemp,
            lowTemp: actualForecast.lowTemp,
            isActualForecast: actualForecast.isActualForecast,
            description: actualForecast.description,
            source: actualForecast.source,
            dateMatchSource: actualForecast.dateMatchInfo?.source
          }
        });
        
        return actualForecast;
      }
      
      console.log('🚨 ENHANCED: Live forecast API failed, using fallback', {
        cityName,
        targetDateString,
        reason: 'api_returned_null'
      });
    } else {
      console.log('🚨 ENHANCED: Outside live forecast range, using fallback', {
        cityName,
        targetDateString,
        daysFromNow,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        reason: 'outside_forecast_range'
      });
    }

    // Return enhanced fallback with explicit source marking
    const fallbackForecast = this.getEnhancedFallbackForecast(cityName, normalizedTargetDate, targetDateString, daysFromNow);
    
    WeatherDebugService.logForecastApiRawResponse(cityName, fallbackForecast);
    
    return fallbackForecast;
  }

  private async getActualForecast(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date, 
    targetDateString: string,
    daysFromNow: number
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🚨 ENHANCED: WeatherForecastService.getActualForecast START', {
        cityName,
        targetDateString,
        coordinates: { lat, lng },
        daysFromNow
      });

      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      console.log('🚨 ENHANCED: API response received', {
        cityName,
        targetDateString,
        hasCurrentData: !!currentData,
        hasForecastData: !!forecastData,
        currentTemp: currentData?.main?.temp,
        forecastListLength: Array.isArray(forecastData?.list) ? forecastData.list.length : 0
      });
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 5);
      
      console.log('🚨 ENHANCED: Processed forecast data', {
        cityName,
        targetDateString,
        processedCount: processedForecast.length,
        availableDates: processedForecast.map(f => f.dateString).filter(Boolean)
      });
      
      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast, 
        targetDate, 
        targetDateString, 
        cityName
      );
      
      console.log('🚨 ENHANCED: Match result', {
        cityName,
        targetDateString,
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo?.matchType,
        matchedDate: matchResult.matchInfo?.matchedDate,
        confidence: matchResult.matchInfo?.confidence
      });
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        
        // ENHANCED: Accept ANY forecast data that has basic weather info
        const extractTemperature = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp;
          if (temp && typeof temp === 'object' && 'high' in temp && 'low' in temp) {
            return Math.round((temp.high + temp.low) / 2);
          }
          return 70; // Reasonable fallback
        };

        const extractHighTemp = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp + 8; // Estimate
          if (temp && typeof temp === 'object' && 'high' in temp) return temp.high;
          return 78; // Reasonable fallback
        };

        const extractLowTemp = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp - 8; // Estimate
          if (temp && typeof temp === 'object' && 'low' in temp) return temp.low;
          return 62; // Reasonable fallback
        };

        const highTemp = extractHighTemp(forecast.temperature);
        const lowTemp = extractLowTemp(forecast.temperature);
        const avgTemp = extractTemperature(forecast.temperature);
        const precipChance = parseInt(String(forecast.precipitationChance)) || 0;
        
        console.log('🚨 ENHANCED: Final temperature values extracted', {
          cityName,
          targetDateString,
          extractedTemps: {
            high: highTemp,
            low: lowTemp,
            average: avgTemp,
            precipitation: precipChance
          }
        });

        // ENHANCED: Set isActualForecast=true and explicit source for ANY live forecast match
        console.log(`✅ ENHANCED: Live forecast ACCEPTED for ${cityName} on ${targetDateString}:`, {
          matchType: matchResult.matchInfo.matchType,
          temperature: { high: highTemp, low: lowTemp, avg: avgTemp },
          description: forecast.description,
          isActualForecast: true,
          explicitSource: 'live_forecast',
          validationReason: 'live_forecast_from_api'
        });
        
        const finalResult = {
          temperature: avgTemp,
          highTemp: highTemp,
          lowTemp: lowTemp,
          description: forecast.description || 'Weather forecast',
          icon: forecast.icon || '01d',
          humidity: forecast.humidity || 50,
          windSpeed: forecast.windSpeed || 0,
          precipitationChance: precipChance,
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: targetDate,
          isActualForecast: true, // ENHANCED: Always true for live API responses
          source: 'live_forecast' as const, // ENHANCED: Explicit source marking
          matchedForecastDay: forecast,
          dateMatchInfo: {
            ...matchResult.matchInfo,
            source: 'api-forecast' as const
          }
        };

        console.log('🚨 ENHANCED: CONSTRUCTED LIVE FORECAST RESULT WITH EXPLICIT SOURCE', {
          cityName,
          targetDateString,
          finalResult,
          explicitSource: finalResult.source,
          isValid: true
        });
        
        return finalResult;
      } else {
        console.log('🚨 ENHANCED: No match found, creating current-based forecast', {
          cityName,
          targetDateString,
          hasCurrentData: !!currentData
        });

        // Create enhanced forecast from current data if no match found
        if (currentData && currentData.main && currentData.main.temp) {
          return this.createEnhancedForecastFromCurrent(
            currentData, 
            cityName, 
            targetDate, 
            targetDateString, 
            daysFromNow, 
            processedForecast
          );
        }
      }

      console.log(`❌ No usable forecast data found for ${cityName} on ${targetDateString}`);
      return null;
    } catch (error) {
      console.error('🚨 ENHANCED: WeatherForecastService.getActualForecast ERROR', {
        cityName,
        targetDateString,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private createEnhancedForecastFromCurrent(
    currentData: any,
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromNow: number,
    processedForecast: ForecastDay[]
  ): ForecastWeatherData {
    const currentTemp = currentData.main.temp;
    const tempVariation = 10;
    
    return {
      temperature: Math.round(currentTemp),
      highTemp: Math.round(currentTemp + tempVariation/2),
      lowTemp: Math.round(currentTemp - tempVariation/2),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed || 0),
      precipitationChance: Math.round((currentData.main.humidity / 100) * 30),
      cityName: cityName,
      forecast: processedForecast,
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: DateNormalizationService.toDateString(new Date()),
        matchType: 'fallback' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'enhanced-fallback' as const,
        confidence: 'medium' as const
      }
    };
  }

  private getEnhancedFallbackForecast(
    cityName: string, 
    targetDate: Date, 
    targetDateString: string,
    daysFromNow: number
  ): ForecastWeatherData {
    console.log('🚨 ENHANCED: WeatherForecastService.getEnhancedFallbackForecast', {
      cityName,
      targetDateString,
      targetMonth: targetDate.getMonth(),
      daysFromNow
    });

    const month = targetDate.getMonth();
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    const fallbackResult = {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + tempVariation/2,
      lowTemp: seasonalTemp - tempVariation/2,
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      icon: SeasonalWeatherGenerator.getSeasonalIcon(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: SeasonalWeatherGenerator.getSeasonalPrecipitation(month),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false, // FIXED: Set to false for historical data
      source: 'historical_fallback' as const,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'historical_fallback' as const, // FIXED: Use historical_fallback consistently
        confidence: 'low' as const
      }
    };

    console.log('🚨 ENHANCED: WeatherForecastService fallback result created with historical source', {
      cityName,
      targetDateString,
      fallbackResult,
      explicitSource: fallbackResult.source,
      dateMatchSource: fallbackResult.dateMatchInfo.source,
      isActualForecast: fallbackResult.isActualForecast
    });

    return fallbackResult;
  }
}
