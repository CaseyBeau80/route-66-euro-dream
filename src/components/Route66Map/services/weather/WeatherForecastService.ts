
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { WeatherDateCalculator } from './WeatherDateCalculator';
import { WeatherForecastApiHandler } from './WeatherForecastApiHandler';
import { WeatherFallbackService } from './WeatherFallbackService';
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
  private apiHandler: WeatherForecastApiHandler;

  constructor(apiKey: string) {
    this.apiHandler = new WeatherForecastApiHandler(apiKey);
    
    console.log('🔧 FIXED: WeatherForecastService initialized with corrected forecast logic', {
      hasApiKey: !!apiKey,
      forecastRange: 'Days 0-5 (inclusive)',
      historicalRange: 'Day 6 and beyond',
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 FIXED: WeatherForecastService.getWeatherForDate - ENTRY WITH CORRECTED FORECAST RANGE', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng },
      timestamp: new Date().toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🔧 FIXED: WeatherForecastService - ROUTING DECISION WITH CORRECTED LOGIC', {
      cityName,
      dateInfo: {
        targetDateString,
        daysFromToday,
        isWithinForecastRange,
        correctedDecision: isWithinForecastRange ? 'FORCE_LIVE_FORECAST_ATTEMPT' : 'USE_HISTORICAL_FALLBACK'
      },
      logic: {
        forecastRange: '0-5 days from today',
        historicalRange: '6+ days from today',
        currentDecision: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL'
      }
    });

    // FIXED: Force live forecast attempt for days 0-5
    if (isWithinForecastRange) {
      console.log('🔧 FIXED: FORCING live forecast attempt for', cityName, {
        reason: 'within_6_day_range',
        daysFromToday,
        targetDateString,
        willAttemptLiveForecast: true,
        correctedForecastRange: true
      });

      try {
        const actualForecast = await this.apiHandler.fetchLiveForecast(
          lat, 
          lng, 
          cityName, 
          normalizedTargetDate, 
          targetDateString, 
          daysFromToday
        );
        
        if (actualForecast) {
          const enhancedForecast = {
            ...actualForecast,
            source: 'live_forecast' as const,
            isActualForecast: true,
            dateMatchInfo: {
              ...actualForecast.dateMatchInfo,
              source: 'live_forecast' as const
            }
          };
          
          console.log('🔧 FIXED: Live forecast SUCCESS for', cityName, {
            daysFromToday,
            temperature: enhancedForecast.temperature,
            source: enhancedForecast.source,
            isActualForecast: enhancedForecast.isActualForecast,
            dateMatching: enhancedForecast.dateMatchInfo,
            correctedForecastRange: true
          });
          
          return enhancedForecast;
        } else {
          console.error('🔧 FIXED: Live forecast returned NULL for', cityName, {
            daysFromToday,
            targetDateString,
            reason: 'api_handler_returned_null'
          });
        }
      } catch (error) {
        console.error('🔧 FIXED: Live forecast FAILED with error for', cityName, {
          error: error instanceof Error ? error.message : String(error),
          daysFromToday,
          targetDateString
        });
      }
      
      console.log('🔧 FIXED: Live forecast failed, falling back to historical for', cityName);
    } else {
      console.log('🔧 FIXED: Using historical weather for', cityName, {
        reason: 'beyond_6_day_range',
        daysFromToday,
        targetDateString,
        correctedForecastRange: true
      });
    }

    // Fallback to historical weather with normalized date
    const fallbackForecast = WeatherFallbackService.createFallbackForecast(
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    console.log('🔧 FIXED: Historical fallback applied for', cityName, {
      daysFromToday,
      source: fallbackForecast.source,
      isActualForecast: fallbackForecast.isActualForecast,
      targetDateString,
      fallbackReason: isWithinForecastRange ? 'live_forecast_failed' : 'beyond_forecast_range',
      correctedForecastRange: true
    });
    
    return fallbackForecast;
  }
}
