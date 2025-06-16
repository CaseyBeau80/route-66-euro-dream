import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { UnifiedDateService } from '../../services/UnifiedDateService';

export interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  /**
   * UNIFIED: Enhanced weather fetching with proper today handling
   */
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, isSharedView, segmentDay } = params;
    
    // Use unified date service for API key check
    const actualApiKey = WeatherApiKeyManager.getApiKey();
    const hasActualApiKey = !!actualApiKey && actualApiKey !== 'YOUR_API_KEY_HERE';
    
    console.log('🔧 UNIFIED FETCHER: Enhanced weather fetch:', {
      cityName,
      targetDate: targetDate.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(targetDate),
      isSharedView,
      hasActualApiKey,
      segmentDay
    });

    // If no valid API key, return fallback immediately
    if (!hasActualApiKey) {
      console.log('🔄 UNIFIED FETCHER: No API key - returning fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    // Use unified date service for range check
    const isWithinForecastRange = UnifiedDateService.isWithinLiveForecastRange(targetDate);
    const daysFromToday = UnifiedDateService.getDaysFromToday(targetDate);
    
    console.log('🌤️ UNIFIED FETCHER: Date analysis:', {
      cityName,
      targetDate: targetDate.toLocaleDateString(),
      daysFromToday,
      isWithinForecastRange,
      isToday: UnifiedDateService.isToday(targetDate)
    });

    if (!isWithinForecastRange) {
      console.log('🔄 UNIFIED FETCHER: Date outside forecast range - returning fallback for', cityName, { daysFromToday });
      return this.createFallbackWeather(cityName, targetDate);
    }

    // Try to fetch live weather
    try {
      console.log('🌤️ UNIFIED FETCHER: Attempting live weather fetch for', cityName, 'daysFromToday:', daysFromToday);
      const liveWeather = await this.fetchLiveWeatherDirect(cityName, targetDate, actualApiKey);
      
      if (liveWeather) {
        console.log('✅ UNIFIED FETCHER: Live weather successful for', cityName, {
          temperature: liveWeather.temperature,
          source: liveWeather.source,
          isActualForecast: liveWeather.isActualForecast,
          daysFromToday,
          isToday: UnifiedDateService.isToday(targetDate)
        });
        return liveWeather;
      }
    } catch (error) {
      console.error('❌ UNIFIED FETCHER: Live weather failed for', cityName, error);
    }

    // Fallback to historical weather
    console.log('🔄 UNIFIED FETCHER: Using fallback weather for', cityName);
    return this.createFallbackWeather(cityName, targetDate);
  }

  /**
   * UNIFIED: Enhanced live weather fetching with proper today detection
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
        console.log('❌ UNIFIED FETCHER: Could not get coordinates for', cityName);
        return null;
      }

      // Use unified date service to check if today
      const isToday = UnifiedDateService.isToday(targetDate);
      const daysFromToday = UnifiedDateService.getDaysFromToday(targetDate);
      
      if (isToday) {
        // For today, get current weather
        console.log('🌤️ UNIFIED FETCHER: Getting current weather for TODAY:', cityName);
        return await this.fetchCurrentWeather(cityName, targetDate, coords, apiKey);
      } else {
        // For future dates, get forecast
        console.log('🌤️ UNIFIED FETCHER: Getting forecast for future date:', cityName, 'daysFromToday:', daysFromToday);
        return await this.fetchForecastWeather(cityName, targetDate, coords, apiKey);
      }
    } catch (error) {
      console.error('❌ UNIFIED FETCHER: Live weather fetch failed for', cityName, error);
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
   * UNIFIED: Fallback weather creation using unified date service
   */
  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = UnifiedDateService.formatForApi(targetDate);
    const daysFromToday = UnifiedDateService.getDaysFromToday(targetDate);
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
