
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
    
    console.log('🔧 ENHANCED: WeatherForecastService with strict Day 7+ logic', {
      hasApiKey: !!apiKey,
      forecastRange: 'Days 0-6 (inclusive)',
      historicalRange: 'Day 7 and beyond (STRICTLY ENFORCED)',
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🎯 ENHANCED: WeatherForecastService.getWeatherForDate with strict validation', {
      cityName,
      targetDate: targetDate.toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🎯 ENHANCED: Date range decision for', cityName, {
      targetDateString,
      daysFromToday,
      isWithinForecastRange,
      decision: isWithinForecastRange ? 'USE_LIVE_FORECAST' : 'FORCE_HISTORICAL_FALLBACK'
    });

    // ENHANCED LOGIC: Strict enforcement of Day 7+ as historical
    if (!isWithinForecastRange) {
      console.log('📊 ENHANCED: STRICTLY enforcing historical weather for Day 7+:', {
        cityName,
        daysFromToday,
        reason: 'beyond_6_day_forecast_threshold',
        enforcementLevel: 'STRICT'
      });

      // Force historical weather for Day 7+
      const fallbackForecast = WeatherFallbackService.createFallbackForecast(
        cityName, 
        normalizedTargetDate, 
        targetDateString, 
        daysFromToday
      );
      
      // ENHANCED: Ensure proper marking for historical data
      const enhancedFallback = {
        ...fallbackForecast,
        source: 'historical_fallback' as const,
        isActualForecast: false,
        dateMatchInfo: {
          ...fallbackForecast.dateMatchInfo,
          source: 'historical_fallback' as const
        }
      };
      
      console.log('📊 ENHANCED: Historical fallback STRICTLY applied for Day 7+:', {
        cityName,
        daysFromToday,
        source: enhancedFallback.source,
        isActualForecast: enhancedFallback.isActualForecast,
        dateMatchSource: enhancedFallback.dateMatchInfo?.source
      });
      
      return enhancedFallback;
    }

    // Try live forecast only for Days 0-6
    console.log('📡 ENHANCED: Attempting live forecast for Days 0-6:', cityName, {
      reason: 'within_7_day_range',
      daysFromToday
    });

    const actualForecast = await this.apiHandler.fetchLiveForecast(
      lat, 
      lng, 
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    if (actualForecast) {
      // ENHANCED: Strict validation before marking as live forecast
      const isValidLiveForecast = (
        daysFromToday >= 0 && 
        daysFromToday <= 6 && 
        actualForecast.isActualForecast === true
      );

      if (isValidLiveForecast) {
        // Ensure it's properly marked as live forecast
        const enhancedForecast = {
          ...actualForecast,
          source: 'live_forecast' as const,
          isActualForecast: true,
          dateMatchInfo: {
            ...actualForecast.dateMatchInfo,
            source: 'live_forecast' as const
          }
        };
        
        console.log('✅ ENHANCED: Live forecast SUCCESS with validation for', cityName, {
          daysFromToday,
          temperature: enhancedForecast.temperature,
          source: enhancedForecast.source,
          isActualForecast: enhancedForecast.isActualForecast,
          validation: 'PASSED'
        });
        
        return enhancedForecast;
      } else {
        console.warn('⚠️ ENHANCED: Live forecast failed validation, forcing historical:', {
          cityName,
          daysFromToday,
          originalIsActualForecast: actualForecast.isActualForecast,
          validationFailure: 'invalid_live_forecast_criteria'
        });
      }
    }
    
    console.log('⚠️ ENHANCED: Live forecast failed, falling back to historical for', cityName);

    // FALLBACK: Use historical weather with proper marking
    const fallbackForecast = WeatherFallbackService.createFallbackForecast(
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    // ENHANCED: Ensure proper marking for fallback data
    const enhancedFallback = {
      ...fallbackForecast,
      source: 'historical_fallback' as const,
      isActualForecast: false,
      dateMatchInfo: {
        ...fallbackForecast.dateMatchInfo,
        source: 'historical_fallback' as const
      }
    };
    
    console.log('📊 ENHANCED: Historical fallback applied with proper marking for', cityName, {
      daysFromToday,
      source: enhancedFallback.source,
      isActualForecast: enhancedFallback.isActualForecast,
      dateMatchSource: enhancedFallback.dateMatchInfo?.source
    });
    
    return enhancedFallback;
  }
}
