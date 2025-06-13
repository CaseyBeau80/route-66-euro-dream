
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures FOR SHARED VIEW:', {
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
    const enhanced = this.applySmartFallbacks(extracted);
    
    const result = {
      current: enhanced.current,
      high: enhanced.high,
      low: enhanced.low,
      isValid: TemperatureValidation.hasAnyValidTemperature(enhanced)
    };

    console.log('🌡️ TemperatureExtractor FINAL RESULT FOR SHARED VIEW:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) || !isNaN(result.low)
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

  private static applySmartFallbacks(temps: { current: number; high: number; low: number }) {
    let { current, high, low } = temps;

    // If we have current but not high/low, estimate them
    if (TemperatureValidation.isValidTemperature(current) && 
        (!TemperatureValidation.isValidTemperature(high) || !TemperatureValidation.isValidTemperature(low))) {
      if (!TemperatureValidation.isValidTemperature(high)) {
        high = current + 5;
      }
      if (!TemperatureValidation.isValidTemperature(low)) {
        low = current - 5;
      }
    }

    // If we have high/low but not current, calculate current as average
    if (!TemperatureValidation.isValidTemperature(current) && 
        TemperatureValidation.isValidTemperature(high) && 
        TemperatureValidation.isValidTemperature(low)) {
      current = Math.round((high + low) / 2);
    }

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
