
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchResult {
  weather: ForecastWeatherData | null;
  error: string | null;
}

export class UnifiedWeatherService {
  /**
   * Main entry point for all weather fetching - always tries live first
   */
  static async fetchWeatherForSegment(
    cityName: string,
    targetDate: Date,
    segmentDay: number,
    forceRefresh: boolean = false
  ): Promise<WeatherFetchResult> {
    console.log('🌤️ CRITICAL FIX: UnifiedWeatherService enhanced live weather fetching for', cityName, {
      targetDate: targetDate.toISOString(),
      segmentDay,
      forceRefresh,
      alwaysTriesLiveFirst: true
    });

    // Step 1: Always check for API key first
    const apiKey = WeatherApiKeyManager.getApiKey();
    const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

    console.log('🔑 CRITICAL FIX: API key validation:', {
      hasApiKey: !!apiKey,
      isValidFormat: hasValidApiKey,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? apiKey.substring(0, 8) + '...' : 'none'
    });

    // Step 2: Check if date is within live forecast range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateCopy = new Date(targetDate);
    targetDateCopy.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;

    console.log('📅 CRITICAL FIX: Date analysis for live forecast:', {
      today: today.toISOString(),
      targetDate: targetDateCopy.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      shouldAttemptLive: hasValidApiKey && isWithinForecastRange
    });

    // Step 3: Attempt live forecast if conditions are met
    if (hasValidApiKey && isWithinForecastRange) {
      try {
        console.log('🌤️ CRITICAL FIX: Attempting live forecast for', cityName);
        const liveWeather = await this.fetchLiveWeather(cityName, targetDate, apiKey);
        
        if (liveWeather) {
          console.log('✅ CRITICAL FIX: Live forecast SUCCESS for', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            liveWeatherConfirmed: true
          });
          return { weather: liveWeather, error: null };
        }
      } catch (error) {
        console.error('❌ CRITICAL FIX: Live forecast failed for', cityName, error);
      }
    }

    // Step 4: Fall back to historical data
    console.log('🔄 CRITICAL FIX: Using fallback weather for', cityName, {
      reason: !hasValidApiKey ? 'no_api_key' : !isWithinForecastRange ? 'outside_forecast_range' : 'live_fetch_failed'
    });

    const fallbackWeather = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDate.toISOString().split('T')[0],
      daysFromToday
    );

    return { weather: fallbackWeather, error: null };
  }

  /**
   * CRITICAL FIX: Enhanced live weather API call with explicit property setting
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
        console.log('❌ CRITICAL FIX: No coordinates for', cityName);
        return null;
      }

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌤️ CRITICAL FIX: Calling OpenWeather API for', cityName);

      const response = await fetch(forecastUrl);
      if (!response.ok) {
        console.error('❌ CRITICAL FIX: API call failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.error('❌ CRITICAL FIX: No forecast data returned');
        return null;
      }

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0]; // Fallback to first available

      // CRITICAL FIX: Create live forecast data with EXPLICIT properties
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
        isActualForecast: true, // CRITICAL: Explicitly true for live API data
        source: 'live_forecast' // CRITICAL: Explicitly set to live_forecast
      };

      console.log('✅ CRITICAL FIX: Live weather data created for', cityName, {
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source,
        description: liveWeather.description,
        explicitLiveProperties: true
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ CRITICAL FIX: Live weather fetch error:', error);
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
      console.error('❌ CRITICAL FIX: Geocoding error:', error);
      return null;
    }
  }
}
