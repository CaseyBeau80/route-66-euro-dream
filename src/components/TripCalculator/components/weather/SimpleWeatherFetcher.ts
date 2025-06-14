
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface WeatherFetchParams {
  cityName: string;
  targetDate: Date;
  hasApiKey: boolean;
  isSharedView: boolean;
  segmentDay: number;
}

export class SimpleWeatherFetcher {
  static async fetchWeatherForCity(params: WeatherFetchParams): Promise<ForecastWeatherData | null> {
    const { cityName, targetDate, hasApiKey, segmentDay } = params;
    
    console.log('🌤️ SimpleWeatherFetcher: Starting fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      hasApiKey,
      segmentDay
    });

    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // Try live forecast if within range and have API key
    if (daysFromToday >= 0 && daysFromToday <= 7 && hasApiKey) {
      try {
        const liveWeather = await this.fetchRealLiveForecast(cityName, targetDate, daysFromToday);
        if (liveWeather) {
          console.log('✅ Live weather fetched successfully for', cityName);
          return liveWeather;
        }
      } catch (error) {
        console.log('⚠️ Live weather fetch failed, using fallback:', error);
      }
    }

    // Use fallback weather
    console.log('📊 Using fallback weather for', cityName);
    const targetDateString = targetDate.toISOString().split('T')[0];
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }

  private static async fetchRealLiveForecast(cityName: string, targetDate: Date, daysFromToday: number): Promise<ForecastWeatherData | null> {
    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('No API key available');
    }

    try {
      // Get coordinates for the city first
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
      }
      
      const geocodeData = await geocodeResponse.json();
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geocodeData[0];

      // Fetch weather forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        throw new Error(`Weather API failed: ${forecastResponse.status}`);
      }
      
      const forecastData = await forecastResponse.json();
      
      // Find the forecast closest to our target date
      const targetTimeStamp = targetDate.getTime();
      let closestForecast = null;
      let smallestDiff = Infinity;

      for (const item of forecastData.list) {
        const forecastTime = new Date(item.dt * 1000).getTime();
        const diff = Math.abs(forecastTime - targetTimeStamp);
        
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestForecast = item;
        }
      }

      if (!closestForecast) {
        throw new Error('No suitable forecast found');
      }

      // Convert to our format
      return {
        temperature: Math.round(closestForecast.main.temp),
        lowTemp: Math.round(closestForecast.main.temp_min),
        highTemp: Math.round(closestForecast.main.temp_max),
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        humidity: closestForecast.main.humidity,
        windSpeed: Math.round(closestForecast.wind?.speed || 0),
        precipitationChance: Math.round((closestForecast.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: targetDate.toISOString(),
          matchedDate: new Date(closestForecast.dt * 1000).toISOString(),
          matchType: 'exact' as const,
          daysOffset: daysFromToday,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: 'high' as const
        }
      };

    } catch (error) {
      console.error('❌ Real live forecast fetch failed:', error);
      throw error;
    }
  }

  private static getWeatherIcon(description: string): string {
    const iconMap: { [key: string]: string } = {
      'Sunny': '01d',
      'Clear Skies': '01d',
      'Partly Cloudy': '02d',
      'Overcast Clouds': '04d',
      'Scattered Showers': '10d',
      'Rain': '09d',
      'Thunderstorms': '11d',
      'Snow': '13d',
      'Fog': '50d'
    };
    
    return iconMap[description] || '02d';
  }
}
