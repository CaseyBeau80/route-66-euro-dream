
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureValidation } from '../utils/TemperatureValidation';
import { TemperatureFormatter } from '../utils/TemperatureFormatter';

export interface ExtractedTemperatures {
  current: number;
  high: number;
  low: number;
  isValid: boolean;
}

export class TemperatureExtractor {
  static extractTemperatures(
    weather: ForecastWeatherData,
    cityName: string
  ): ExtractedTemperatures {
    console.log('🌡️ TemperatureExtractor.extractTemperatures FIXED VERSION:', {
      cityName,
      rawWeatherInput: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp
    });

    if (!weather) {
      console.warn('❌ TemperatureExtractor: No weather data provided');
      return this.createInvalidResult();
    }

    const extracted = this.performExtraction(weather);
    // REMOVED: Smart fallbacks that were creating identical temperatures
    
    const result = {
      current: extracted.current,
      high: extracted.high,
      low: extracted.low,
      isValid: TemperatureValidation.hasAnyValidTemperature(extracted)
    };

    console.log('🌡️ TemperatureExtractor FIXED RESULT:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) && !isNaN(result.low) && result.high !== result.low
    });
    
    return result;
  }

  private static createInvalidResult(): ExtractedTemperatures {
    return {
      current: NaN,
      high: NaN,
      low: NaN,
      isValid: false
    };
  }

  private static performExtraction(weather: ForecastWeatherData) {
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Direct property extraction
    if (weather.highTemp !== undefined && weather.highTemp !== null) {
      high = TemperatureFormatter.extractSingleTemperature(weather.highTemp, 'high-direct');
    }
    if (weather.lowTemp !== undefined && weather.lowTemp !== null) {
      low = TemperatureFormatter.extractSingleTemperature(weather.lowTemp, 'low-direct');
    }
    if (weather.temperature !== undefined && weather.temperature !== null) {
      current = TemperatureFormatter.extractSingleTemperature(weather.temperature, 'current-direct');
    }

    // MatchedForecastDay extraction if needed
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      current = isNaN(current) ? extracted.current : current;
      high = isNaN(high) ? extracted.high : high;
      low = isNaN(low) ? extracted.low : low;
    }

    return { current, high, low };
  }

  private static extractFromMatchedDay(matched: any, existing: { current: number; high: number; low: number }) {
    let { current, high, low } = existing;

    if (matched.temperature && typeof matched.temperature === 'object') {
      if (isNaN(high) && 'high' in matched.temperature) {
        high = TemperatureFormatter.extractSingleTemperature(matched.temperature.high, 'high-matched');
      }
      if (isNaN(low) && 'low' in matched.temperature) {
        low = TemperatureFormatter.extractSingleTemperature(matched.temperature.low, 'low-matched');
      }
    } else if (typeof matched.temperature === 'number' && isNaN(current)) {
      current = TemperatureFormatter.extractSingleTemperature(matched.temperature, 'current-matched');
    }

    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main) {
        current = TemperatureFormatter.extractSingleTemperature(matched.main.temp, 'current-main');
      }
      if (isNaN(high) && 'temp_max' in matched.main) {
        high = TemperatureFormatter.extractSingleTemperature(matched.main.temp_max, 'high-main');
      }
      if (isNaN(low) && 'temp_min' in matched.main) {
        low = TemperatureFormatter.extractSingleTemperature(matched.main.temp_min, 'low-main');
      }
    }

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
