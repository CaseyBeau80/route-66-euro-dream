
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';

export interface ForecastWeatherData extends WeatherData {
  forecast: ForecastDay[];
  forecastDate: Date;
  isActualForecast: boolean;
  highTemp?: number;
  lowTemp?: number;
  precipitationChance?: number;
  matchedForecastDay?: ForecastDay;
  dateMatchInfo?: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'none';
    daysOffset: number;
  };
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

    // If the date is within 5-day forecast range, get actual forecast
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      return this.getActualForecast(lat, lng, cityName, targetDate, daysFromNow);
    } else {
      // For dates beyond 5-day forecast range, return a clear "not available" result
      console.log(`🚫 WeatherForecastService: Date beyond ${this.FORECAST_THRESHOLD_DAYS}-day threshold, returning forecast not available`);
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
      
      // Enhanced processing with proper date matching
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate);
      
      // Find the best matching forecast using enhanced date matching
      const matchResult = this.findBestForecastMatch(processedForecast, targetDate);
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        const highTemp = forecast.temperature.high;
        const lowTemp = forecast.temperature.low;
        const precipChance = parseInt(forecast.precipitationChance) || 0;
        const humidity = forecast.humidity || 50;
        const windSpeed = forecast.windSpeed || 0;
        
        console.log(`🌡️ WeatherForecastService: Enhanced forecast match for ${cityName}:`, {
          requestedDate: targetDate.toDateString(),
          matchedDate: matchResult.matchInfo.matchedDate,
          matchType: matchResult.matchInfo.matchType,
          daysOffset: matchResult.matchInfo.daysOffset,
          high: highTemp + '°F',
          low: lowTemp + '°F',
          precipitation: precipChance + '%',
          humidity: humidity + '%',
          wind: windSpeed + ' mph'
        });
        
        return {
          temperature: Math.round((highTemp + lowTemp) / 2),
          highTemp: highTemp,
          lowTemp: lowTemp,
          description: forecast.description,
          icon: forecast.icon,
          humidity: humidity,
          windSpeed: windSpeed,
          precipitationChance: precipChance,
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: targetDate,
          isActualForecast: true,
          matchedForecastDay: forecast,
          dateMatchInfo: matchResult.matchInfo
        };
      } else {
        console.log(`⚠️ WeatherForecastService: No suitable forecast match found for ${cityName} on ${targetDate.toDateString()}`);
        return null;
      }
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      return null;
    }
  }

  private findBestForecastMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date
  ): { matchedForecast: ForecastDay | null; matchInfo: any } {
    const targetDateUTC = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const targetDateString = targetDateUTC.toISOString().split('T')[0];
    
    console.log(`🎯 Finding best forecast match for ${targetDateString} from ${processedForecast.length} forecasts`);
    
    // First try exact date match
    for (const forecast of processedForecast) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Exact date match found: ${forecast.dateString}`);
        return {
          matchedForecast: forecast,
          matchInfo: {
            requestedDate: targetDateString,
            matchedDate: forecast.dateString,
            matchType: 'exact' as const,
            daysOffset: 0
          }
        };
      }
    }
    
    // If no exact match, find closest date within reasonable range
    let closestForecast: ForecastDay | null = null;
    let smallestOffset = Infinity;
    
    for (const forecast of processedForecast) {
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetDays = Math.abs((forecastDate.getTime() - targetDateUTC.getTime()) / (24 * 60 * 60 * 1000));
      
      if (offsetDays < smallestOffset && offsetDays <= 2) { // Within 2 days
        closestForecast = forecast;
        smallestOffset = offsetDays;
      }
    }
    
    if (closestForecast) {
      console.log(`🎯 Closest match found: ${closestForecast.dateString} (${smallestOffset} days offset)`);
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest' as const,
          daysOffset: smallestOffset
        }
      };
    }
    
    console.log(`❌ No suitable forecast match found within 2-day range`);
    return {
      matchedForecast: null,
      matchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'none',
        matchType: 'none' as const,
        daysOffset: -1
      }
    };
  }

  private getForecastNotAvailable(
    cityName: string, 
    targetDate: Date, 
    daysFromNow: number
  ): ForecastWeatherData {
    console.log(`📅 WeatherForecastService: Returning forecast not available for ${cityName} (${daysFromNow} days ahead)`);
    
    return {
      temperature: 0,
      description: 'Forecast not available',
      icon: '01d',
      humidity: 0,
      windSpeed: 0,
      precipitationChance: 0,
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      highTemp: undefined,
      lowTemp: undefined,
      dateMatchInfo: {
        requestedDate: targetDate.toISOString().split('T')[0],
        matchedDate: 'none',
        matchType: 'none',
        daysOffset: daysFromNow
      }
    };
  }
}
