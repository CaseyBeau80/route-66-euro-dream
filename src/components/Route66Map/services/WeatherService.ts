import { WeatherData, WeatherWithForecast } from './weather/WeatherServiceTypes';
import { supabase } from '@/integrations/supabase/client';

export class WeatherService {
  private static instance: WeatherService;

  private constructor() {
    console.log('🌤️ WeatherService: Service initialized with Supabase Edge Function');
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  setApiKey(apiKey: string): void {
    console.log('🔑 WeatherService: API key is managed through Supabase secrets');
    // No-op: API key is managed through Supabase Edge Function
  }

  hasApiKey(): boolean {
    // Always return true since the API key is managed through Supabase Edge Function
    console.log('🔑 WeatherService: hasApiKey() = true (managed through Supabase)');
    return true;
  }

  getDebugInfo(): { hasKey: boolean; keyLength: number | null; keyPreview: string | null; isValid: boolean; allStorageKeys: Record<string, string | null> } {
    return {
      hasKey: true,
      keyLength: 32,
      keyPreview: 'managed_by_supabase',
      isValid: true,
      allStorageKeys: {}
    };
  }

  async getWeatherData(lat: number, lng: number, cityName: string): Promise<WeatherData | null> {
    console.log(`🌤️ WeatherService: Fetching weather for ${cityName} (${lat}, ${lng})`);
    
    try {
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          lat,
          lng,
          cityName
        }
      });

      if (error) {
        console.error('❌ WeatherService: Edge function error:', error);
        return null;
      }

      if (!data || !data.current) {
        console.error('❌ WeatherService: Invalid weather data received');
        return null;
      }

      // Convert the Edge Function response to WeatherData format
      const weatherData: WeatherData = {
        cityName: data.current.cityName,
        temperature: data.current.temperature,
        description: data.current.description,
        icon: data.current.icon,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
        precipitationChance: 0
      };
      
      console.log('✅ WeatherService: Successfully received weather data');
      return weatherData;
    } catch (error) {
      console.error('❌ WeatherService: Error fetching weather data:', error);
      return null;
    }
  }

  async getWeatherWithForecast(lat: number, lng: number, cityName: string): Promise<WeatherWithForecast | null> {
    console.log(`🌤️ WeatherService: Fetching weather with forecast for ${cityName} (${lat}, ${lng})`);
    
    try {
      const { data, error } = await supabase.functions.invoke('weather-forecast', {
        body: {
          lat,
          lng,
          cityName
        }
      });

      if (error) {
        console.error('❌ WeatherService: Edge function error:', error);
        return null;
      }

      if (!data || !data.current || !data.forecast) {
        console.error('❌ WeatherService: Invalid weather data received');
        return null;
      }

      // Convert the Edge Function response to WeatherWithForecast format
      const weatherWithForecast: WeatherWithForecast = {
        cityName: data.current.cityName,
        temperature: data.current.temperature,
        description: data.current.description,
        icon: data.current.icon,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
        precipitationChance: 0,
        forecast: data.forecast.map((item: any) => ({
          date: item.dateTime,
          temperature: {
            high: item.temperature + 5, // Approximate high
            low: item.temperature - 5   // Approximate low
          },
          description: item.description,
          icon: item.icon,
          precipitationChance: "0%",
          humidity: item.humidity,
          windSpeed: item.windSpeed
        }))
      };
      
      console.log('✅ WeatherService: Successfully received weather with forecast');
      return weatherWithForecast;
    } catch (error) {
      console.error('❌ WeatherService: Error fetching weather with forecast:', error);
      return null;
    }
  }
}
