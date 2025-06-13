
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
    
    console.log('🔧 PLAN: WeatherForecastService initialized with EXPANDED forecast logic', {
      hasApiKey: !!apiKey,
      forecastRange: 'Days 0-7 (inclusive)',
      historicalRange: 'Day 8 and beyond',
      localDateCalculation: true,
      expandedRange: true,
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🔧 PLAN: WeatherForecastService.getWeatherForDate - ENTRY WITH EXPANDED FORECAST RANGE', {
      cityName,
      targetDate: targetDate.toISOString(),
      targetDateLocal: targetDate.toLocaleDateString(),
      coordinates: { lat, lng },
      localDateCalculation: true,
      expandedRange: true,
      timestamp: new Date().toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🔧 PLAN: WeatherForecastService - ROUTING DECISION WITH EXPANDED LOGIC', {
      cityName,
      dateInfo: {
        targetDateString,
        daysFromToday,
        isWithinForecastRange,
        expandedDecision: isWithinForecastRange ? 'FORCE_LIVE_FORECAST_ATTEMPT' : 'USE_HISTORICAL_FALLBACK'
      },
      logic: {
        forecastRange: '0-7 days from today',
        historicalRange: '8+ days from today',
        currentDecision: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL',
        expandedRange: true,
        localDateCalculation: true
      }
    });

    // PLAN IMPLEMENTATION: Force live forecast attempt for days 0-7
    if (isWithinForecastRange) {
      console.log('🔧 PLAN: FORCING live forecast attempt for', cityName, {
        reason: 'within_8_day_range',
        daysFromToday,
        targetDateString,
        willAttemptLiveForecast: true,
        expandedForecastRange: true,
        localDateCalculation: true
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
          
          console.log('🔧 PLAN: Live forecast SUCCESS for', cityName, {
            daysFromToday,
            temperature: enhancedForecast.temperature,
            source: enhancedForecast.source,
            isActualForecast: enhancedForecast.isActualForecast,
            dateMatching: enhancedForecast.dateMatchInfo,
            expandedForecastRange: true,
            localDateCalculation: true
          });
          
          return enhancedForecast;
        } else {
          console.error('🔧 PLAN: Live forecast returned NULL for', cityName, {
            daysFromToday,
            targetDateString,
            reason: 'api_handler_returned_null',
            expandedRange: true
          });
        }
      } catch (error) {
        console.error('🔧 PLAN: Live forecast FAILED with error for', cityName, {
          error: error instanceof Error ? error.message : String(error),
          daysFromToday,
          targetDateString,
          expandedRange: true
        });
      }
      
      console.log('🔧 PLAN: Live forecast failed, falling back to historical for', cityName);
    } else {
      console.log('🔧 PLAN: Using historical weather for', cityName, {
        reason: 'beyond_8_day_range',
        daysFromToday,
        targetDateString,
        expandedForecastRange: true,
        localDateCalculation: true
      });
    }

    // Fallback to historical weather with normalized date
    const fallbackForecast = WeatherFallbackService.createFallbackForecast(
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    console.log('🔧 PLAN: Historical fallback applied for', cityName, {
      daysFromToday,
      source: fallbackForecast.source,
      isActualForecast: fallbackForecast.isActualForecast,
      targetDateString,
      fallbackReason: isWithinForecastRange ? 'live_forecast_failed' : 'beyond_forecast_range',
      expandedForecastRange: true,
      localDateCalculation: true
    });
    
    return fallbackForecast;
  }
}
