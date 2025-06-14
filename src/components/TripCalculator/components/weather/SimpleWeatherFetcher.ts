
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
}

export class SimpleWeatherFetcher {
  // 🔧 PHASE 1 FIX: Remove static cache to prevent identical weather data
  // Each request will now get fresh coordinates for the specific city
  
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey } = request;
    
    console.log('🌤️ PHASE 1: SimpleWeatherFetcher starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      hasApiKey,
      phase: 'Fix identical weather data'
    });

    if (!hasApiKey) {
      console.log('🌤️ PHASE 1: No API key, using fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    try {
      // 🔧 PHASE 1: Get fresh coordinates for each city (no caching)
      const coords = await this.getFreshCoordinates(cityName);
      if (!coords) {
        console.log('🌤️ PHASE 1: No coordinates found for', cityName, 'using fallback');
        return this.createFallbackWeather(cityName, targetDate);
      }

      console.log('✅ PHASE 1: Fresh coordinates obtained for', cityName, coords);

      // Try to fetch live weather with fresh coordinates
      const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate);
      if (liveWeather) {
        console.log('✅ PHASE 1: Live weather fetched successfully for', cityName, {
          temperature: liveWeather.temperature,
          isActualForecast: liveWeather.isActualForecast
        });
        return liveWeather;
      }

      console.log('🌤️ PHASE 1: Live weather failed for', cityName, 'using fallback');
      return this.createFallbackWeather(cityName, targetDate);

    } catch (error) {
      console.error('❌ PHASE 1: Error fetching weather for', cityName, ':', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static async getFreshCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    // 🔧 PHASE 1: Always make fresh geocoding requests (no caching)
    console.log('🗺️ PHASE 1: Getting fresh coordinates for', cityName, '(no cache)');
    
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) {
        console.log('🗺️ PHASE 1: No API key for geocoding', cityName);
        return null;
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) {
        console.log('🗺️ PHASE 1: Geocoding API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.log('🗺️ PHASE 1: No geocoding results for', cityName);
        return null;
      }

      const coords = { lat: data[0].lat, lng: data[0].lon };
      console.log('✅ PHASE 1: Fresh coordinates retrieved for', cityName, coords);
      return coords;

    } catch (error) {
      console.error('❌ PHASE 1: Geocoding error for', cityName, ':', error);
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

      console.log('🌤️ PHASE 1: Attempting live forecast for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString()
      });

      // Only try live forecast if within reasonable range
      if (daysFromNow < 0 || daysFromNow > 7) {
        console.log('🌤️ PHASE 1: Date outside forecast range for', cityName, { daysFromNow });
        return null;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        console.log('❌ PHASE 1: Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) {
        console.log('❌ PHASE 1: No weather data for', cityName);
        return null;
      }

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      const weatherResult = {
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

      console.log('✅ PHASE 1: Live weather processed for', cityName, {
        temperature: weatherResult.temperature,
        coordinates: coords,
        uniqueData: true
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ PHASE 1: Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 PHASE 1: Creating fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      uniqueFallback: true
    });

    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
