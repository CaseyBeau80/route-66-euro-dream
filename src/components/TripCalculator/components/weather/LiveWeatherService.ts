
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

export class LiveWeatherService {
  /**
   * Fetch live weather with simplified validation
   */
  static async fetchLiveWeather(
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🚀 LiveWeatherService: Starting live weather fetch for', cityName);

    // Simple API key check
    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) {
      console.log('❌ LiveWeatherService: No API key available');
      return null;
    }

    console.log('🔑 LiveWeatherService: API key available, length:', apiKey.length);

    // Check if date is within forecast range (0-5 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedTargetDate = new Date(targetDate);
    normalizedTargetDate.setHours(0, 0, 0, 0);
    
    const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('📅 LiveWeatherService: Date analysis:', {
      today: today.toISOString(),
      targetDate: normalizedTargetDate.toISOString(),
      daysFromToday,
      withinRange: daysFromToday >= 0 && daysFromToday <= 5
    });

    if (daysFromToday < 0 || daysFromToday > 5) {
      console.log('📅 LiveWeatherService: Date outside forecast range:', daysFromToday, 'days');
      return null;
    }

    console.log('✅ LiveWeatherService: All conditions met, making API call');

    try {
      // Get coordinates first
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ LiveWeatherService: Failed to get coordinates for', cityName);
        return null;
      }

      console.log('📍 LiveWeatherService: Got coordinates:', coords);

      // Fetch forecast from OpenWeatherMap
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      console.log('🌐 LiveWeatherService: Making API request...');
      
      const response = await fetch(forecastUrl);

      console.log('📡 LiveWeatherService: API response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        console.error('❌ LiveWeatherService: API request failed:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      
      console.log('📊 LiveWeatherService: API data received:', {
        hasData: !!data,
        hasList: !!data.list,
        listLength: data.list?.length || 0
      });

      if (!data.list || data.list.length === 0) {
        console.log('❌ LiveWeatherService: No forecast data received');
        return null;
      }

      // Find best match for target date
      const targetDateString = normalizedTargetDate.toISOString().split('T')[0];
      let bestMatch = data.list[0];
      
      for (const item of data.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        
        if (itemDateString === targetDateString) {
          bestMatch = item;
          console.log('🎯 LiveWeatherService: Found exact date match');
          break;
        }
      }

      // Create live weather object
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max || bestMatch.main.temp + 5),
        lowTemp: Math.round(bestMatch.main.temp_min || bestMatch.main.temp - 5),
        description: bestMatch.weather[0]?.description || 'Clear',
        icon: bestMatch.weather[0]?.icon || '01d',
        humidity: bestMatch.main.humidity || 50,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('🎯 LiveWeatherService: LIVE WEATHER CREATED:', {
        cityName,
        temperature: liveWeather.temperature,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ LiveWeatherService: Error fetching live weather:', error);
      return null;
    }
  }

  /**
   * Create fallback historical weather
   */
  static createHistoricalWeather(cityName: string, targetDate: Date): ForecastWeatherData {
    const month = targetDate.getMonth();
    const isWinter = month === 11 || month === 0 || month === 1;
    const isSummer = month >= 5 && month <= 8;
    
    const baseTemp = isWinter ? 45 : isSummer ? 85 : 65;
    const tempVariation = Math.random() * 20 - 10;
    const temperature = Math.round(baseTemp + tempVariation);
    
    const historicalWeather: ForecastWeatherData = {
      temperature,
      highTemp: temperature + 8,
      lowTemp: temperature - 8,
      description: isWinter ? 'Partly cloudy' : isSummer ? 'Sunny' : 'Clear',
      icon: isWinter ? '02d' : isSummer ? '01d' : '01d',
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 10),
      precipitationChance: Math.round(Math.random() * 30),
      cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      source: 'historical_fallback' as const
    };

    console.log('📊 LiveWeatherService: Historical weather created:', {
      cityName,
      temperature: historicalWeather.temperature,
      source: historicalWeather.source,
      isActualForecast: historicalWeather.isActualForecast
    });

    return historicalWeather;
  }

  /**
   * Get coordinates for a city
   */
  private static async getCoordinates(cityName: string, apiKey: string) {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) {
        console.error('❌ LiveWeatherService: Geocoding failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.error('❌ LiveWeatherService: No geocoding results');
        return null;
      }

      const result = data.find((r: any) => r.country === 'US') || data[0];
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ LiveWeatherService: Geocoding error:', error);
      return null;
    }
  }
}
