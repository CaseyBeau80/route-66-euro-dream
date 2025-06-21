
import { getCurrentApiKey, OPENWEATHER_CONFIG, validateApiKey } from '@/config/weatherConfig';

export interface WeatherResponse {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
}

export class OpenWeatherService {
  private static instance: OpenWeatherService;
  
  static getInstance(): OpenWeatherService {
    if (!OpenWeatherService.instance) {
      OpenWeatherService.instance = new OpenWeatherService();
    }
    return OpenWeatherService.instance;
  }

  /**
   * Check if we have a valid API key
   */
  hasValidApiKey(): boolean {
    const apiKey = getCurrentApiKey();
    return !!apiKey && validateApiKey(apiKey);
  }

  /**
   * Get coordinates for a city name
   */
  async getCoordinates(cityName: string): Promise<{ lat: number; lon: number } | null> {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
      console.warn('🔑 OpenWeatherService: No API key available for geocoding');
      return null;
    }

    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const url = `${OPENWEATHER_CONFIG.geocodingUrl}/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      console.log('🌍 OpenWeatherService: Geocoding request for', cleanCityName);
      
      const response = await fetch(url, {
        timeout: OPENWEATHER_CONFIG.timeout
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        console.warn('🌍 OpenWeatherService: No coordinates found for', cleanCityName);
        return null;
      }

      // Prefer US locations
      const usLocation = data.find((r: any) => r.country === 'US') || data[0];
      
      console.log('✅ OpenWeatherService: Coordinates found for', cleanCityName, {
        lat: usLocation.lat,
        lon: usLocation.lon,
        country: usLocation.country
      });
      
      return { lat: usLocation.lat, lon: usLocation.lon };
    } catch (error) {
      console.error('❌ OpenWeatherService: Geocoding failed for', cityName, error);
      return null;
    }
  }

  /**
   * Get weather forecast for coordinates
   */
  async getWeatherForecast(lat: number, lon: number, cityName: string, targetDate?: Date): Promise<WeatherResponse | null> {
    const apiKey = getCurrentApiKey();
    if (!apiKey) {
      console.warn('🔑 OpenWeatherService: No API key available for weather forecast');
      return null;
    }

    try {
      const url = `${OPENWEATHER_CONFIG.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${OPENWEATHER_CONFIG.units}`;
      
      console.log('🌤️ OpenWeatherService: Weather forecast request for', cityName, {
        coordinates: { lat, lon },
        targetDate: targetDate?.toISOString()
      });

      const response = await fetch(url, {
        timeout: OPENWEATHER_CONFIG.timeout
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.list || data.list.length === 0) {
        console.warn('🌤️ OpenWeatherService: No forecast data returned for', cityName);
        return null;
      }

      console.log('✅ OpenWeatherService: Forecast data received for', cityName, {
        listLength: data.list.length,
        cityData: data.city
      });

      // Find best match for target date or use first available
      let bestMatch = data.list[0];
      
      if (targetDate) {
        const targetDateString = targetDate.toISOString().split('T')[0];
        const dateMatch = data.list.find((item: any) => {
          const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
          return itemDate === targetDateString;
        });
        
        if (dateMatch) {
          bestMatch = dateMatch;
          console.log('🎯 OpenWeatherService: Found exact date match for', targetDateString);
        }
      }

      // Process weather data
      const weatherResponse: WeatherResponse = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        isActualForecast: true,
        source: 'live_forecast'
      };

      console.log('✅ OpenWeatherService: Weather processed for', cityName, {
        temperature: weatherResponse.temperature,
        description: weatherResponse.description,
        isActualForecast: weatherResponse.isActualForecast
      });

      return weatherResponse;
    } catch (error) {
      console.error('❌ OpenWeatherService: Weather forecast failed for', cityName, error);
      return null;
    }
  }

  /**
   * Get weather for a city by name
   */
  async getWeatherByCity(cityName: string, targetDate?: Date): Promise<WeatherResponse | null> {
    try {
      console.log('🌤️ OpenWeatherService: Getting weather for', cityName);
      
      // Get coordinates first
      const coords = await this.getCoordinates(cityName);
      if (!coords) {
        return null;
      }

      // Get weather forecast
      return await this.getWeatherForecast(coords.lat, coords.lon, cityName, targetDate);
    } catch (error) {
      console.error('❌ OpenWeatherService: Failed to get weather for', cityName, error);
      return null;
    }
  }

  /**
   * Set API key programmatically
   */
  setApiKey(apiKey: string): boolean {
    if (validateApiKey(apiKey)) {
      localStorage.setItem('weather_api_key', apiKey);
      console.log('✅ OpenWeatherService: API key saved successfully');
      return true;
    } else {
      console.error('❌ OpenWeatherService: Invalid API key format');
      return false;
    }
  }
}
