
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
    
    console.log('🔧 SIMPLIFIED: WeatherForecastService with clear 5-day logic', {
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
    console.log('🎯 SIMPLIFIED: WeatherForecastService.getWeatherForDate', {
      cityName,
      targetDate: targetDate.toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🎯 SIMPLIFIED: Date range decision for', cityName, {
      targetDateString,
      daysFromToday,
      isWithinForecastRange,
      decision: isWithinForecastRange ? 'USE_LIVE_FORECAST' : 'USE_HISTORICAL_FALLBACK'
    });

    // CLEAR LOGIC: If within 0-5 days, try live forecast
    if (isWithinForecastRange) {
      console.log('📡 SIMPLIFIED: Attempting live forecast for', cityName, {
        reason: 'within_5_day_range',
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
        
        console.log('✅ SIMPLIFIED: Live forecast SUCCESS for', cityName, {
          daysFromToday,
          temperature: enhancedForecast.temperature,
          source: enhancedForecast.source,
          isActualForecast: enhancedForecast.isActualForecast
        });
        
        return enhancedForecast;
      }
      
      console.log('⚠️ SIMPLIFIED: Live forecast failed, falling back to historical for', cityName);
    } else {
      console.log('📊 SIMPLIFIED: Using historical weather for', cityName, {
        reason: 'beyond_5_day_range',
        daysFromToday
      });
    }

    // FALLBACK: Use historical weather
    const fallbackForecast = WeatherFallbackService.createFallbackForecast(
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    console.log('📊 SIMPLIFIED: Historical fallback applied for', cityName, {
      daysFromToday,
      source: fallbackForecast.source,
      isActualForecast: fallbackForecast.isActualForecast
    });
    
    return fallbackForecast;
  }
}
