import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EdgeFunctionWeatherService } from './services/EdgeFunctionWeatherService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { UnifiedDateService } from '../../services/UnifiedDateService';

export interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  /**
   * UNIFIED: Enhanced weather fetching using Supabase edge function
   */
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView, segmentDay } = params;
    
    console.log('🔧 UNIFIED FETCHER: Using Supabase edge function for weather:', {
      cityName,
      targetDate: targetDate.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(targetDate),
      isSharedView,
      segmentDay,
      usingEdgeFunction: true
    });

    // Use unified date service for range check
    const isWithinForecastRange = UnifiedDateService.isWithinLiveForecastRange(targetDate);
    const daysFromToday = UnifiedDateService.getDaysFromToday(targetDate);
    
    console.log('🌤️ UNIFIED FETCHER: Date analysis:', {
      cityName,
      targetDate: targetDate.toLocaleDateString(),
      daysFromToday,
      isWithinForecastRange,
      isToday: UnifiedDateService.isToday(targetDate)
    });

    // Try to fetch live weather using Supabase edge function (which has API key access)
    try {
      console.log('🌤️ UNIFIED FETCHER: Attempting edge function weather fetch for', cityName, 'daysFromToday:', daysFromToday);
      
      const edgeWeather = await EdgeFunctionWeatherService.fetchWeatherFromEdgeFunction({
        cityName,
        targetDate,
        segmentDay
      });
      
      if (edgeWeather) {
        console.log('✅ UNIFIED FETCHER: Edge function weather successful for', cityName, {
          temperature: edgeWeather.temperature,
          source: edgeWeather.source,
          isActualForecast: edgeWeather.isActualForecast,
          daysFromToday,
          isToday: UnifiedDateService.isToday(targetDate)
        });
        return edgeWeather;
      }
    } catch (error) {
      console.error('❌ UNIFIED FETCHER: Edge function weather failed for', cityName, error);
    }

    // Fallback to historical weather
    console.log('🔄 UNIFIED FETCHER: Using fallback weather for', cityName);
    return this.createFallbackWeather(cityName, targetDate);
  }

  /**
   * UNIFIED: Fallback weather creation using unified date service
   */
  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = UnifiedDateService.formatForApi(targetDate);
    const daysFromToday = UnifiedDateService.getDaysFromToday(targetDate);
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
