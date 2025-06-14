
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
}

export class SimpleWeatherFetcher {
  private static readonly GEOCODING_CACHE = new Map<string, { lat: number; lng: number }>();
  
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey } = request;
    
    console.log('🌤️ SimpleWeatherFetcher: Starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      hasApiKey
    });

    if (!hasApiKey) {
      console.log('🌤️ SimpleWeatherFetcher: No API key, using fallback');
      return this.createFallbackWeather(cityName, targetDate);
    }

    try {
      // Try to get coordinates
      const coords = await this.getCoordinates(cityName);
      if (!coords) {
        console.log('🌤️ SimpleWeatherFetcher: No coordinates found, using fallback');
        return this.createFallbackWeather(cityName, targetDate);
      }

      // Try to fetch live weather
      const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate);
      if (liveWeather) {
        console.log('✅ SimpleWeatherFetcher: Live weather fetched successfully');
        return liveWeather;
      }

      console.log('🌤️ SimpleWeatherFetcher: Live weather failed, using fallback');
      return this.createFallbackWeather(cityName, targetDate);

    } catch (error) {
      console.error('❌ SimpleWeatherFetcher: Error fetching weather:', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static async getCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    // Check cache first
    if (this.GEOCODING_CACHE.has(cityName)) {
      return this.GEOCODING_CACHE.get(cityName)!;
    }

    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) return null;

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      const coords = { lat: data[0].lat, lng: data[0].lon };
      this.GEOCODING_CACHE.set(cityName, coords);
      return coords;

    } catch (error) {
      console.error('Error geocoding:', error);
      return null;
    }
  }

  private static async fetchLiveWeather(
    coords: { lat: number; lng: number },
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) return null;

      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      // Only try live forecast if within reasonable range
      if (daysFromNow < 0 || daysFromNow > 7) {
        return null;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.list || data.list.length === 0) return null;

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      return {
        temperature: Math.round(matchedItem.main.temp),
        highTemp: Math.round(matchedItem.main.temp_max),
        lowTemp: Math.round(matchedItem.main.temp_min),
        description: matchedItem.weather[0].description,
        icon: matchedItem.weather[0].icon,
        humidity: matchedItem.main.humidity,
        windSpeed: Math.round(matchedItem.wind?.speed || 0),
        precipitationChance: Math.round((matchedItem.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

    } catch (error) {
      console.error('Error fetching live weather:', error);
      return null;
    }
  }

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
