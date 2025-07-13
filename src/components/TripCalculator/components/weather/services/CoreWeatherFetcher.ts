
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EdgeFunctionWeatherService } from './EdgeFunctionWeatherService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
}

export class CoreWeatherFetcher {
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView = false } = request;
    
    console.log('🌤️ CoreWeatherFetcher: Using Supabase edge function for weather:', {
      cityName,
      targetDate: targetDate.toISOString(),
      isSharedView,
      usingEdgeFunction: true
    });

    try {
      // STEP 1: Try to get weather from Supabase edge function (which has access to API key)
      const segmentDay = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      const edgeWeather = await EdgeFunctionWeatherService.fetchWeatherFromEdgeFunction({
        cityName,
        targetDate,
        segmentDay
      });

      if (edgeWeather) {
        console.log('✅ CoreWeatherFetcher: Successfully got weather from edge function:', {
          cityName,
          temperature: edgeWeather.temperature,
          source: edgeWeather.source,
          isActualForecast: edgeWeather.isActualForecast
        });
        return edgeWeather;
      }

      console.log('⚠️ CoreWeatherFetcher: Edge function failed, using fallback weather');

      // STEP 2: Create fallback weather if edge function fails
      return this.createFallbackWeather(cityName, targetDate);

    } catch (error) {
      console.error('❌ CoreWeatherFetcher: Error getting weather:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PLAN: Creating enhanced fallback weather:', {
      cityName,
      targetDateString,
      daysFromToday,
      enhancedFallback: true
    });

    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
