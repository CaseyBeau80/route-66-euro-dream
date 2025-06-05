
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';

export interface ForecastWeatherData extends WeatherData {
  forecast: ForecastDay[];
  forecastDate: Date;
  isActualForecast: boolean;
}

export class WeatherForecastService {
  private apiClient: WeatherApiClient;
  private readonly FORECAST_THRESHOLD_DAYS = 5;

  constructor(apiKey: string) {
    this.apiClient = new WeatherApiClient(apiKey);
  }

  async getWeatherForDate(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    const daysFromNow = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log(`🌤️ WeatherForecastService: Getting weather for ${cityName} on ${targetDate.toDateString()}, ${daysFromNow} days from now`);

    // If the date is within forecast range, get actual forecast
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      return this.getActualForecast(lat, lng, cityName, targetDate, daysFromNow);
    } else {
      // For dates beyond forecast range, get current weather but mark it appropriately
      return this.getCurrentWeatherAsReference(lat, lng, cityName, targetDate);
    }
  }

  private async getActualForecast(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date, 
    daysFromNow: number
  ): Promise<ForecastWeatherData | null> {
    try {
      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      console.log(`🔮 WeatherForecastService: Got actual forecast data for ${cityName}`);
      
      const processedForecast = WeatherDataProcessor.processForecastData(forecastData);
      
      // Find the forecast for the specific day
      const targetForecast = processedForecast[daysFromNow] || processedForecast[0];
      
      if (targetForecast) {
        return {
          temperature: Math.round((targetForecast.temperature.high + targetForecast.temperature.low) / 2),
          description: targetForecast.description,
          icon: targetForecast.icon,
          humidity: 50, // Default humidity for forecast
          windSpeed: 8, // Default wind speed for forecast
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: targetDate,
          isActualForecast: true
        };
      } else {
        // Fallback to current weather if no forecast available
        return this.getCurrentWeatherAsReference(lat, lng, cityName, targetDate);
      }
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      return null;
    }
  }

  private async getCurrentWeatherAsReference(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date
  ): Promise<ForecastWeatherData | null> {
    try {
      const currentData = await this.apiClient.getCurrentWeather(lat, lng);
      
      console.log(`📍 WeatherForecastService: Got current weather as reference for ${cityName}`);
      
      const weatherData = WeatherDataProcessor.processCurrentWeather(currentData, cityName);
      
      return {
        ...weatherData,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: false
      };
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting current weather as reference:', error);
      return null;
    }
  }
}
