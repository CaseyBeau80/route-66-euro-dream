
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
    // 🚨 DEBUG INJECTION: Entry point logging
    console.log('🚨 DEBUG: WeatherDataNormalizer.normalizeWeatherData ENTRY', {
      cityName,
      hasWeather: !!weather,
      segmentDate: segmentDate?.toISOString(),
      weatherInput: weather ? {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        isActualForecast: weather.isActualForecast,
        description: weather.description,
        source: weather.dateMatchInfo?.source
      } : null
    });

    console.log('🔧 WeatherDataNormalizer: Normalizing weather data for', cityName, {
      hasWeather: !!weather,
      weather
    });

    if (!weather) {
      // 🚨 DEBUG INJECTION: No weather data logging
      console.log('🚨 DEBUG: WeatherDataNormalizer RETURNING NULL - no weather data', {
        cityName,
        segmentDate: segmentDate?.toISOString()
      });
      console.log('❌ WeatherDataNormalizer: No weather data to normalize');
      return null;
    }

    // Extract temperatures with robust fallback logic
    const extractedTemps = this.extractTemperatures(weather);
    
    // 🚨 DEBUG INJECTION: Temperature extraction logging
    console.log('🚨 DEBUG: WeatherDataNormalizer temperature extraction', {
      cityName,
      inputTemperatures: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp
      },
      extractedTemps,
      hasDisplayableData: this.hasDisplayableTemperatureData(extractedTemps)
    });
    
    // Validate that we have displayable data
    const hasDisplayableData = this.hasDisplayableTemperatureData(extractedTemps);
    
    if (!hasDisplayableData) {
      // 🚨 DEBUG INJECTION: No displayable data logging
      console.log('🚨 DEBUG: WeatherDataNormalizer RETURNING NULL - no displayable data', {
        cityName,
        extractedTemps,
        validation: {
          currentValid: extractedTemps.current > 0,
          highValid: extractedTemps.high > 0,
          lowValid: extractedTemps.low > 0
        }
      });
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

    // 🚨 DEBUG INJECTION: Normalization success logging
    console.log('🚨 DEBUG: WeatherDataNormalizer SUCCESSFULLY NORMALIZED', {
      cityName,
      normalizedResult: normalized,
      isValid: normalized.isValid,
      hasAllTemps: !!(normalized.temperature && normalized.highTemp && normalized.lowTemp),
      source: normalized.source
    });

    console.log('✅ WeatherDataNormalizer: Successfully normalized weather data:', normalized);
    return normalized;
  }

  private static extractTemperatures(weather: ForecastWeatherData): {
    current: number;
    high: number;
    low: number;
  } {
    // 🚨 DEBUG INJECTION: Temperature extraction start
    console.log('🚨 DEBUG: WeatherDataNormalizer.extractTemperatures START', {
      inputWeather: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        matchedForecastDay: weather.matchedForecastDay?.temperature
      }
    });

    let current = 65;
    let high = 75;
    let low = 55;

    // Priority 1: Use highTemp/lowTemp if available
    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      // 🚨 DEBUG INJECTION: Priority 1 path
      console.log('🚨 DEBUG: WeatherDataNormalizer using Priority 1 (highTemp/lowTemp)', {
        rawHighTemp: weather.highTemp,
        rawLowTemp: weather.lowTemp
      });

      high = Math.round(weather.highTemp);
      low = Math.round(weather.lowTemp);
      current = Math.round((high + low) / 2);
    }
    // Priority 2: Use temperature field
    else if (weather.temperature !== undefined) {
      // 🚨 DEBUG INJECTION: Priority 2 path
      console.log('🚨 DEBUG: WeatherDataNormalizer using Priority 2 (temperature field)', {
        rawTemperature: weather.temperature
      });

      current = Math.round(weather.temperature);
      high = current + 10;
      low = current - 10;
    }
    // Priority 3: Check matched forecast day
    else if (weather.matchedForecastDay?.temperature) {
      // 🚨 DEBUG INJECTION: Priority 3 path
      console.log('🚨 DEBUG: WeatherDataNormalizer using Priority 3 (matched forecast day)', {
        matchedForecastTemp: weather.matchedForecastDay.temperature,
        tempType: typeof weather.matchedForecastDay.temperature
      });

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
    } else {
      // 🚨 DEBUG INJECTION: Fallback path
      console.log('🚨 DEBUG: WeatherDataNormalizer using fallback defaults', {
        reason: 'no_valid_temperature_data_found'
      });
    }

    const result = { current, high, low };

    // 🚨 DEBUG INJECTION: Extraction result
    console.log('🚨 DEBUG: WeatherDataNormalizer.extractTemperatures RESULT', {
      result,
      isValid: result.current > 0 && result.high > 0 && result.low > 0
    });

    return result;
  }

  private static hasDisplayableTemperatureData(temps: { current: number; high: number; low: number }): boolean {
    const isValid = temps.current > 0 && temps.high > 0 && temps.low > 0;
    
    // 🚨 DEBUG INJECTION: Validation logging
    console.log('🚨 DEBUG: WeatherDataNormalizer.hasDisplayableTemperatureData', {
      temps,
      validationResult: isValid,
      checks: {
        currentValid: temps.current > 0,
        highValid: temps.high > 0,
        lowValid: temps.low > 0
      }
    });

    return isValid;
  }

  /**
   * Validate normalized weather data for export readiness
   */
  static validateForExport(normalized: NormalizedWeatherData | null): boolean {
    const isValid = normalized !== null && 
           normalized.isValid && 
           normalized.temperature > 0 && 
           normalized.highTemp > 0 && 
           normalized.lowTemp > 0;

    // 🚨 DEBUG INJECTION: Export validation logging
    console.log('🚨 DEBUG: WeatherDataNormalizer.validateForExport', {
      hasNormalized: !!normalized,
      isValid,
      normalized: normalized ? {
        isValid: normalized.isValid,
        temperature: normalized.temperature,
        highTemp: normalized.highTemp,
        lowTemp: normalized.lowTemp
      } : null
    });

    return isValid;
  }
}
