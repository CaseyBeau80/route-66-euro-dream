
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from '../DateNormalizationService';

export interface NormalizedWeatherData {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  isActualForecast: boolean;
  cityName: string;
  icon: string;
  dateMatchInfo?: any;
  isValid: boolean;
  source: 'api-forecast' | 'seasonal-estimate' | 'fallback';
}

export class WeatherDataNormalizer {
  /**
   * Normalize weather data to ensure consistent structure and valid display values
   */
  static normalizeWeatherData(
    weather: ForecastWeatherData | null,
    cityName: string,
    segmentDate?: Date | null
  ): NormalizedWeatherData | null {
    console.log('🔧 WeatherDataNormalizer: Normalizing weather data for', cityName, {
      hasWeather: !!weather,
      weather
    });

    if (!weather) {
      console.log('❌ WeatherDataNormalizer: No weather data to normalize');
      return null;
    }

    // Extract temperatures with robust fallback logic
    const extractedTemps = this.extractTemperatures(weather);
    
    // Validate that we have displayable data
    const hasDisplayableData = this.hasDisplayableTemperatureData(extractedTemps);
    
    if (!hasDisplayableData) {
      console.warn('⚠️ WeatherDataNormalizer: No displayable temperature data found');
      return null;
    }

    const normalized: NormalizedWeatherData = {
      temperature: extractedTemps.current,
      highTemp: extractedTemps.high,
      lowTemp: extractedTemps.low,
      description: weather.description || 'Clear conditions',
      humidity: weather.humidity || 50,
      windSpeed: Math.round(weather.windSpeed || 5),
      precipitationChance: weather.precipitationChance || 10,
      isActualForecast: !!weather.isActualForecast,
      cityName: weather.cityName || cityName,
      icon: weather.icon || '01d',
      dateMatchInfo: weather.dateMatchInfo,
      isValid: true,
      source: weather.isActualForecast ? 'api-forecast' : 'seasonal-estimate'
    };

    console.log('✅ WeatherDataNormalizer: Successfully normalized weather data:', normalized);
    return normalized;
  }

  private static extractTemperatures(weather: ForecastWeatherData): {
    current: number;
    high: number;
    low: number;
  } {
    let current = 65;
    let high = 75;
    let low = 55;

    // Priority 1: Use highTemp/lowTemp if available
    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      high = Math.round(weather.highTemp);
      low = Math.round(weather.lowTemp);
      current = Math.round((high + low) / 2);
    }
    // Priority 2: Use temperature field
    else if (weather.temperature !== undefined) {
      current = Math.round(weather.temperature);
      high = current + 10;
      low = current - 10;
    }
    // Priority 3: Check matched forecast day
    else if (weather.matchedForecastDay?.temperature) {
      const temp = weather.matchedForecastDay.temperature;
      if (typeof temp === 'object' && 'high' in temp && 'low' in temp) {
        high = Math.round(temp.high);
        low = Math.round(temp.low);
        current = Math.round((high + low) / 2);
      } else if (typeof temp === 'number') {
        current = Math.round(temp);
        high = current + 10;
        low = current - 10;
      }
    }

    return { current, high, low };
  }

  private static hasDisplayableTemperatureData(temps: { current: number; high: number; low: number }): boolean {
    // Check if we have valid temperature data (not just defaults)
    return temps.current > 0 && temps.high > 0 && temps.low > 0;
  }

  /**
   * Validate normalized weather data for export readiness
   */
  static validateForExport(normalized: NormalizedWeatherData | null): boolean {
    if (!normalized) return false;
    
    return normalized.isValid && 
           normalized.temperature > 0 && 
           normalized.highTemp > 0 && 
           normalized.lowTemp > 0;
  }
}
