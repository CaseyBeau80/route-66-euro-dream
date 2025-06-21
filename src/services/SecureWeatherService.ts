
import { supabase } from '@/integrations/supabase/client';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export class SecureWeatherService {
  /**
   * Fetch weather forecast using secure Supabase Edge Function with comprehensive error handling
   */
  static async fetchWeatherForecast(
    cityName: string, 
    targetDate?: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      console.log('🔒 UNIFIED SecureWeatherService: Starting weather fetch for', cityName, {
        targetDate: targetDate?.toISOString(),
        targetDateLocal: targetDate?.toLocaleDateString(),
        usingSupabaseSecrets: true,
        unifiedService: true
      });

      // Enhanced date range calculation with proper timezone handling
      const today = new Date();
      const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const normalizedTargetDate = targetDate ? 
        new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()) : 
        normalizedToday;
      
      const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
      const isWithinLiveForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

      console.log('🔒 UNIFIED SecureWeatherService: Enhanced date analysis:', {
        originalTargetDate: targetDate?.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        daysFromToday,
        isWithinLiveForecastRange,
        liveForecastRangeLimit: '0-7 days',
        unifiedDateCalculation: true
      });
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          cityName,
          targetDate: targetDate?.toISOString()
        }
      });

      if (error) {
        console.error('❌ UNIFIED SecureWeatherService: Edge Function error:', error);
        
        // If the service is not configured, return fallback
        if (error.message?.includes('not configured') || error.message?.includes('API key')) {
          console.log('🔄 UNIFIED SecureWeatherService: API key not configured, using fallback');
          return this.createEnhancedFallbackWeather(cityName, targetDate, 'no_api_key');
        }
        
        // For other errors, still provide fallback
        console.log('🔄 UNIFIED SecureWeatherService: Edge Function failed, using fallback');
        return this.createEnhancedFallbackWeather(cityName, targetDate, 'edge_function_error');
      }

      if (!data) {
        console.log('❌ UNIFIED SecureWeatherService: No data returned from Edge Function');
        return this.createEnhancedFallbackWeather(cityName, targetDate, 'no_data');
      }

      // Enhanced validation that matches Edge Function logic
      const isActuallyLive = data.source === 'live_forecast' && 
                            data.isActualForecast === true && 
                            isWithinLiveForecastRange;

      console.log('✅ UNIFIED SecureWeatherService: Weather received from Edge Function:', {
        city: cityName,
        temperature: data.temperature,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp,
        source: data.source,
        isActualForecast: data.isActualForecast,
        daysFromToday,
        isWithinLiveForecastRange,
        isActuallyLive,
        secureConnection: true,
        unifiedValidation: true,
        shouldBeLive: daysFromToday >= 0 && daysFromToday <= 7 ? 'YES' : 'NO',
        validationResult: isActuallyLive ? 'LIVE_FORECAST' : 'ESTIMATED_FORECAST'
      });

      // Ensure proper validation and return the data
      const validatedData = {
        ...data,
        isActualForecast: data.isActualForecast,
        source: data.source,
        cityName: cityName, // Ensure city name is set
        forecastDate: targetDate || new Date(),
        forecast: data.forecast || []
      } as ForecastWeatherData;

      return validatedData;
      
    } catch (error) {
      console.error('❌ UNIFIED SecureWeatherService: Edge Function call failed:', error);
      return this.createEnhancedFallbackWeather(cityName, targetDate, 'fetch_error');
    }
  }

  /**
   * Check if the secure weather service is available
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      console.log('🔍 UNIFIED SecureWeatherService: Testing service availability');
      
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: { cityName: 'test', targetDate: new Date().toISOString() }
      });
      
      // If we get a response (even an error), the function is available
      const isAvailable = !error || !error.message?.includes('not found');
      
      console.log('🔍 UNIFIED SecureWeatherService: Availability check result:', {
        isAvailable,
        hasError: !!error,
        errorMessage: error?.message,
        unifiedCheck: true
      });
      
      return isAvailable;
    } catch (error) {
      console.error('❌ UNIFIED SecureWeatherService: Availability check failed:', error);
      return false;
    }
  }

  /**
   * Create enhanced fallback weather with better seasonal data
   */
  private static createEnhancedFallbackWeather(
    cityName: string, 
    targetDate?: Date, 
    reason?: string
  ): ForecastWeatherData {
    const date = targetDate || new Date();
    const targetDateString = date.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log('🔄 UNIFIED SecureWeatherService: Creating enhanced fallback for', cityName, {
      targetDate: targetDateString,
      daysFromToday,
      reason,
      fallbackType: daysFromToday > 7 ? 'seasonal_estimate' : 'recent_api_failure',
      unifiedFallback: true
    });
    
    // Use the existing fallback service but with enhanced metadata
    const fallbackData = WeatherFallbackService.createFallbackForecast(
      cityName,
      date,
      targetDateString,
      daysFromToday
    );

    // Enhance the fallback data with additional context
    return {
      ...fallbackData,
      source: 'historical_fallback' as const,
      isActualForecast: false,
      cityName: cityName,
      forecastDate: date,
      forecast: [],
      // Add debug info for better troubleshooting
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: targetDateString,
        matchType: 'seasonal-estimate' as const,
        daysOffset: daysFromToday,
        source: 'historical_fallback' as const,
        confidence: 'low' as const
      }
    };
  }
}
