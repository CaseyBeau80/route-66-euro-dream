
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchRequest {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView?: boolean;
}

export class CoreWeatherFetcher {
  static async fetchWeatherForCity(request: WeatherFetchRequest): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey, isSharedView = false } = request;
    
    console.log('🌤️ CoreWeatherFetcher: Enhanced fetch with live forecast support in shared views', {
      cityName,
      targetDate: targetDate.toISOString(),
      hasApiKey,
      isSharedView,
      enableLiveForecastInSharedView: true
    });

    // FIXED: Always try live weather if API key exists, regardless of shared view status
    if (!hasApiKey) {
      console.log('🌤️ No API key, using fallback for', cityName);
      return this.createFallbackWeather(cityName, targetDate);
    }

    try {
      const coords = await this.getCoordinates(cityName);
      if (!coords) {
        console.log('🌤️ No coordinates found for', cityName, 'using fallback');
        return this.createFallbackWeather(cityName, targetDate);
      }

      console.log('✅ Coordinates found for', cityName, coords);

      // FIXED: Attempt live weather for both regular and shared views
      const liveWeather = await this.fetchLiveWeather(coords, cityName, targetDate);
      if (liveWeather) {
        console.log('✅ Live weather fetched successfully for', cityName, {
          temperature: liveWeather.temperature,
          description: liveWeather.description,
          icon: liveWeather.icon,
          isActualForecast: liveWeather.isActualForecast,
          source: liveWeather.source,
          inSharedView: isSharedView
        });
        return liveWeather;
      }

      console.log('🌤️ Live weather failed for', cityName, 'using fallback');
      return this.createFallbackWeather(cityName, targetDate);

    } catch (error) {
      console.error('❌ Error fetching weather for', cityName, ':', error);
      return this.createFallbackWeather(cityName, targetDate);
    }
  }

  private static async getCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key');
      if (!apiKey) return null;

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      return { lat: data[0].lat, lng: data[0].lon };
    } catch (error) {
      console.error('❌ Geocoding error for', cityName, ':', error);
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

      console.log('🌤️ Attempting live forecast for', cityName, {
        coordinates: coords,
        daysFromNow,
        targetDate: targetDate.toISOString(),
        forecastRange: '0-7 days'
      });

      // Only try live forecast if within reasonable range
      if (daysFromNow < 0 || daysFromNow > 7) {
        console.log('🌤️ Date outside forecast range for', cityName, { daysFromNow });
        return null;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) {
        console.log('❌ Weather API failed for', cityName, response.status);
        return null;
      }

      const data = await response.json();
      if (!data.list || data.list.length === 0) return null;

      // Find closest match to target date
      const targetDateString = targetDate.toISOString().split('T')[0];
      const matchedItem = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      const weatherResult: ForecastWeatherData = {
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
        isActualForecast: true, // CRITICAL: True for live forecasts
        source: 'live_forecast' as const
      };

      console.log('✅ Live weather processed for', cityName, {
        temperature: weatherResult.temperature,
        description: weatherResult.description,
        icon: weatherResult.icon,
        isActualForecast: weatherResult.isActualForecast,
        source: weatherResult.source
      });

      return weatherResult;

    } catch (error) {
      console.error('❌ Live weather fetch error for', cityName, ':', error);
      return null;
    }
  }

  private static createFallbackWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const targetDateString = targetDate.toISOString().split('T')[0];
    const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    console.log('🔄 Creating unique fallback weather for', cityName, {
      targetDateString,
      daysFromToday,
      uniquePerCity: true
    });

    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }
}
