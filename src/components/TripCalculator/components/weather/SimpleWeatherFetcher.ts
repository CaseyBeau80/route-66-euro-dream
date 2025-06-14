
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  /**
   * CRITICAL FIX: Unified weather fetching that works consistently in ALL views
   */
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView, segmentDay } = params;
    
    // CRITICAL FIX: Always check API key directly from manager
    const actualApiKey = WeatherApiKeyManager.getApiKey();
    const hasActualApiKey = !!actualApiKey && actualApiKey !== 'YOUR_API_KEY_HERE';
    
    console.log('🔧 FIXED: SimpleWeatherFetcher unified check:', {
      cityName,
      targetDate: targetDate.toISOString(),
      isSharedView,
      hasActualApiKey,
      apiKeyLength: actualApiKey?.length || 0,
      apiKeyPreview: actualApiKey?.substring(0, 8) + '...',
      segmentDay,
      unifiedPath: true
    });

    // If no valid API key, return fallback immediately
    if (!hasActualApiKey) {
      console.log('🔄 FIXED: No API key - returning fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    // Check if date is within live forecast range (0-7 days from today)
    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysFromToday < 0 || daysFromToday > 7) {
      console.log('🔄 FIXED: Date outside forecast range - returning fallback for', cityName, { daysFromToday });
      return this.createFallbackWeather(cityName, targetDate);
    }

    // Try to fetch live weather
    try {
      console.log('🌤️ FIXED: Attempting live weather fetch for', cityName);
      const liveWeather = await this.fetchLiveWeatherDirect(cityName, targetDate, actualApiKey);
      
      if (liveWeather) {
        console.log('✅ FIXED: Live weather successful for', cityName, {
          temperature: liveWeather.temperature,
          source: liveWeather.source,
          isActualForecast: liveWeather.isActualForecast
        });
        return liveWeather;
      }
    } catch (error) {
      console.error('❌ FIXED: Live weather failed for', cityName, error);
    }

    // Fallback to historical weather
    console.log('🔄 FIXED: Using fallback weather for', cityName);
    return this.createFallbackWeather(cityName, targetDate);
  }

  /**
   * CRITICAL FIX: Direct live weather fetching with proper error handling
   */
  private static async fetchLiveWeatherDirect(
    cityName: string, 
    targetDate: Date, 
    apiKey: string
  ): Promise<ForecastWeatherData | null> {
    try {
      // Get coordinates
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ FIXED: Could not get coordinates for', cityName);
        return null;
      }

      // Fetch weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ FIXED: Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ FIXED: No forecast data for', cityName);
        return null;
      }

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      // CRITICAL FIX: Create live forecast with explicit properties
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true, // CRITICAL: Always true for live API data
        source: 'live_forecast' as const // CRITICAL: Always live_forecast for API data
      };

      console.log('✅ FIXED: Created live forecast for', cityName, {
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        description: liveWeather.description
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ FIXED: Live weather fetch failed for', cityName, error);
      return null;
    }
  }

  /**
   * CRITICAL FIX: Geocoding helper
   */
  private static async getCoordinates(cityName: string, apiKey: string) {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      const result = data.find((r: any) => r.country === 'US') || data[0];
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ FIXED: Geocoding error:', error);
      return null;
    }
  }

  /**
   * CRITICAL FIX: Fallback weather creation
   */
  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
