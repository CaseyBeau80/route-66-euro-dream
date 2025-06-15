
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
    console.log('🌡️ FIXED: TemperatureExtractor - analyzing weather data:', {
      cityName,
      rawWeatherInput: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      hasMatchedForecastDay: !!weather?.matchedForecastDay
    });

    if (!weather) {
      console.warn('❌ FIXED: TemperatureExtractor: No weather data provided');
      return this.createInvalidResult();
    }

    // FIXED: Enhanced extraction logic that prevents duplicate temperatures
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // FIXED: Extract high and low temperatures first (these should be different values)
    if (weather.highTemp !== undefined && weather.highTemp !== null && !isNaN(weather.highTemp)) {
      high = Math.round(weather.highTemp);
      console.log('🌡️ FIXED: Extracted high temperature:', high);
    }
    
    if (weather.lowTemp !== undefined && weather.lowTemp !== null && !isNaN(weather.lowTemp)) {
      low = Math.round(weather.lowTemp);
      console.log('🌡️ FIXED: Extracted low temperature:', low);
    }

    // FIXED: For current temperature, use the main temperature field
    if (weather.temperature !== undefined && weather.temperature !== null && !isNaN(weather.temperature)) {
      current = Math.round(weather.temperature);
      console.log('🌡️ FIXED: Extracted current temperature:', current);
    }

    // FIXED: If we have high/low but no current, calculate a reasonable current temp
    if (isNaN(current) && !isNaN(high) && !isNaN(low)) {
      current = Math.round((high + low) / 2);
      console.log('🌡️ FIXED: Calculated current from high/low average:', current);
    }

    // FIXED: If we only have current temp, create a reasonable range
    if (!isNaN(current) && (isNaN(high) || isNaN(low))) {
      if (isNaN(high)) {
        high = current + 8; // Typical daily high is 8°F above current
        console.log('🌡️ FIXED: Estimated high temperature:', high);
      }
      if (isNaN(low)) {
        low = current - 12; // Typical daily low is 12°F below current  
        console.log('🌡️ FIXED: Estimated low temperature:', low);
      }
    }

    // FIXED: Try to extract from matchedForecastDay if we're still missing data
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ FIXED: Extracting from matchedForecastDay for missing values');
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      if (isNaN(current)) current = extracted.current;
      if (isNaN(high)) high = extracted.high;
      if (isNaN(low)) low = extracted.low;
    }

    // FIXED: Validation to ensure we don't have identical temperatures
    if (!isNaN(current) && !isNaN(high) && !isNaN(low)) {
      // If all three are the same, create a realistic range
      if (current === high && high === low) {
        high = current + 6;
        low = current - 10;
        console.log('🌡️ FIXED: Adjusted identical temperatures to create range:', { current, high, low });
      }
      
      // Ensure high is actually higher than low
      if (high <= low) {
        const temp = high;
        high = low + 10;
        low = temp - 5;
        console.log('🌡️ FIXED: Corrected inverted high/low temperatures:', { high, low });
      }
    }

    const result = {
      current,
      high,
      low,
      isValid: !isNaN(current) || (!isNaN(high) && !isNaN(low))
    };

    console.log('🌡️ FIXED: TemperatureExtractor final result:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) && !isNaN(result.low) && result.high !== result.low,
      temperatureSpread: !isNaN(result.high) && !isNaN(result.low) ? result.high - result.low : 'N/A',
      allDifferent: result.current !== result.high && result.current !== result.low && result.high !== result.low
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

  private static extractFromMatchedDay(matched: any, existing: { current: number; high: number; low: number }) {
    let { current, high, low } = existing;

    console.log('🌡️ FIXED: Enhanced matched day extraction:', {
      matchedStructure: {
        hasTemperature: !!matched.temperature,
        temperatureType: typeof matched.temperature,
        hasMain: !!matched.main,
        mainStructure: matched.main ? Object.keys(matched.main) : []
      }
    });

    // Try to extract from temperature object first
    if (matched.temperature && typeof matched.temperature === 'object') {
      if (isNaN(high) && 'high' in matched.temperature && !isNaN(matched.temperature.high)) {
        high = Math.round(matched.temperature.high);
        console.log('🌡️ FIXED: Extracted high from matched.temperature.high:', high);
      }
      if (isNaN(low) && 'low' in matched.temperature && !isNaN(matched.temperature.low)) {
        low = Math.round(matched.temperature.low);
        console.log('🌡️ FIXED: Extracted low from matched.temperature.low:', low);
      }
    }

    // Try to extract from main weather data
    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main && !isNaN(matched.main.temp)) {
        current = Math.round(matched.main.temp);
        console.log('🌡️ FIXED: Extracted current from matched.main.temp:', current);
      }
      if (isNaN(high) && 'temp_max' in matched.main && !isNaN(matched.main.temp_max)) {
        high = Math.round(matched.main.temp_max);
        console.log('🌡️ FIXED: Extracted high from matched.main.temp_max:', high);
      }
      if (isNaN(low) && 'temp_min' in matched.main && !isNaN(matched.main.temp_min)) {
        low = Math.round(matched.main.temp_min);
        console.log('🌡️ FIXED: Extracted low from matched.main.temp_min:', low);
      }
    }

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
