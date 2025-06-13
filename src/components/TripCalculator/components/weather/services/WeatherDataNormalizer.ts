
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface NormalizedWeatherData {
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
  source: 'live_forecast' | 'historical_fallback' | 'seasonal'; // FIXED: Ensure source is included
  dateMatchInfo?: {
    requestedDate: string;
    matchedDate: string;
    matchType: 'exact' | 'closest' | 'adjacent' | 'fallback' | 'none' | 'seasonal-estimate';
    daysOffset: number;
    hoursOffset?: number;
    source: 'live_forecast' | 'api-forecast' | 'enhanced-fallback' | 'seasonal-estimate' | 'historical_fallback';
    confidence?: 'high' | 'medium' | 'low';
    availableDates?: string[];
  };
  isValid: boolean;
}

export class WeatherDataNormalizer {
  /**
   * Normalize weather data for consistent storage and display
   */
  static normalizeWeatherData(
    weatherData: ForecastWeatherData | any,
    cityName: string,
    segmentDate: Date
  ): NormalizedWeatherData | null {
    console.log('🔧 PLAN: WeatherDataNormalizer.normalizeWeatherData ENHANCED', {
      cityName,
      inputData: {
        temperature: weatherData?.temperature,
        highTemp: weatherData?.highTemp,
        lowTemp: weatherData?.lowTemp,
        isActualForecast: weatherData?.isActualForecast,
        source: weatherData?.source,
        dateMatchInfoSource: weatherData?.dateMatchInfo?.source
      },
      segmentDate: segmentDate.toISOString()
    });

    if (!weatherData) {
      console.warn('🔧 PLAN: WeatherDataNormalizer: No weather data provided');
      return null;
    }

    try {
      // Extract temperature values with fallbacks
      const temperature = this.extractTemperature(weatherData.temperature) || 70;
      const highTemp = this.extractTemperature(weatherData.highTemp) || temperature + 10;
      const lowTemp = this.extractTemperature(weatherData.lowTemp) || temperature - 10;

      // FIXED: Determine source with proper fallback logic
      let source: 'live_forecast' | 'historical_fallback' | 'seasonal' = 'historical_fallback';
      
      if (weatherData.source) {
        // Use explicit source if available
        if (weatherData.source === 'live_forecast') {
          source = 'live_forecast';
        } else if (weatherData.source === 'seasonal') {
          source = 'seasonal';
        } else {
          source = 'historical_fallback';
        }
      } else if (weatherData.dateMatchInfo?.source) {
        // Fallback to dateMatchInfo source
        if (weatherData.dateMatchInfo.source === 'live_forecast') {
          source = 'live_forecast';
        } else if (weatherData.dateMatchInfo.source === 'seasonal-estimate') {
          source = 'seasonal';
        } else {
          source = 'historical_fallback';
        }
      } else if (weatherData.isActualForecast === true) {
        // Final fallback based on isActualForecast
        source = 'live_forecast';
      }

      const normalized: NormalizedWeatherData = {
        temperature,
        highTemp,
        lowTemp,
        description: weatherData.description || 'Weather forecast',
        icon: weatherData.icon || '01d',
        humidity: weatherData.humidity || 50,
        windSpeed: weatherData.windSpeed || 0,
        precipitationChance: weatherData.precipitationChance || 0,
        cityName: cityName,
        isActualForecast: weatherData.isActualForecast || false,
        source, // FIXED: Always include source
        dateMatchInfo: weatherData.dateMatchInfo,
        isValid: true
      };

      console.log('🔧 PLAN: WeatherDataNormalizer NORMALIZED RESULT', {
        cityName,
        normalized: {
          temperature: normalized.temperature,
          isActualForecast: normalized.isActualForecast,
          source: normalized.source,
          hasDateMatchInfo: !!normalized.dateMatchInfo
        }
      });

      return normalized;
    } catch (error) {
      console.error('🔧 PLAN: WeatherDataNormalizer error:', error);
      return null;
    }
  }

  /**
   * Extract a single temperature value from various formats
   */
  private static extractTemperature(temp: any): number | null {
    if (typeof temp === 'number' && !isNaN(temp)) {
      return Math.round(temp);
    }
    
    if (typeof temp === 'string') {
      const parsed = parseFloat(temp);
      if (!isNaN(parsed)) {
        return Math.round(parsed);
      }
    }
    
    if (temp && typeof temp === 'object') {
      // Handle temperature objects with high/low properties
      if ('high' in temp && typeof temp.high === 'number') {
        return Math.round(temp.high);
      }
      if ('low' in temp && typeof temp.low === 'number') {
        return Math.round(temp.low);
      }
      // Handle temperature objects with avg property
      if ('avg' in temp && typeof temp.avg === 'number') {
        return Math.round(temp.avg);
      }
    }
    
    return null;
  }

  /**
   * Validate that normalized data has required fields
   */
  static validateNormalizedData(data: NormalizedWeatherData): boolean {
    return !!(
      data &&
      typeof data.temperature === 'number' &&
      typeof data.isActualForecast === 'boolean' &&
      data.source && // FIXED: Ensure source is validated
      data.cityName &&
      data.isValid
    );
  }
}
