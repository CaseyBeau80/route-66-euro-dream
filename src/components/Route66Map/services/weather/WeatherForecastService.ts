
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';

export interface ForecastWeatherData extends WeatherData {
  forecast: ForecastDay[];
  forecastDate: Date;
  isActualForecast: boolean;
  highTemp?: number;
  lowTemp?: number;
}

export class WeatherForecastService {
  private apiClient: WeatherApiClient;
  private readonly FORECAST_THRESHOLD_DAYS = 3; // Changed from 5 to 3 days

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

    // If the date is within 3-day forecast range, get actual forecast
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      return this.getActualForecast(lat, lng, cityName, targetDate, daysFromNow);
    } else {
      // For dates beyond 3-day forecast range, return null to show "not available" message
      return this.getForecastNotAvailable(cityName, targetDate, daysFromNow);
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
        const highTemp = targetForecast.temperature.high;
        const lowTemp = targetForecast.temperature.low;
        
        console.log(`🌡️ WeatherForecastService: Extracted temperatures - High: ${highTemp}°F, Low: ${lowTemp}°F`);
        
        return {
          temperature: Math.round((highTemp + lowTemp) / 2),
          highTemp: highTemp,
          lowTemp: lowTemp,
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
        return null;
      }
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      return null;
    }
  }

  private getForecastNotAvailable(
    cityName: string, 
    targetDate: Date, 
    daysFromNow: number
  ): ForecastWeatherData | null {
    return {
      temperature: 0,
      description: 'Forecast not available',
      icon: '01d',
      humidity: 0,
      windSpeed: 0,
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      highTemp: undefined,
      lowTemp: undefined
    };
  }
}
