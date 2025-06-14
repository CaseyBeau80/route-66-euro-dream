
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

export class LiveWeatherService {
  /**
   * Simplified live weather fetching with guaranteed proper marking
   */
  static async fetchLiveWeather(
    cityName: string,
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🚀 LiveWeatherService: Starting simplified live weather fetch for', cityName);

    // Check API key availability
    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey || apiKey.length < 10) {
      console.log('❌ LiveWeatherService: No valid API key available');
      return null;
    }

    // Check if date is within forecast range (0-7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedTargetDate = new Date(targetDate);
    normalizedTargetDate.setHours(0, 0, 0, 0);
    
    const daysFromToday = Math.ceil((normalizedTargetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysFromToday < 0 || daysFromToday > 7) {
      console.log('📅 LiveWeatherService: Date outside forecast range:', daysFromToday, 'days');
      return null;
    }

    console.log('✅ LiveWeatherService: All conditions met, fetching live weather');

    try {
      // Get coordinates
      const coords = await this.getCoordinates(cityName, apiKey);
      if (!coords) {
        console.log('❌ LiveWeatherService: Failed to get coordinates for', cityName);
        return null;
      }

      // Fetch forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(forecastUrl);

      if (!response.ok) {
        console.error('❌ LiveWeatherService: API request failed:', response.status);
        return null;
      }

      const data = await response.json();
      
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
          break;
        }
      }

      // Create live weather object with GUARANTEED live properties
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
        // CRITICAL: These properties MUST be set for live weather
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('🎯 LiveWeatherService: LIVE WEATHER CREATED:', {
        cityName,
        temperature: liveWeather.temperature,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast,
        GUARANTEED_LIVE: true
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
    
    return {
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
      // CRITICAL: These properties MUST be set for historical weather
      isActualForecast: false,
      source: 'historical_fallback' as const
    };
  }

  /**
   * Get coordinates for a city
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
      console.error('❌ LiveWeatherService: Geocoding error:', error);
      return null;
    }
  }
}
