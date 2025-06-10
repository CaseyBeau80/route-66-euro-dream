import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export interface ForecastWeatherData extends WeatherData {
  forecast: ForecastDay[];
  forecastDate: Date;
  isActualForecast: boolean;
  highTemp?: number;
  lowTemp?: number;
  precipitationChance?: number;
  matchedForecastDay?: ForecastDay;
  dateMatchInfo: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'none' | 'fallback';
    daysOffset: number;
    source: 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate';
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
    // Use centralized date normalization - CRITICAL for alignment
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    const daysFromNow = Math.ceil((normalizedTargetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    console.log(`🌤️ WeatherForecastService: Request for ${cityName} on ${targetDateString}, ${daysFromNow} days from now`);
    console.log(`🗓️ Date normalization for ${cityName}:`, {
      originalTargetDate: targetDate.toISOString(),
      normalizedTargetDate: normalizedTargetDate.toISOString(),
      targetDateString,
      daysFromNow
    });

    // Try to get actual forecast if within range
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      const actualForecast = await this.getActualForecast(lat, lng, cityName, normalizedTargetDate, targetDateString, daysFromNow);
      if (actualForecast) {
        return actualForecast;
      }
      console.log(`⚠️ WeatherForecastService: API failed, creating enhanced fallback for ${cityName}`);
    }

    // Return enhanced fallback with proper dateMatchInfo
    return this.getEnhancedFallbackForecast(cityName, normalizedTargetDate, targetDateString, daysFromNow);
  }

  private async getActualForecast(
    lat: number, 
    lng: number, 
    cityName: string, 
    targetDate: Date, 
    targetDateString: string,
    daysFromNow: number
  ): Promise<ForecastWeatherData | null> {
    try {
      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 5);
      const matchResult = this.findBestForecastMatch(processedForecast, targetDate, targetDateString);
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        const highTemp = forecast.temperature.high;
        const lowTemp = forecast.temperature.low;
        const precipChance = parseInt(forecast.precipitationChance) || 0;
        
        return {
          temperature: Math.round((highTemp + lowTemp) / 2),
          highTemp: highTemp,
          lowTemp: lowTemp,
          description: forecast.description,
          icon: forecast.icon,
          humidity: forecast.humidity || 50,
          windSpeed: forecast.windSpeed || 0,
          precipitationChance: precipChance,
          cityName: cityName,
          forecast: processedForecast,
          forecastDate: targetDate,
          isActualForecast: true,
          matchedForecastDay: forecast,
          dateMatchInfo: {
            ...matchResult.matchInfo,
            source: 'api-forecast'
          }
        };
      } else {
        return this.createEnhancedForecastFromCurrent(currentData, cityName, targetDate, targetDateString, daysFromNow, processedForecast);
      }
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      return null;
    }
  }

  private createEnhancedForecastFromCurrent(
    currentData: any,
    cityName: string,
    targetDate: Date,
    targetDateString: string,
    daysFromNow: number,
    processedForecast: ForecastDay[]
  ): ForecastWeatherData {
    const currentTemp = currentData.main.temp;
    const tempVariation = 10;
    
    // Enhanced dateMatchInfo with proper fallback indication and exact date tracking
    const dateMatchInfo = {
      requestedDate: targetDateString,
      matchedDate: DateNormalizationService.toDateString(new Date()),
      matchType: 'fallback' as const,
      daysOffset: daysFromNow,
      source: 'enhanced-fallback' as const
    };
    
    return {
      temperature: Math.round(currentTemp),
      highTemp: Math.round(currentTemp + tempVariation/2),
      lowTemp: Math.round(currentTemp - tempVariation/2),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed || 0),
      precipitationChance: Math.round((currentData.main.humidity / 100) * 30),
      cityName: cityName,
      forecast: processedForecast,
      forecastDate: targetDate,
      isActualForecast: true,
      dateMatchInfo
    };
  }

  private findBestForecastMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date,
    targetDateString: string
  ): { matchedForecast: ForecastDay | null; matchInfo: any } {
    console.log(`🎯 Forecast matching for ${targetDateString} from ${processedForecast.length} forecasts`);
    
    if (processedForecast.length === 0) {
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
    
    // First try exact date match using string comparison for precision
    for (const forecast of processedForecast) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ Exact date match found for ${targetDateString}`);
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
    
    // Find closest date within reasonable range
    let closestForecast: ForecastDay | null = null;
    let smallestOffset = Infinity;
    let actualOffset = 0;
    
    const targetDateObj = new Date(targetDateString + 'T00:00:00Z');
    
    for (const forecast of processedForecast) {
      if (!forecast.dateString) continue;
      
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetDays = Math.abs((forecastDate.getTime() - targetDateObj.getTime()) / (24 * 60 * 60 * 1000));
      const actualDayOffset = Math.round((forecastDate.getTime() - targetDateObj.getTime()) / (24 * 60 * 60 * 1000));
      
      if (offsetDays < smallestOffset && offsetDays <= 2) {
        closestForecast = forecast;
        smallestOffset = offsetDays;
        actualOffset = actualDayOffset;
      }
    }
    
    if (closestForecast) {
      console.log(`📍 Closest match found for ${targetDateString}: ${closestForecast.dateString} (${actualOffset} days offset)`);
      return {
        matchedForecast: closestForecast,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: closestForecast.dateString,
          matchType: 'closest' as const,
          daysOffset: actualOffset
        }
      };
    }
    
    console.log(`❌ No suitable forecast match found for ${targetDateString}`);
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

  private getEnhancedFallbackForecast(
    cityName: string, 
    targetDate: Date, 
    targetDateString: string,
    daysFromNow: number
  ): ForecastWeatherData {
    const month = targetDate.getMonth();
    const seasonalTemp = this.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    // Enhanced dateMatchInfo for seasonal estimates with exact date tracking
    const dateMatchInfo = {
      requestedDate: targetDateString,
      matchedDate: 'seasonal-estimate',
      matchType: 'none' as const,
      daysOffset: daysFromNow,
      source: 'seasonal-estimate' as const
    };
    
    return {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + tempVariation/2,
      lowTemp: seasonalTemp - tempVariation/2,
      description: this.getSeasonalDescription(month),
      icon: this.getSeasonalIcon(month),
      humidity: this.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: this.getSeasonalPrecipitation(month),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      dateMatchInfo
    };
  }

  private getSeasonalTemperature(month: number): number {
    const seasonalTemps = [40, 45, 55, 65, 75, 85, 90, 88, 80, 70, 55, 45];
    return seasonalTemps[month] || 70;
  }

  private getSeasonalDescription(month: number): string {
    if (month >= 11 || month <= 2) return 'partly cloudy';
    if (month >= 3 && month <= 5) return 'mild and pleasant';
    if (month >= 6 && month <= 8) return 'hot and sunny';
    return 'comfortable weather';
  }

  private getSeasonalIcon(month: number): string {
    if (month >= 11 || month <= 2) return '02d';
    if (month >= 6 && month <= 8) return '01d';
    return '02d';
  }

  private getSeasonalHumidity(month: number): number {
    if (month >= 6 && month <= 8) return 60;
    if (month >= 11 || month <= 2) return 45;
    return 55;
  }

  private getSeasonalPrecipitation(month: number): number {
    if (month >= 4 && month <= 6) return 35;
    if (month >= 7 && month <= 9) return 25;
    return 20;
  }
}
