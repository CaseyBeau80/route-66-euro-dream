
import { supabase } from '@/integrations/supabase/client';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SecureWeatherService {
  /**
   * Fetch weather forecast using secure Supabase Edge Function with improved date handling
   */
  static async fetchWeatherForecast(
    cityName: string, 
    targetDate?: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🔒 SecureWeatherService: Calling Edge Function for', cityName, {
        targetDate: targetDate?.toISOString(),
        targetDateLocal: targetDate?.toLocaleDateString(),
        usingSupabaseSecrets: true
      });

      // IMPROVED: Better date range calculation with explicit timezone handling
      const today = new Date()
      // Normalize today to start of day for consistent comparison
      const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const normalizedTargetDate = targetDate ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()) : normalizedToday
      
      const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000))
      const isWithinReliableRange = daysFromToday >= 0 && daysFromToday <= 6

      console.log('🔒 SecureWeatherService: IMPROVED date range analysis:', {
        originalTargetDate: targetDate?.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        daysFromToday,
        isWithinReliableRange,
        reliableRangeLimit: '0-6 days',
        dateCalculationMethod: 'normalized_start_of_day'
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

      // IMPROVED: More explicit validation of live weather criteria
      const isActuallyLive = data.source === 'live_forecast' && 
                            data.isActualForecast === true && 
                            isWithinReliableRange;

      console.log('✅ SecureWeatherService: Weather received from Edge Function:', {
        city: cityName,
        temperature: data.temperature,
        source: data.source,
        isActualForecast: data.isActualForecast,
        daysFromToday,
        isWithinReliableRange,
        isActuallyLive,
        secureConnection: true,
        improvedValidation: true,
        shouldBeLive: daysFromToday >= 0 && daysFromToday <= 6 ? 'YES' : 'NO'
      });

      // IMPROVED: Ensure the data is properly flagged based on validation
      const validatedData = {
        ...data,
        isActualForecast: isActuallyLive,
        source: isWithinReliableRange && data.source === 'live_forecast' ? 'live_forecast' : 'historical_fallback'
      } as ForecastWeatherData;

      return validatedData;
      
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
      daysFromToday,
      fallbackType: daysFromToday > 6 ? 'seasonal_estimate' : 'api_failure_fallback'
    });
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      date,
      targetDateString,
      daysFromToday
    );
  }
}
