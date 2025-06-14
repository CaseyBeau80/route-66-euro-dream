
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface LiveForecastRequest {
  cityName: string;
  targetDate: Date;
  coordinates?: { lat: number; lng: number };
  isSharedView?: boolean;
}

export interface LiveForecastResult {
  success: boolean;
  weather?: ForecastWeatherData;
  errorReason?: string;
  attemptDetails: {
    coordinatesObtained: boolean;
    apiCallMade: boolean;
    dataProcessed: boolean;
    isWithinRange: boolean;
    daysFromNow: number;
  };
}

export class LiveForecastEnhancer {
  private static readonly FORECAST_RANGE_DAYS = 5;
  private static readonly API_TIMEOUT_MS = 8000;

  static async attemptLiveForecast(request: LiveForecastRequest): Promise<LiveForecastResult> {
    const { cityName, targetDate, isSharedView = false } = request;
    
    console.log('🚀 PLAN: LiveForecastEnhancer attempting enhanced live forecast:', {
      cityName,
      targetDate: targetDate.toISOString(),
      isSharedView,
      enhancedLogic: true
    });

    const result: LiveForecastResult = {
      success: false,
      attemptDetails: {
        coordinatesObtained: false,
        apiCallMade: false,
        dataProcessed: false,
        isWithinRange: false,
        daysFromNow: 0
      }
    };

    try {
      // Calculate days from now
      const today = new Date();
      const daysFromNow = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      result.attemptDetails.daysFromNow = daysFromNow;

      // Check if within forecast range
      result.attemptDetails.isWithinRange = daysFromNow >= 0 && daysFromNow <= this.FORECAST_RANGE_DAYS;
      
      if (!result.attemptDetails.isWithinRange) {
        result.errorReason = `Date outside forecast range (${daysFromNow} days from now)`;
        console.log('❌ PLAN: Date outside forecast range:', {
          daysFromNow,
          maxDays: this.FORECAST_RANGE_DAYS
        });
        return result;
      }

      // Get coordinates
      const coords = request.coordinates || await this.getCoordinates(cityName);
      if (!coords) {
        result.errorReason = 'Could not obtain coordinates';
        console.log('❌ PLAN: Failed to get coordinates for', cityName);
        return result;
      }
      
      result.attemptDetails.coordinatesObtained = true;
      console.log('✅ PLAN: Coordinates obtained:', coords);

      // Get API key
      const apiKey = localStorage.getItem('weather_api_key') || 
                    localStorage.getItem('openweathermap_api_key');
      
      if (!apiKey) {
        result.errorReason = 'No API key available';
        console.log('❌ PLAN: No API key for live forecast');
        return result;
      }

      // Make API call with timeout
      const weather = await Promise.race([
        this.fetchWeatherData(coords, apiKey, targetDate, cityName),
        this.createTimeoutPromise()
      ]);

      result.attemptDetails.apiCallMade = true;

      if (!weather) {
        result.errorReason = 'API call returned no data';
        return result;
      }

      result.attemptDetails.dataProcessed = true;
      result.success = true;
      result.weather = weather;

      console.log('✅ PLAN: Live forecast successful:', {
        cityName,
        temperature: weather.temperature,
        source: weather.source,
        isActualForecast: weather.isActualForecast
      });

      return result;

    } catch (error) {
      result.errorReason = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ PLAN: Live forecast error:', error);
      return result;
    }
  }

  private static async getCoordinates(cityName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = localStorage.getItem('weather_api_key') || 
                    localStorage.getItem('openweathermap_api_key');
      
      if (!apiKey) return null;

      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodingUrl);

      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      return { lat: data[0].lat, lng: data[0].lon };
    } catch (error) {
      console.error('❌ PLAN: Geocoding error:', error);
      return null;
    }
  }

  private static async fetchWeatherData(
    coords: { lat: number; lng: number },
    apiKey: string,
    targetDate: Date,
    cityName: string
  ): Promise<ForecastWeatherData | null> {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

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
      console.error('❌ PLAN: Weather API error:', error);
      return null;
    }
  }

  private static createTimeoutPromise(): Promise<null> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Live forecast timeout'));
      }, this.API_TIMEOUT_MS);
    });
  }
}
