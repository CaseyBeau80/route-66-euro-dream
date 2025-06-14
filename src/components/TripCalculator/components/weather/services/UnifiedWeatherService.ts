
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchResult {
  weather: ForecastWeatherData | null;
  error: string | null;
}

export class UnifiedWeatherService {
  /**
   * FIXED: Main entry point for weather fetching with proper live forecast prioritization
   */
  static async fetchWeatherForSegment(
    cityName: string,
    targetDate: Date,
    segmentDay: number,
    forceRefresh: boolean = true // FIXED: Default to true to force live fetching
  ): Promise<WeatherFetchResult> {
    console.log('🌤️ FIXED: UnifiedWeatherService - Fetching weather for', cityName, targetDate.toISOString());

    // FIXED: Direct API key validation
    const apiKey = WeatherApiKeyManager.getApiKey();
    const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

    // FIXED: Expanded date analysis (0-7 days for live forecast)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateCopy = new Date(targetDate);
    targetDateCopy.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7; // FIXED: Extended range

    console.log('🌤️ FIXED: UnifiedWeatherService - Enhanced analysis:', {
      cityName,
      daysFromToday,
      isWithinForecastRange,
      hasValidApiKey,
      apiKeyLength: apiKey?.length || 0,
      forceRefresh
    });

    // FIXED: Try live forecast with proper conditions
    if (hasValidApiKey && isWithinForecastRange) {
      try {
        console.log('🌤️ FIXED: Attempting live forecast for', cityName);
        const liveWeather = await this.fetchLiveWeather(cityName, targetDate, apiKey);
        
        if (liveWeather) {
          console.log('✅ FIXED: Live forecast success for', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          return { weather: liveWeather, error: null };
        }
      } catch (error) {
        console.error('❌ FIXED: Live forecast failed:', error);
      }
    } else {
      console.log('🔄 FIXED: Skipping live forecast:', {
        hasValidApiKey,
        isWithinForecastRange,
        reason: !hasValidApiKey ? 'No API key' : 'Date outside range'
      });
    }

    // Fallback to historical data
    console.log('🔄 FIXED: Using fallback weather for', cityName);
    const fallbackWeather = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDate.toISOString().split('T')[0],
      daysFromToday
    );

    return { weather: fallbackWeather, error: null };
  }

  /**
   * FIXED: Live weather API call with enhanced error handling
   */
  private static async fetchLiveWeather(
    cityName: string,
    targetDate: Date,
    apiKey: string
  ): Promise<ForecastWeatherData | null> {
    try {
      // Get coordinates
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ FIXED: No coordinates for', cityName);
        return null;
      }

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌤️ FIXED: Fetching from API:', forecastUrl.replace(apiKey, 'API_KEY'));
      
      const response = await fetch(forecastUrl);
      
      if (!response.ok) {
        console.error('❌ FIXED: API call failed:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.error('❌ FIXED: No forecast data returned');
        return null;
      }

      console.log('✅ FIXED: API response received:', {
        cityName,
        listLength: data.list.length,
        firstItem: data.list[0] ? {
          dt: data.list[0].dt,
          temp: data.list[0].main?.temp,
          description: data.list[0].weather?.[0]?.description
        } : null
      });

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      // FIXED: Create live forecast data with explicit flags
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
        isActualForecast: true, // FIXED: CRITICAL - Always true for live API data
        source: 'live_forecast' as const // FIXED: CRITICAL - Always live_forecast for API data
      };

      console.log('✅ FIXED: Live weather created for', cityName, {
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        description: liveWeather.description
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ FIXED: Live weather fetch error:', error);
      return null;
    }
  }

  /**
   * Geocoding helper
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
}
