
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
    
    console.log('🔧 FIXED: WeatherForecastService constructor with corrected forecast logic', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      forecastThreshold: WeatherDateCalculator.forecastThresholdDays,
      forecastRangeDescription: '0-5 days inclusive',
      timestamp: new Date().toISOString()
    });
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🚨 FIXED: WeatherForecastService.getWeatherForDate ENTRY with corrected date logic', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng },
      timestamp: new Date().toISOString()
    });

    const dateInfo = WeatherDateCalculator.calculateDaysFromToday(targetDate);
    const { normalizedTargetDate, targetDateString, daysFromToday, isWithinForecastRange } = dateInfo;

    console.log('🚨 FIXED: Date processing completed', {
      cityName,
      targetDateString,
      daysFromToday,
      isWithinForecastRange,
      isToday: daysFromToday === 0,
      isTomorrow: daysFromToday === 1
    });

    if (isWithinForecastRange) {
      console.log('🚨 FIXED: Target date IS within live forecast range - attempting API call', {
        cityName,
        targetDateString,
        daysFromToday,
        coordinates: { lat, lng },
        reason: 'within_0_5_day_forecast_range_inclusive'
      });

      const actualForecast = await this.apiHandler.fetchLiveForecast(
        lat, 
        lng, 
        cityName, 
        normalizedTargetDate, 
        targetDateString, 
        daysFromToday
      );
      
      WeatherDebugService.logForecastApiRawResponse(cityName, actualForecast);

      if (actualForecast) {
        // FIXED: Ensure consistent source marking for live forecasts
        const enhancedForecast = {
          ...actualForecast,
          source: 'live_forecast' as const,
          isActualForecast: true,
          dateMatchInfo: {
            ...actualForecast.dateMatchInfo,
            source: 'live_forecast' as const
          }
        };
        
        console.log('🚨 FIXED: LIVE FORECAST SUCCESS - returning with CONSISTENT live source marking', {
          cityName,
          targetDateString,
          daysFromToday,
          finalResult: {
            temperature: enhancedForecast.temperature,
            highTemp: enhancedForecast.highTemp,
            lowTemp: enhancedForecast.lowTemp,
            isActualForecast: enhancedForecast.isActualForecast,
            description: enhancedForecast.description,
            source: enhancedForecast.source,
            dateMatchSource: enhancedForecast.dateMatchInfo?.source,
            shouldShowLiveBadge: true
          }
        });
        
        return enhancedForecast;
      }
      
      console.log('🚨 FIXED: Live forecast API failed within range, using fallback', {
        cityName,
        targetDateString,
        daysFromToday,
        reason: 'api_call_failed_within_range'
      });
    } else {
      console.log('🚨 FIXED: Target date is OUTSIDE live forecast range, using fallback', {
        cityName,
        targetDateString,
        daysFromToday,
        forecastThreshold: WeatherDateCalculator.forecastThresholdDays,
        reason: 'outside_0_5_day_forecast_range'
      });
    }

    // Return enhanced fallback with explicit historical source marking
    const fallbackForecast = WeatherFallbackService.createFallbackForecast(
      cityName, 
      normalizedTargetDate, 
      targetDateString, 
      daysFromToday
    );
    
    WeatherDebugService.logForecastApiRawResponse(cityName, fallbackForecast);
    
    return fallbackForecast;
  }
}
