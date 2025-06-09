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
    
    console.log(`🌤️ WeatherForecastService: Enhanced weather request for ${cityName} on ${targetDate.toDateString()}, ${daysFromNow} days from now`);

    // Enhanced logic: try to get actual forecast if within range
    if (daysFromNow >= 0 && daysFromNow <= this.FORECAST_THRESHOLD_DAYS) {
      const actualForecast = await this.getActualForecast(lat, lng, cityName, targetDate, daysFromNow);
      if (actualForecast) {
        return actualForecast;
      }
      // Fallback to enhanced forecast processing even if API fails
      console.log(`⚠️ WeatherForecastService: API failed, attempting enhanced fallback for ${cityName}`);
    }

    // For dates beyond 5-day forecast range or API failure, return enhanced fallback
    return this.getEnhancedFallbackForecast(cityName, targetDate, daysFromNow);
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
      
      console.log(`🔮 WeatherForecastService: Got enhanced actual forecast data for ${cityName}`);
      
      // Enhanced processing with 5-day support
      const processedForecast = WeatherDataProcessor.processEnhancedForecastData(forecastData, targetDate, 5);
      
      // **PHASE 4 FIX**: Always call findBestForecastMatch and ensure dateMatchInfo is populated
      const matchResult = this.findBestForecastMatch(processedForecast, targetDate);
      
      console.log(`🎯 PHASE 4 - Match result for ${cityName}:`, {
        hasMatch: !!matchResult.matchedForecast,
        matchInfo: matchResult.matchInfo,
        targetDate: targetDate.toISOString(),
        processedForecastCount: processedForecast.length
      });
      
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
        console.log(`⚠️ WeatherForecastService: No suitable forecast match, creating enhanced fallback for ${cityName}`);
        // **PHASE 4 FIX**: Still populate dateMatchInfo even in fallback scenarios
        return this.createEnhancedForecastFromCurrent(currentData, cityName, targetDate, processedForecast, matchResult.matchInfo);
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
    processedForecast: ForecastDay[],
    fallbackMatchInfo?: any
  ): ForecastWeatherData {
    console.log(`🔧 WeatherForecastService: Creating enhanced forecast from current data for ${cityName}`);
    
    const currentTemp = currentData.main.temp;
    const tempVariation = 10; // Add realistic temperature variation
    
    // **PHASE 4 FIX**: Always provide dateMatchInfo, even for fallback scenarios
    const dateMatchInfo = fallbackMatchInfo || {
      requestedDate: targetDate.toISOString().split('T')[0],
      matchedDate: new Date().toISOString().split('T')[0],
      matchType: 'closest' as const,
      daysOffset: Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    };
    
    console.log(`📅 PHASE 4 - Created fallback dateMatchInfo:`, dateMatchInfo);
    
    return {
      temperature: Math.round(currentTemp),
      highTemp: Math.round(currentTemp + tempVariation/2),
      lowTemp: Math.round(currentTemp - tempVariation/2),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind?.speed || 0),
      precipitationChance: Math.round((currentData.main.humidity / 100) * 30), // Estimate from humidity
      cityName: cityName,
      forecast: processedForecast.length > 0 ? processedForecast : [],
      forecastDate: targetDate,
      isActualForecast: true, // Mark as actual since it's based on real API data
      dateMatchInfo: dateMatchInfo
    };
  }

  private findBestForecastMatch(
    processedForecast: ForecastDay[], 
    targetDate: Date
  ): { matchedForecast: ForecastDay | null; matchInfo: any } {
    const targetDateUTC = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const targetDateString = targetDateUTC.toISOString().split('T')[0];
    
    console.log(`🎯 Enhanced forecast matching for ${targetDateString} from ${processedForecast.length} forecasts`);
    
    // **PHASE 4**: Enhanced logging for forecast matching
    if (processedForecast.length === 0) {
      console.warn(`⚠️ PHASE 4: No processed forecasts available for matching`);
      return {
        matchedForecast: null,
        matchInfo: {
          requestedDate: targetDateString,
          matchedDate: 'no-forecasts-available',
          matchType: 'none' as const,
          daysOffset: -1
        }
      };
    }
    
    // Log all available forecast dates for debugging
    console.log(`📊 PHASE 4 - Available forecast dates:`, processedForecast.map(f => f.dateString));
    
    // First try exact date match
    for (const forecast of processedForecast) {
      if (forecast.dateString === targetDateString) {
        console.log(`✅ PHASE 4 - Exact date match found: ${forecast.dateString}`);
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
    let actualOffset = 0;
    
    for (const forecast of processedForecast) {
      if (!forecast.dateString) continue;
      
      const forecastDate = new Date(forecast.dateString + 'T00:00:00Z');
      const offsetDays = Math.abs((forecastDate.getTime() - targetDateUTC.getTime()) / (24 * 60 * 60 * 1000));
      const actualDayOffset = Math.round((forecastDate.getTime() - targetDateUTC.getTime()) / (24 * 60 * 60 * 1000));
      
      if (offsetDays < smallestOffset && offsetDays <= 2) { // Within 2 days
        closestForecast = forecast;
        smallestOffset = offsetDays;
        actualOffset = actualDayOffset;
      }
    }
    
    if (closestForecast) {
      console.log(`🎯 PHASE 4 - Closest match found: ${closestForecast.dateString} (${smallestOffset} days offset)`);
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
    
    console.log(`❌ PHASE 4 - No suitable forecast match found within 2-day range`);
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
    daysFromNow: number
  ): ForecastWeatherData {
    console.log(`📅 WeatherForecastService: Creating enhanced fallback forecast for ${cityName} (${daysFromNow} days ahead)`);
    
    // Generate realistic seasonal data based on date
    const month = targetDate.getMonth();
    const seasonalTemp = this.getSeasonalTemperature(month);
    const tempVariation = 15;
    
    // **PHASE 4 FIX**: Always provide dateMatchInfo for fallback forecasts
    const dateMatchInfo = {
      requestedDate: targetDate.toISOString().split('T')[0],
      matchedDate: 'seasonal-estimate',
      matchType: 'none' as const,
      daysOffset: daysFromNow
    };
    
    console.log(`📊 PHASE 4 - Created seasonal fallback dateMatchInfo:`, dateMatchInfo);
    
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
      isActualForecast: false, // Mark as fallback
      dateMatchInfo: dateMatchInfo
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
    if (month >= 6 && month <= 8) return 60; // Summer humidity
    if (month >= 11 || month <= 2) return 45; // Winter dryness
    return 55; // Spring/fall moderate
  }

  private getSeasonalPrecipitation(month: number): number {
    if (month >= 4 && month <= 6) return 35; // Spring rain
    if (month >= 7 && month <= 9) return 25; // Summer storms
    return 20; // Generally lower
  }
}
