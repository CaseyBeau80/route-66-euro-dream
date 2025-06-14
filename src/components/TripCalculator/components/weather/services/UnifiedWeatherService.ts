
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

export interface WeatherFetchResult {
  weather: ForecastWeatherData | null;
  error: string | null;
}

export class UnifiedWeatherService {
  /**
   * Main entry point for weather fetching
   */
  static async fetchWeatherForSegment(
    cityName: string,
    targetDate: Date,
    segmentDay: number,
    forceRefresh: boolean = false
  ): Promise<WeatherFetchResult> {
    console.log('UnifiedWeatherService - Fetching weather for', cityName, targetDate.toISOString());

    // API key validation
    const apiKey = WeatherApiKeyManager.getApiKey();
    const hasValidApiKey = !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;

    // Date analysis
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateCopy = new Date(targetDate);
    targetDateCopy.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;

    console.log('UnifiedWeatherService - Date analysis:', {
      daysFromToday,
      isWithinForecastRange,
      hasValidApiKey
    });

    // Try live forecast if conditions are met
    if (hasValidApiKey && isWithinForecastRange) {
      try {
        console.log('UnifiedWeatherService - Attempting live forecast for', cityName);
        const liveWeather = await this.fetchLiveWeather(cityName, targetDate, apiKey);
        
        if (liveWeather) {
          console.log('UnifiedWeatherService - Live forecast success for', cityName);
          return { weather: liveWeather, error: null };
        }
      } catch (error) {
        console.error('UnifiedWeatherService - Live forecast failed:', error);
      }
    }

    // Fallback to historical data
    console.log('UnifiedWeatherService - Using fallback weather for', cityName);
    const fallbackWeather = WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDate.toISOString().split('T')[0],
      daysFromToday
    );

    return { weather: fallbackWeather, error: null };
  }

  /**
   * Live weather API call
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
        console.log('UnifiedWeatherService - No coordinates for', cityName);
        return null;
      }

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(forecastUrl);
      
      if (!response.ok) {
        console.error('UnifiedWeatherService - API call failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.error('UnifiedWeatherService - No forecast data returned');
        return null;
      }

      // Find best match for target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      // Create live forecast data
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
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('UnifiedWeatherService - Live weather created for', cityName, {
        temperature: liveWeather.temperature,
        isActualForecast: liveWeather.isActualForecast,
        source: liveWeather.source
      });

      return liveWeather;
    } catch (error) {
      console.error('UnifiedWeatherService - Live weather fetch error:', error);
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
      console.error('UnifiedWeatherService - Geocoding error:', error);
      return null;
    }
  }
}
