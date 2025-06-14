
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures PLAN IMPLEMENTATION:', {
      cityName,
      rawWeatherInput: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      planImplementation: 'avoid_duplicate_temperatures'
    });

    if (!weather) {
      console.warn('❌ TemperatureExtractor: No weather data provided');
      return this.createInvalidResult();
    }

    const extracted = this.performCleanExtraction(weather);
    
    const result = {
      current: extracted.current,
      high: extracted.high,
      low: extracted.low,
      isValid: TemperatureValidation.hasAnyValidTemperature(extracted)
    };

    console.log('🌡️ TemperatureExtractor PLAN RESULT:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) && !isNaN(result.low) && result.high !== result.low,
      planImplementation: 'clean_extraction_complete'
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

  // PLAN IMPLEMENTATION: Clean extraction without smart fallbacks that create duplicates
  private static performCleanExtraction(weather: ForecastWeatherData) {
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // PLAN: Direct property extraction - no fallbacks to prevent duplicates
    if (weather.highTemp !== undefined && weather.highTemp !== null) {
      high = TemperatureFormatter.extractSingleTemperature(weather.highTemp, 'high-direct');
    }
    if (weather.lowTemp !== undefined && weather.lowTemp !== null) {
      low = TemperatureFormatter.extractSingleTemperature(weather.lowTemp, 'low-direct');
    }
    if (weather.temperature !== undefined && weather.temperature !== null) {
      current = TemperatureFormatter.extractSingleTemperature(weather.temperature, 'current-direct');
    }

    // PLAN: Only use matchedForecastDay if we're missing specific values
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      // PLAN: Only update if we don't already have the value (prevent overwriting)
      if (isNaN(current)) current = extracted.current;
      if (isNaN(high)) high = extracted.high;
      if (isNaN(low)) low = extracted.low;
    }

    console.log('🌡️ TemperatureExtractor: PLAN - Clean extraction result:', {
      current: isNaN(current) ? 'NaN' : current,
      high: isNaN(high) ? 'NaN' : high,
      low: isNaN(low) ? 'NaN' : low,
      allDifferent: current !== high && current !== low && high !== low,
      planImplementation: 'no_smart_fallbacks'
    });

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
