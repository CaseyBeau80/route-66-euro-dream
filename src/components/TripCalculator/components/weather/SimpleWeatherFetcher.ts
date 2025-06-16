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
   * FIXED: Enhanced weather fetching with proper today handling
   */
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView, segmentDay } = params;
    
    // CRITICAL FIX: Always check API key directly from manager
    const actualApiKey = WeatherApiKeyManager.getApiKey();
    const hasActualApiKey = !!actualApiKey && actualApiKey !== 'YOUR_API_KEY_HERE';
    
    console.log('🔧 FIXED: SimpleWeatherFetcher with proper today handling:', {
      cityName,
      targetDate: targetDate.toISOString(),
      targetDateLocal: targetDate.toLocaleDateString(),
      isSharedView,
      hasActualApiKey,
      apiKeyLength: actualApiKey?.length || 0,
      segmentDay,
      todayHandling: 'FIXED'
    });

    // If no valid API key, return fallback immediately
    if (!hasActualApiKey) {
      console.log('🔄 FIXED: No API key - returning fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    // FIXED: Enhanced date range check - same calendar date as today is live forecast
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDiff = targetNormalized.getTime() - todayNormalized.getTime();
    const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    
    // FIXED: Same calendar date (day 0) through day 7 are live forecast
    const isWithinForecastRange = daysDiff >= 0 && daysDiff <= 7;
    
    console.log('🌤️ FIXED: Enhanced date analysis - same calendar date is today:', {
      cityName,
      targetDateLocal: targetDate.toLocaleDateString(),
      todayLocal: today.toLocaleDateString(),
      todayNormalized: todayNormalized.toLocaleDateString(),
      targetNormalized: targetNormalized.toLocaleDateString(),
      daysDiff,
      isWithinForecastRange,
      logic: 'Day 0 (same calendar date as today) = LIVE FORECAST',
      isSameDayAsToday: daysDiff === 0
    });

    if (!isWithinForecastRange) {
      console.log('🔄 FIXED: Date outside forecast range - returning fallback for', cityName, { daysDiff });
      return this.createFallbackWeather(cityName, targetDate);
    }

    // Try to fetch live weather for today and future dates
    try {
      console.log('🌤️ FIXED: Attempting live weather fetch for', cityName, 'daysDiff:', daysDiff);
      const liveWeather = await this.fetchLiveWeatherDirect(cityName, targetDate, actualApiKey);
      
      if (liveWeather) {
        console.log('✅ FIXED: Live weather successful for', cityName, {
          temperature: liveWeather.temperature,
          source: liveWeather.source,
          isActualForecast: liveWeather.isActualForecast,
          daysDiff,
          isSameDayAsToday: daysDiff === 0
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
   * FIXED: Enhanced live weather fetching with proper today detection
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

      // FIXED: For same calendar date as today, use current weather
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const targetNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      
      const timeDiff = targetNormalized.getTime() - todayNormalized.getTime();
      const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      
      if (daysDiff === 0) {
        // For same calendar date as today, get current weather
        console.log('🌤️ FIXED: Getting current weather for TODAY (same calendar date):', cityName);
        return await this.fetchCurrentWeather(cityName, targetDate, coords, apiKey);
      } else {
        // For future dates, get forecast
        console.log('🌤️ FIXED: Getting forecast for future date:', cityName, 'daysDiff:', daysDiff);
        return await this.fetchForecastWeather(cityName, targetDate, coords, apiKey);
      }
    } catch (error) {
      console.error('❌ FIXED: Live weather fetch failed for', cityName, error);
      return null;
    }
  }

  /**
   * FIXED: Fetch current weather for today
   */
  private static async fetchCurrentWeather(
    cityName: string,
    targetDate: Date,
    coords: { lat: number; lng: number },
    apiKey: string
  ): Promise<ForecastWeatherData | null> {
    try {
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(currentUrl);

      if (!response.ok) {
        console.log('❌ FIXED: Current weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();

      const currentWeather: ForecastWeatherData = {
        temperature: Math.round(data.main.temp),
        highTemp: Math.round(data.main.temp_max),
        lowTemp: Math.round(data.main.temp_min),
        description: data.weather[0]?.description || 'Partly Cloudy',
        icon: data.weather[0]?.icon || '02d',
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed || 0),
        precipitationChance: 0,
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ FIXED: Created current weather for TODAY:', cityName, {
        temperature: currentWeather.temperature,
        isActualForecast: currentWeather.isActualForecast,
        source: currentWeather.source
      });

      return currentWeather;
    } catch (error) {
      console.error('❌ FIXED: Current weather fetch failed:', error);
      return null;
    }
  }

  /**
   * FIXED: Fetch forecast weather for future dates
   */
  private static async fetchForecastWeather(
    cityName: string,
    targetDate: Date,
    coords: { lat: number; lng: number },
    apiKey: string
  ): Promise<ForecastWeatherData | null> {
    try {
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

      const forecastWeather: ForecastWeatherData = {
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
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ FIXED: Created forecast weather for future date:', cityName, {
        temperature: forecastWeather.temperature,
        isActualForecast: forecastWeather.isActualForecast,
        source: forecastWeather.source
      });

      return forecastWeather;
    } catch (error) {
      console.error('❌ FIXED: Forecast weather fetch failed:', error);
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
