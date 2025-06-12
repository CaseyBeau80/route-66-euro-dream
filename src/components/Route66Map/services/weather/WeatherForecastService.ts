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
  dateMatchInfo?: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
    daysOffset: number;
    hoursOffset?: number;
    source: 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate';
    confidence?: 'high' | 'medium' | 'low';
    availableDates?: string[];
  };
}

export class WeatherForecastService {
  private apiClient: WeatherApiClient;
  private readonly FORECAST_THRESHOLD_DAYS = 5;

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
    
    // 🚨 DEBUG INJECTION: Constructor logging
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
    // 🚨 DEBUG INJECTION: Entry point logging
    console.log('🚨 DEBUG: WeatherForecastService.getWeatherForDate ENTRY POINT', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng },
      timestamp: new Date().toISOString(),
      callStack: new Error().stack?.split('\n').slice(1, 4)
    });

    // Use centralized date normalization with enhanced debugging
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    const daysFromNow = Math.ceil((normalizedTargetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    // 🚨 DEBUG INJECTION: Date processing logging
    console.log('🚨 DEBUG: WeatherForecastService date processing', {
      cityName,
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      daysFromNow,
      withinForecastRange: daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS
    });

    WeatherDataDebugger.debugWeatherFlow(
      `WeatherForecastService.getWeatherForDate [${cityName}]`,
      {
        originalDate: targetDate.toISOString(),
        normalizedDate: normalizedTargetDate.toISOString(),
        targetDateString,
        daysFromNow,
        withinForecastRange: daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS
      }
    );

    // Try to get actual forecast if within range
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      // 🚨 DEBUG INJECTION: API attempt logging
      console.log('🚨 DEBUG: WeatherForecastService attempting actual forecast API call', {
        cityName,
        targetDateString,
        daysFromNow,
        coordinates: { lat, lng },
        reason: 'within_forecast_range'
      });

      const actualForecast = await this.getActualForecast(lat, lng, cityName, normalizedTargetDate, targetDateString, daysFromNow);
      
      // 🎯 NEW: Use specific debug marker for raw API response
      WeatherDebugService.logForecastApiRawResponse(cityName, actualForecast);

      if (actualForecast) {
        WeatherDataDebugger.debugApiResponse(cityName, targetDateString, actualForecast);
        
        // 🚨 DEBUG INJECTION: Success return logging
        console.log('🚨 DEBUG: WeatherForecastService RETURNING ACTUAL FORECAST', {
          cityName,
          targetDateString,
          finalResult: {
            temperature: actualForecast.temperature,
            highTemp: actualForecast.highTemp,
            lowTemp: actualForecast.lowTemp,
            isActualForecast: actualForecast.isActualForecast,
            description: actualForecast.description,
            source: actualForecast.dateMatchInfo?.source
          }
        });
        
        return actualForecast;
      }
      
      // 🚨 DEBUG INJECTION: API failure logging
      console.log('🚨 DEBUG: WeatherForecastService API failed, creating enhanced fallback', {
        cityName,
        targetDateString,
        reason: 'api_returned_null'
      });
      console.log(`⚠️ WeatherForecastService: API failed for ${cityName}, creating enhanced fallback`);
    } else {
      // 🚨 DEBUG INJECTION: Out of range logging
      console.log('🚨 DEBUG: WeatherForecastService skipping API (out of range)', {
        cityName,
        targetDateString,
        daysFromNow,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        reason: 'outside_forecast_range'
      });
    }

    // Return enhanced fallback
    const fallbackForecast = this.getEnhancedFallbackForecast(cityName, normalizedTargetDate, targetDateString, daysFromNow);
    
    // 🎯 NEW: Use specific debug marker for fallback response
    WeatherDebugService.logForecastApiRawResponse(cityName, fallbackForecast);
    
    WeatherDataDebugger.debugApiResponse(cityName, targetDateString, fallbackForecast);
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
      // 🚨 DEBUG INJECTION: API call start
      console.log('🚨 DEBUG: WeatherForecastService.getActualForecast START', {
        cityName,
        targetDateString,
        coordinates: { lat, lng },
        daysFromNow
      });

      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.getActualForecast [${cityName}]`,
        { targetDateString, daysFromNow, coordinates: { lat, lng } }
      );

      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      // 🚨 DEBUG INJECTION: API response logging
      console.log('🚨 DEBUG: WeatherForecastService API response received', {
        cityName,
        targetDateString,
        hasCurrentData: !!currentData,
        hasForecastData: !!forecastData,
        currentTemp: currentData?.main?.temp,
        forecastListLength: Array.isArray(forecastData?.list) ? forecastData.list.length : 0
      });
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 5);
      
      // 🚨 DEBUG INJECTION: Processed forecast logging
      console.log('🚨 DEBUG: WeatherForecastService processed forecast data', {
        cityName,
        targetDateString,
        processedCount: processedForecast.length,
        availableDates: processedForecast.map(f => f.dateString).filter(Boolean),
        firstFewForecasts: processedForecast.slice(0, 3).map(f => ({
          dateString: f.dateString,
          temperature: f.temperature,
          description: f.description
        }))
      });
      
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.processedForecast [${cityName}]`,
        {
          processedCount: processedForecast.length,
          availableDates: processedForecast.map(f => f.dateString).filter(Boolean)
        }
      );
      
      // Use enhanced date matching
      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast, 
        targetDate, 
        targetDateString, 
        cityName
      );
      
      // 🚨 DEBUG INJECTION: Match result logging
      console.log('🚨 DEBUG: WeatherForecastService match result', {
        cityName,
        targetDateString,
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo?.matchType,
        matchedDate: matchResult.matchInfo?.matchedDate,
        confidence: matchResult.matchInfo?.confidence,
        matchedTemperature: matchResult.matchedForecast?.temperature
      });
      
      WeatherDataDebugger.debugWeatherMatching(cityName, targetDateString, processedForecast, matchResult);
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        
        // 🚨 DEBUG INJECTION: Temperature extraction logging
        console.log('🚨 DEBUG: WeatherForecastService extracting temperatures', {
          cityName,
          targetDateString,
          rawTemperature: forecast.temperature,
          temperatureType: typeof forecast.temperature,
          isObject: typeof forecast.temperature === 'object'
        });

        // Handle temperature extraction properly
        const extractTemperature = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp;
          if (temp && typeof temp === 'object' && 'high' in temp && 'low' in temp) {
            return Math.round((temp.high + temp.low) / 2);
          }
          return 0;
        };

        const extractHighTemp = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp;
          if (temp && typeof temp === 'object' && 'high' in temp) return temp.high;
          return 0;
        };

        const extractLowTemp = (temp: number | { high: number; low: number; } | undefined): number => {
          if (typeof temp === 'number') return temp;
          if (temp && typeof temp === 'object' && 'low' in temp) return temp.low;
          return 0;
        };

        const highTemp = extractHighTemp(forecast.temperature);
        const lowTemp = extractLowTemp(forecast.temperature);
        const avgTemp = extractTemperature(forecast.temperature);
        const precipChance = parseInt(String(forecast.precipitationChance)) || 0;
        
        // 🚨 DEBUG INJECTION: Final temperature values logging
        console.log('🚨 DEBUG: WeatherForecastService final temperature values', {
          cityName,
          targetDateString,
          extractedTemps: {
            high: highTemp,
            low: lowTemp,
            average: avgTemp,
            precipitation: precipChance
          },
          forecast: {
            description: forecast.description,
            icon: forecast.icon,
            humidity: forecast.humidity,
            windSpeed: forecast.windSpeed
          }
        });
        
        console.log(`✅ Enhanced forecast match for ${cityName} on ${targetDateString}:`, {
          matchType: matchResult.matchInfo.matchType,
          matchedDate: matchResult.matchInfo.matchedDate,
          confidence: matchResult.matchInfo.confidence,
          temperature: { high: highTemp, low: lowTemp, avg: avgTemp }
        });
        
        const finalResult = {
          temperature: avgTemp || highTemp || lowTemp,
          highTemp: highTemp,
          lowTemp: lowTemp,
          description: forecast.description || 'Clear',
          icon: forecast.icon || '01d',
          humidity: forecast.humidity || 50,
          windSpeed: forecast.windSpeed || 0,
          precipitationChance: precipChance,
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: targetDate,
          isActualForecast: true,
          matchedForecastDay: forecast,
          dateMatchInfo: {
            ...matchResult.matchInfo,
            source: 'api-forecast' as const
          }
        };

        // 🚨 DEBUG INJECTION: Final result construction logging
        console.log('🚨 DEBUG: WeatherForecastService CONSTRUCTED FINAL RESULT', {
          cityName,
          targetDateString,
          finalResult,
          isValid: !!(finalResult.temperature && finalResult.description),
          temperatureCheck: {
            hasTemperature: !!finalResult.temperature,
            hasHighTemp: !!finalResult.highTemp,
            hasLowTemp: !!finalResult.lowTemp,
            temperatureValue: finalResult.temperature
          }
        });
        
        return finalResult;
      } else {
        // 🚨 DEBUG INJECTION: No match fallback logging
        console.log('🚨 DEBUG: WeatherForecastService no match found, creating current-based forecast', {
          cityName,
          targetDateString,
          hasCurrentData: !!currentData,
          currentTemp: currentData?.main?.temp
        });

        // Create enhanced forecast from current data if no match found
        return this.createEnhancedForecastFromCurrent(
          currentData, 
          cityName, 
          targetDate, 
          targetDateString, 
          daysFromNow, 
          processedForecast
        );
      }
    } catch (error) {
      // 🚨 DEBUG INJECTION: Error logging
      console.error('🚨 DEBUG: WeatherForecastService.getActualForecast ERROR', {
        cityName,
        targetDateString,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.error [${cityName}]`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
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
    // 🚨 DEBUG INJECTION: Fallback forecast creation logging
    console.log('🚨 DEBUG: WeatherForecastService.getEnhancedFallbackForecast', {
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
      isActualForecast: false,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'seasonal-estimate' as const,
        confidence: 'low' as const
      }
    };

    // 🚨 DEBUG INJECTION: Fallback result logging
    console.log('🚨 DEBUG: WeatherForecastService fallback result created', {
      cityName,
      targetDateString,
      fallbackResult
    });

    return fallbackResult;
  }
}
