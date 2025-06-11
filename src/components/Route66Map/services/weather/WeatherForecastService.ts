import { WeatherApiClient } from './WeatherApiClient';
import { WeatherDataProcessor } from './WeatherDataProcessor';
import { WeatherData, ForecastDay } from './WeatherServiceTypes';
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';
import { EnhancedWeatherForecastMatcher } from '../../../TripCalculator/components/weather/EnhancedWeatherForecastMatcher';
import { SeasonalWeatherGenerator } from '../../../TripCalculator/components/weather/SeasonalWeatherGenerator';
import { WeatherDataDebugger } from '../../../TripCalculator/components/weather/WeatherDataDebugger';

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
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none';
    daysOffset: number;
    hoursOffset?: number;
    source: 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate';
    confidence?: 'high' | 'medium' | 'low';
    availableDates?: string[];
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
    // Use centralized date normalization with enhanced debugging
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    const daysFromNow = Math.ceil((normalizedTargetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherForecastService.getWeatherForDate [${cityName}]`,
      {
        originalDate: targetDate.toISOString(),
        normalizedDate: normalizedTargetDate.toISOString(),
        targetDateString,
        daysFromNow,
        withinForecastRange: daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS
      }
    );

    // Try to get actual forecast if within range
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      const actualForecast = await this.getActualForecast(lat, lng, cityName, normalizedTargetDate, targetDateString, daysFromNow);
      if (actualForecast) {
        WeatherDataDebugger.debugApiResponse(cityName, targetDateString, actualForecast);
        return actualForecast;
      }
      console.log(`⚠️ WeatherForecastService: API failed for ${cityName}, creating enhanced fallback`);
    }

    // Return enhanced fallback
    const fallbackForecast = this.getEnhancedFallbackForecast(cityName, normalizedTargetDate, targetDateString, daysFromNow);
    WeatherDataDebugger.debugApiResponse(cityName, targetDateString, fallbackForecast);
    return fallbackForecast;
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
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.getActualForecast [${cityName}]`,
        { targetDateString, daysFromNow, coordinates: { lat, lng } }
      );

      const [currentData, forecastData] = await this.apiClient.getWeatherAndForecast(lat, lng);
      
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 5);
      
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.processedForecast [${cityName}]`,
        {
          processedCount: processedForecast.length,
          availableDates: processedForecast.map(f => f.dateString).filter(Boolean)
        }
      );
      
      // Use enhanced date matching
      const matchResult = EnhancedWeatherForecastMatcher.findBestMatch(
        processedForecast, 
        targetDate, 
        targetDateString, 
        cityName
      );
      
      WeatherDataDebugger.debugWeatherMatching(cityName, targetDateString, processedForecast, matchResult);
      
      if (matchResult.matchedForecast) {
        const forecast = matchResult.matchedForecast;
        const highTemp = forecast.temperature?.high || forecast.temperature || 0;
        const lowTemp = forecast.temperature?.low || forecast.temperature || 0;
        const precipChance = parseInt(String(forecast.precipitationChance)) || 0;
        
        console.log(`✅ Enhanced forecast match for ${cityName} on ${targetDateString}:`, {
          matchType: matchResult.matchInfo.matchType,
          matchedDate: matchResult.matchInfo.matchedDate,
          confidence: matchResult.matchInfo.confidence,
          temperature: { high: highTemp, low: lowTemp }
        });
        
        return {
          temperature: Math.round((highTemp + lowTemp) / 2) || highTemp || lowTemp,
          highTemp: highTemp,
          lowTemp: lowTemp,
          description: forecast.description || 'Clear',
          icon: forecast.icon || '01d',
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
            source: 'api-forecast' as const
          }
        };
      } else {
        // Create enhanced forecast from current data if no match found
        return this.createEnhancedForecastFromCurrent(
          currentData, 
          cityName, 
          targetDate, 
          targetDateString, 
          daysFromNow, 
          processedForecast
        );
      }
    } catch (error) {
      console.error('❌ WeatherForecastService: Error getting actual forecast:', error);
      WeatherDataDebugger.debugWeatherFlow(
        `WeatherForecastService.error [${cityName}]`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
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
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: DateNormalizationService.toDateString(new Date()),
        matchType: 'fallback' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'enhanced-fallback' as const,
        confidence: 'medium' as const
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
    const seasonalTemp = SeasonalWeatherGenerator.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    return {
      temperature: seasonalTemp,
      highTemp: seasonalTemp + tempVariation/2,
      lowTemp: seasonalTemp - tempVariation/2,
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      icon: SeasonalWeatherGenerator.getSeasonalIcon(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      windSpeed: 8,
      precipitationChance: SeasonalWeatherGenerator.getSeasonalPrecipitation(month),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      dateMatchInfo: {
        requestedDate: targetDateString,
        matchedDate: 'seasonal-estimate',
        matchType: 'none' as const,
        daysOffset: daysFromNow,
        hoursOffset: 0,
        source: 'seasonal-estimate' as const,
        confidence: 'low' as const
      }
    };
  }
}
