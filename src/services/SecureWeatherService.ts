
import { supabase } from '@/integrations/supabase/client';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SecureWeatherService {
  /**
   * Fetch weather forecast using secure Supabase Edge Function
   */
  static async fetchWeatherForecast(
    cityName: string, 
    targetDate?: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🔒 SecureWeatherService: Fetching weather via Edge Function for', cityName);
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          cityName,
          targetDate: targetDate?.toISOString()
        }
      });

      if (error) {
        console.error('❌ SecureWeatherService: Edge Function error:', error);
        
        // If the service is not configured, return fallback
        if (error.message?.includes('not configured')) {
          console.log('🔄 SecureWeatherService: Service not configured, using fallback');
          return this.createFallbackWeather(cityName, targetDate);
        }
        
        throw error;
      }

      if (!data) {
        console.log('❌ SecureWeatherService: No data returned');
        return this.createFallbackWeather(cityName, targetDate);
      }

      console.log('✅ SecureWeatherService: Live weather received:', {
        city: cityName,
        temperature: data.temperature,
        source: data.source,
        isActualForecast: data.isActualForecast
      });

      return data as ForecastWeatherData;
      
    } catch (error) {
      console.error('❌ SecureWeatherService: Failed to fetch weather:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  /**
   * Check if the secure weather service is available
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('weather-forecast', {
        body: { cityName: 'test' }
      });
      
      // If we get a "not configured" error, the function exists but API key is missing
      // If we get a different error or success, the service is available
      return !error || !error.message?.includes('not configured');
    } catch {
      return false;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate?: Date): ForecastWeatherData {
    const date = targetDate || new Date();
    const targetDateString = date.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      date,
      targetDateString,
      daysFromToday
    );
  }
}
