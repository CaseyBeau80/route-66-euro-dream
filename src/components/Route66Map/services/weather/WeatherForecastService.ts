import { WeatherSourceType } from './WeatherServiceTypes';
import { WeatherFallbackService } from './WeatherFallbackService';

export interface DateMatchInfo {
  requestedDate: string;
  matchedDate: string;
  matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
  daysOffset: number;
  hoursOffset?: number;
  source: WeatherSourceType;
  confidence?: 'high' | 'medium' | 'low';
}

export interface ForecastWeatherData {
  temperature: number;
  highTemp?: number;
  lowTemp?: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  forecast: any[];
  forecastDate: Date;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
  dateMatchInfo?: DateMatchInfo;
  matchedForecastDay?: any; // Add the missing property
}

export class WeatherForecastService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Add the missing getWeatherForDate method
  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    console.log('🌤️ WeatherForecastService.getWeatherForDate called:', {
      cityName,
      targetDate: targetDate.toISOString(),
      coordinates: { lat, lng }
    });

    const today = new Date();
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const targetDateString = targetDate.toISOString().split('T')[0];

    // If within forecast range (0-7 days), try to get live forecast
    if (daysFromToday >= 0 && daysFromToday <= 7) {
      try {
        const forecast = await this.getForecast(lat, lng, cityName);
        
        if (forecast && forecast.length > 0) {
          // Find the closest match to the target date
          const targetDay = targetDate.getDate();
          const targetMonth = targetDate.getMonth();
          
          const matchedForecast = forecast.find(item => {
            const forecastDate = new Date(item.forecastDate);
            return forecastDate.getDate() === targetDay && forecastDate.getMonth() === targetMonth;
          });

          if (matchedForecast) {
            console.log('✅ Found matching forecast for date:', targetDateString);
            return matchedForecast;
          }
        }
      } catch (error) {
        console.warn('⚠️ Live forecast failed, using fallback:', error);
      }
    }

    // Use fallback weather for dates outside forecast range or if API fails
    console.log('🔄 Using fallback weather for:', cityName);
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      targetDate,
      targetDateString,
      daysFromToday
    );
  }

  async getForecast(lat: number, lng: number, cityName: string): Promise<ForecastWeatherData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.list.map((item: any, index: number) => ({
        temperature: Math.round(item.main.temp),
        highTemp: Math.round(item.main.temp_max),
        lowTemp: Math.round(item.main.temp_min),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind?.speed || 0),
        precipitationChance: Math.round((item.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: new Date(item.dt * 1000),
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: new Date(item.dt * 1000).toISOString(),
          matchedDate: new Date(item.dt * 1000).toISOString(),
          matchType: 'exact' as const,
          daysOffset: index,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: 'high' as const
        }
      }));
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  async getCurrentWeather(lat: number, lng: number, cityName: string): Promise<ForecastWeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        highTemp: Math.round(data.main.temp_max),
        lowTemp: Math.round(data.main.temp_min),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed || 0),
        precipitationChance: 0, // Current weather doesn't have precipitation probability
        cityName,
        forecast: [],
        forecastDate: new Date(),
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: new Date().toISOString(),
          matchedDate: new Date().toISOString(),
          matchType: 'exact' as const,
          daysOffset: 0,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: 'high' as const
        }
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }
}
