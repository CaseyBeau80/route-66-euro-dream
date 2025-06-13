
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
    
    console.log('🔧 PLAN: WeatherForecastService initialized with normalized date logic', {
      hasApiKey: !!apiKey,
      forecastRange: 'Days 0-6 (inclusive)',
      historicalRange: 'Day 7 and beyond',
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    // PLAN IMPLEMENTATION: Use normalized date calculation
    console.log('🔧 PLAN: WeatherForecastService.getWeatherForDate - ENTRY', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng }
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    // PLAN IMPLEMENTATION: Enhanced debug output for routing decision
    console.log('🔧 PLAN: WeatherForecastService - ROUTING DECISION', {
      cityName,
      dateInfo: {
        targetDateString,
        daysFromToday,
        isWithinForecastRange,
        decision: isWithinForecastRange ? 'USE_LIVE_FORECAST' : 'USE_HISTORICAL_FALLBACK'
      },
      logic: {
        forecastRange: '0-6 days from today',
        historicalRange: '7+ days from today',
        currentDecision: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL'
      }
    });

    // PLAN IMPLEMENTATION: Corrected logic - If within 0-6 days, try live forecast
    if (isWithinForecastRange) {
      console.log('🔧 PLAN: Attempting live forecast for', cityName, {
        reason: 'within_7_day_range',
        daysFromToday,
        targetDateString
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
        // PLAN IMPLEMENTATION: Ensure it's properly marked as live forecast
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
          dateMatching: enhancedForecast.dateMatchInfo
        });
        
        return enhancedForecast;
      }
      
      console.log('🔧 PLAN: Live forecast failed, falling back to historical for', cityName);
    } else {
      console.log('🔧 PLAN: Using historical weather for', cityName, {
        reason: 'beyond_7_day_range',
        daysFromToday,
        targetDateString
      });
    }

    // PLAN IMPLEMENTATION: Fallback to historical weather with normalized date
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
      targetDateString
    });
    
    return fallbackForecast;
  }
}
