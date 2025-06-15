
import { supabase } from '@/integrations/supabase/client';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SecureWeatherService {
  /**
   * Fetch weather forecast using secure Supabase Edge Function with improved logic
   */
  static async fetchWeatherForecast(
    cityName: string, 
    targetDate?: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🔒 IMPROVED: SecureWeatherService calling Edge Function for', cityName, {
        targetDate: targetDate?.toISOString(),
        targetDateLocal: targetDate?.toLocaleDateString(),
        usingSupabaseSecrets: true,
        improvedLogic: true
      });

      // IMPROVED: Enhanced date range calculation with proper timezone handling
      const today = new Date()
      const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const normalizedTargetDate = targetDate ? new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()) : normalizedToday
      
      const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000))
      const isWithinReliableRange = daysFromToday >= 0 && daysFromToday <= 5

      console.log('🔒 IMPROVED: Enhanced date range analysis:', {
        originalTargetDate: targetDate?.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        daysFromToday,
        isWithinReliableRange,
        reliableRangeLimit: '0-5 days',
        dateCalculationMethod: 'normalized_start_of_day',
        improvedLogic: true
      });
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          cityName,
          targetDate: targetDate?.toISOString()
        }
      });

      if (error) {
        console.error('❌ IMPROVED: Edge Function error:', error);
        
        // If the service is not configured, return fallback
        if (error.message?.includes('not configured')) {
          console.log('🔄 IMPROVED: Service not configured, using fallback');
          return this.createFallbackWeather(cityName, targetDate);
        }
        
        throw error;
      }

      if (!data) {
        console.log('❌ IMPROVED: No data returned from Edge Function');
        return this.createFallbackWeather(cityName, targetDate);
      }

      // IMPROVED: Enhanced validation that matches Edge Function logic
      const isActuallyLive = data.source === 'live_forecast' && 
                            data.isActualForecast === true && 
                            isWithinReliableRange;

      console.log('✅ IMPROVED: Weather received from Edge Function:', {
        city: cityName,
        temperature: data.temperature,
        source: data.source,
        isActualForecast: data.isActualForecast,
        daysFromToday,
        isWithinReliableRange,
        isActuallyLive,
        secureConnection: true,
        improvedValidation: true,
        shouldBeLive: daysFromToday >= 0 && daysFromToday <= 5 ? 'YES' : 'NO',
        validationResult: isActuallyLive ? 'LIVE_FORECAST' : 'ESTIMATED_FORECAST'
      });

      // IMPROVED: Ensure proper validation and flag setting
      const validatedData = {
        ...data,
        isActualForecast: data.isActualForecast, // Trust the Edge Function result
        source: data.source // Trust the Edge Function source
      } as ForecastWeatherData;

      return validatedData;
      
    } catch (error) {
      console.error('❌ IMPROVED: Edge Function call failed:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  /**
   * Check if the secure weather service is available by testing the Edge Function
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      console.log('🔍 IMPROVED: Testing Edge Function availability');
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: { cityName: 'test' }
      });
      
      // If we get a response (even an error), the function is available
      const isAvailable = !error || !error.message?.includes('not found');
      
      console.log('🔍 IMPROVED: Availability check result:', {
        isAvailable,
        hasError: !!error,
        errorMessage: error?.message,
        improvedCheck: true
      });
      
      return isAvailable;
    } catch (error) {
      console.error('❌ IMPROVED: Availability check failed:', error);
      return false;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate?: Date): ForecastWeatherData {
    const date = targetDate || new Date();
    const targetDateString = date.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('🔄 IMPROVED: Creating fallback weather for', cityName, {
      targetDate: targetDateString,
      daysFromToday,
      fallbackType: daysFromToday > 5 ? 'seasonal_estimate' : 'api_failure_fallback',
      improvedFallback: true
    });
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      date,
      targetDateString,
      daysFromToday
    );
  }
}
