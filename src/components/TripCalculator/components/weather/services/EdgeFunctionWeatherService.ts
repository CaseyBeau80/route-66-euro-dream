
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { supabase } from '@/integrations/supabase/client';

export interface EdgeFunctionWeatherParams {
  cityName: string;
  targetDate: Date;
  segmentDay: number;
}

export class EdgeFunctionWeatherService {
  /**
   * Fetch weather data directly from the Edge Function using proper Supabase invocation
   */
  static async fetchWeatherFromEdgeFunction(params: EdgeFunctionWeatherParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, segmentDay } = params;
    
    console.log('🌐 FIXED EDGE FUNCTION: Fetching weather from Edge Function with correct URL:', {
      cityName,
      targetDate: targetDate.toISOString(),
      segmentDay,
      usingSupabaseFunctionInvoke: true
    });

    try {
      // Use proper Supabase function invocation instead of fetch
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          cityName: cityName,
          targetDate: targetDate.toISOString()
        }
      });

      if (error) {
        console.error('❌ FIXED EDGE FUNCTION: Supabase function invocation error:', {
          error,
          errorDetails: error.message || 'Unknown error',
          cityName,
          segmentDay
        });
        return null;
      }

      console.log('✅ FIXED EDGE FUNCTION: Raw response from Edge Function:', {
        cityName,
        data,
        hasTemperature: data?.temperature !== undefined,
        hasHighTemp: data?.highTemp !== undefined,
        hasLowTemp: data?.lowTemp !== undefined,
        source: data?.source,
        isActualForecast: data?.isActualForecast
      });

      if (!data || data.temperature === undefined) {
        console.error('❌ FIXED EDGE FUNCTION: Invalid response data:', {
          cityName,
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : [],
          missingTemperature: !data?.temperature
        });
        return null;
      }

      // Create ForecastWeatherData directly from Edge Function response
      const weatherData: ForecastWeatherData = {
        temperature: Math.round(data.temperature),
        highTemp: data.highTemp ? Math.round(data.highTemp) : Math.round(data.temperature),
        lowTemp: data.lowTemp ? Math.round(data.lowTemp) : Math.round(data.temperature),
        description: data.description || 'Partly Cloudy',
        icon: data.icon || '02d',
        humidity: data.humidity || 65,
        windSpeed: Math.round(data.windSpeed || 5),
        precipitationChance: Math.round(data.precipitationChance || 20),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: data.isActualForecast || false,
        source: data.source || 'historical_fallback'
      };

      console.log('✅ FIXED EDGE FUNCTION: Created weather data with proper URL fix:', {
        cityName,
        temperature: weatherData.temperature,
        highTemp: weatherData.highTemp,
        lowTemp: weatherData.lowTemp,
        source: weatherData.source,
        isActualForecast: weatherData.isActualForecast,
        shouldShowLiveBadge: weatherData.source === 'live_forecast' && weatherData.isActualForecast === true,
        fixImplemented: {
          urlFixed: 'Using supabase.functions.invoke instead of fetch',
          payloadFixed: 'Using cityName and targetDate format',
          errorHandlingImproved: true
        }
      });

      return weatherData;

    } catch (error) {
      console.error('❌ FIXED EDGE FUNCTION: Request failed with enhanced error handling:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        cityName,
        segmentDay,
        requestAttempted: 'supabase.functions.invoke'
      });
      return null;
    }
  }
}
