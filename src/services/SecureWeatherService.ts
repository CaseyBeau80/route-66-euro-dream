
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
      console.log('🔒 SecureWeatherService: Calling Edge Function for', cityName, {
        targetDate: targetDate?.toISOString(),
        usingSupabaseSecrets: true
      });
      
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
        console.log('❌ SecureWeatherService: No data returned from Edge Function');
        return this.createFallbackWeather(cityName, targetDate);
      }

      console.log('✅ SecureWeatherService: Live weather received from Edge Function:', {
        city: cityName,
        temperature: data.temperature,
        source: data.source,
        isActualForecast: data.isActualForecast,
        secureConnection: true
      });

      return data as ForecastWeatherData;
      
    } catch (error) {
      console.error('❌ SecureWeatherService: Edge Function call failed:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  /**
   * Check if the secure weather service is available by testing the Edge Function
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      console.log('🔍 SecureWeatherService: Testing Edge Function availability');
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: { cityName: 'test' }
      });
      
      // If we get a response (even an error), the function is available
      const isAvailable = !error || !error.message?.includes('not found');
      
      console.log('🔍 SecureWeatherService: Availability check result:', {
        isAvailable,
        hasError: !!error,
        errorMessage: error?.message
      });
      
      return isAvailable;
    } catch (error) {
      console.error('❌ SecureWeatherService: Availability check failed:', error);
      return false;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate?: Date): ForecastWeatherData {
    const date = targetDate || new Date();
    const targetDateString = date.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('🔄 SecureWeatherService: Creating fallback weather for', cityName, {
      targetDate: targetDateString,
      daysFromToday
    });
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      date,
      targetDateString,
      daysFromToday
    );
  }
}
