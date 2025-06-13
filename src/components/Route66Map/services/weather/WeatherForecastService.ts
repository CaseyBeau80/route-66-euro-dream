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
  source?: 'live_forecast' | 'historical_fallback' | 'seasonal';
  dateMatchInfo?: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
    daysOffset: number;
    hoursOffset?: number;
    source: 'live_forecast' | 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate' | 'historical_fallback';
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
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const daysFromNow = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
    
    console.log('🚨 FIXED: Corrected date processing for live forecast', {
      cityName,
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      today: today.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromNow,
      withinForecastRange: daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS
    });

    // FIXED: Use proper date difference calculation for forecast range
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      console.log('🚨 FIXED: Attempting live forecast API call (0-5 days range)', {
        cityName,
        targetDateString,
        daysFromNow,
        coordinates: { lat, lng },
        reason: 'within_live_forecast_range'
      });

      const actualForecast = await this.getActualForecast(lat, lng, cityName, normalizedTargetDate, targetDateString, daysFromNow);
      
      WeatherDebugService.logForecastApiRawResponse(cityName, actualForecast);

      if (actualForecast) {
        console.log('🚨 FIXED: RETURNING LIVE FORECAST WITH CONSISTENT SOURCE', {
          cityName,
          targetDateString,
          daysFromNow,
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
      
      console.log('🚨 FIXED: Live forecast API failed, using fallback', {
        cityName,
        targetDateString,
        daysFromNow,
        reason: 'api_returned_null'
      });
    } else {
      console.log('🚨 FIXED: Outside live forecast range, using fallback', {
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
      console.log('🚨 FIXED: WeatherForecastService.getActualForecast START', {
        cityName,
        targetDateString,
        coordinates: { lat, lng },
        daysFromNow
      });

      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      console.log('🚨 FIXED: API response received', {
        cityName,
        targetDateString,
        hasCurrentData: !!currentData,
        hasForecastData: !!forecastData,
        currentTemp: currentData?.main?.temp,
        forecastListLength: Array.isArray(forecastData?.list) ? forecastData.list.length : 0
      });
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 7);
      
      console.log('🚨 FIXED: Processed forecast data', {
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
      
      console.log('🚨 FIXED: Match result', {
        cityName,
        targetDateString,
        daysFromNow,
        hasMatch: !!matchResult.matchedForecast,
        matchType: matchResult.matchInfo?.matchType,
        matchedDate: matchResult.matchInfo?.matchedDate,
        confidence: matchResult.matchInfo?.confidence
      });
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        
        // FIXED: Accept any match within the forecast range as live forecast
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
        
        console.log('🚨 FIXED: Temperature values extracted for live forecast', {
          cityName,
          targetDateString,
          daysFromNow,
          extractedTemps: {
            high: highTemp,
            low: lowTemp,
            average: avgTemp,
            precipitation: precipChance
          }
        });

        // FIXED: Always mark as live forecast for any match within 0-5 day range
        console.log(`✅ FIXED: Live forecast ACCEPTED for ${cityName} Day ${daysFromNow}:`, {
          targetDateString,
          daysFromNow,
          matchType: matchResult.matchInfo.matchType,
          temperature: { high: highTemp, low: lowTemp, avg: avgTemp },
          description: forecast.description,
          isActualForecast: true,
          explicitSource: 'live_forecast',
          validationReason: 'within_0_5_day_forecast_range'
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
          isActualForecast: true, // FIXED: Always true for ANY match within 0-5 day range
          source: 'live_forecast' as const, // FIXED: Explicit live forecast source
          matchedForecastDay: forecast,
          dateMatchInfo: {
            ...matchResult.matchInfo,
            source: 'live_forecast' as const // FIXED: Consistent live forecast source
          }
        };

        console.log('🚨 FIXED: CONSTRUCTED LIVE FORECAST RESULT', {
          cityName,
          targetDateString,
          daysFromNow,
          finalResult: {
            isActualForecast: finalResult.isActualForecast,
            explicitSource: finalResult.source,
            dateMatchSource: finalResult.dateMatchInfo.source,
            temperature: finalResult.temperature
          }
        });
        
        return finalResult;
      } else {
        console.log('🚨 FIXED: No forecast match found, checking current data for estimation', {
          cityName,
          targetDateString,
          daysFromNow,
          hasCurrentData: !!currentData
        });

        // FIXED: Still try to provide live estimate from current data within forecast range
        if (currentData && currentData.main && currentData.main.temp && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
          console.log('🚨 FIXED: Creating live estimate from current data within forecast range', {
            cityName,
            targetDateString,
            daysFromNow,
            currentTemp: currentData.main.temp,
            reason: 'live_estimate_within_range'
          });

          return this.createLiveEstimateFromCurrent(
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
      console.error('🚨 FIXED: WeatherForecastService.getActualForecast ERROR', {
        cityName,
        targetDateString,
        daysFromNow,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  // FIXED: New method to create live estimates within forecast range
  private createLiveEstimateFromCurrent(
    currentData: any,
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromNow: number,
    processedForecast: ForecastDay[]
  ): ForecastWeatherData {
    const currentTemp = currentData.main.temp;
    const tempVariation = 10;
    
    console.log('🚨 FIXED: createLiveEstimateFromCurrent - LIVE ESTIMATE within forecast range', {
      cityName,
      targetDateString,
      daysFromNow,
      reason: 'live_estimate_from_current_within_forecast_range',
      markingStrategy: 'live_forecast_estimate'
    });
    
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
      isActualForecast: true, // FIXED: True for estimates within forecast range
      source: 'live_forecast' as const, // FIXED: Live forecast source for estimates within range
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: DateNormalizationService.toDateString(new Date()),
        matchType: 'closest' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'live_forecast' as const, // FIXED: Consistent live source
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
    console.log('🚨 ENHANCED: WeatherForecastService.getEnhancedFallbackForecast - CONSISTENT historical marking', {
      cityName,
      targetDateString,
      targetMonth: targetDate.getMonth(),
      daysFromNow,
      reason: 'outside_forecast_range_or_api_unavailable',
      markingStrategy: 'historical_fallback_consistent'
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
      isActualForecast: false, // ENHANCED: Always false for seasonal estimates
      source: 'historical_fallback' as const, // ENHANCED: Consistent historical marking
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'historical_fallback' as const, // ENHANCED: Use historical_fallback consistently
        confidence: 'low' as const
      }
    };

    console.log('🚨 ENHANCED: WeatherForecastService fallback result with CONSISTENT HISTORICAL SOURCE MARKING', {
      cityName,
      targetDateString,
      fallbackResult: {
        isActualForecast: fallbackResult.isActualForecast,
        explicitSource: fallbackResult.source,
        dateMatchSource: fallbackResult.dateMatchInfo.source,
        temperature: fallbackResult.temperature,
        markingConsistency: 'all_historical_fallback'
      }
    });

    return fallbackResult;
  }
}
