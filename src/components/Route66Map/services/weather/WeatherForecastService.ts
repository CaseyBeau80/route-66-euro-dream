
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
    
    console.log('🔧 FIXED: WeatherForecastService with corrected 7-day logic', {
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
    console.log('🎯 FIXED: WeatherForecastService.getWeatherForDate', {
      cityName,
      targetDate: targetDate.toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🎯 FIXED: Date range decision for', cityName, {
      targetDateString,
      daysFromToday,
      isWithinForecastRange,
      decision: isWithinForecastRange ? 'USE_LIVE_FORECAST' : 'USE_HISTORICAL_FALLBACK'
    });

    // CORRECTED LOGIC: If within 0-6 days, try live forecast
    if (isWithinForecastRange) {
      console.log('📡 FIXED: Attempting live forecast for', cityName, {
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
        
        console.log('✅ FIXED: Live forecast SUCCESS for', cityName, {
          daysFromToday,
          temperature: enhancedForecast.temperature,
          source: enhancedForecast.source,
          isActualForecast: enhancedForecast.isActualForecast
        });
        
        return enhancedForecast;
      }
      
      console.log('⚠️ FIXED: Live forecast failed, falling back to historical for', cityName);
    } else {
      console.log('📊 FIXED: Using historical weather for', cityName, {
        reason: 'beyond_7_day_range',
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
    
    console.log('📊 FIXED: Historical fallback applied for', cityName, {
      daysFromToday,
      source: fallbackForecast.source,
      isActualForecast: fallbackForecast.isActualForecast
    });
    
    return fallbackForecast;
  }
}
