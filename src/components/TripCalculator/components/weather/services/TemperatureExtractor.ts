
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
    console.log('🌡️ PLAN: Enhanced TemperatureExtractor implementation:', {
      cityName,
      rawWeatherInput: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      planImplementation: 'enhanced_extraction_with_logging'
    });

    if (!weather) {
      console.warn('❌ PLAN: Enhanced TemperatureExtractor: No weather data provided');
      return this.createInvalidResult();
    }

    const extracted = this.performEnhancedExtraction(weather);
    
    const result = {
      current: extracted.current,
      high: extracted.high,
      low: extracted.low,
      isValid: TemperatureValidation.hasAnyValidTemperature(extracted)
    };

    console.log('🌡️ PLAN: Enhanced TemperatureExtractor result:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) && !isNaN(result.low) && result.high !== result.low,
      hasAnyValidTemp: result.isValid,
      planImplementation: 'enhanced_extraction_complete'
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

  // PLAN IMPLEMENTATION: Enhanced extraction with comprehensive logging
  private static performEnhancedExtraction(weather: ForecastWeatherData) {
    let current = NaN;
    let high = NaN;
    let low = NaN;

    console.log('🌡️ PLAN: Enhanced extraction - direct property analysis:', {
      hasHighTemp: weather.highTemp !== undefined && weather.highTemp !== null,
      hasLowTemp: weather.lowTemp !== undefined && weather.lowTemp !== null,
      hasTemperature: weather.temperature !== undefined && weather.temperature !== null,
      hasMatchedForecastDay: !!weather.matchedForecastDay,
      planImplementation: 'enhanced_property_analysis'
    });

    // PLAN: Direct property extraction - no fallbacks to prevent duplicates
    if (weather.highTemp !== undefined && weather.highTemp !== null) {
      high = TemperatureFormatter.extractSingleTemperature(weather.highTemp, 'high-direct');
      console.log('🌡️ PLAN: Extracted high temperature directly:', high);
    }
    if (weather.lowTemp !== undefined && weather.lowTemp !== null) {
      low = TemperatureFormatter.extractSingleTemperature(weather.lowTemp, 'low-direct');
      console.log('🌡️ PLAN: Extracted low temperature directly:', low);
    }
    if (weather.temperature !== undefined && weather.temperature !== null) {
      current = TemperatureFormatter.extractSingleTemperature(weather.temperature, 'current-direct');
      console.log('🌡️ PLAN: Extracted current temperature directly:', current);
    }

    // PLAN: Only use matchedForecastDay if we're missing specific values
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ PLAN: Enhanced extraction from matchedForecastDay for missing values:', {
        needsCurrent: isNaN(current),
        needsHigh: isNaN(high),
        needsLow: isNaN(low),
        planImplementation: 'enhanced_matched_day_extraction'
      });

      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      // PLAN: Only update if we don't already have the value (prevent overwriting)
      if (isNaN(current)) {
        current = extracted.current;
        console.log('🌡️ PLAN: Updated current from matched day:', current);
      }
      if (isNaN(high)) {
        high = extracted.high;
        console.log('🌡️ PLAN: Updated high from matched day:', high);
      }
      if (isNaN(low)) {
        low = extracted.low;
        console.log('🌡️ PLAN: Updated low from matched day:', low);
      }
    }

    console.log('🌡️ PLAN: Enhanced extraction final result:', {
      current: isNaN(current) ? 'NaN' : current,
      high: isNaN(high) ? 'NaN' : high,
      low: isNaN(low) ? 'NaN' : low,
      allDifferent: current !== high && current !== low && high !== low,
      planImplementation: 'enhanced_extraction_final'
    });

    return { current, high, low };
  }

  private static extractFromMatchedDay(matched: any, existing: { current: number; high: number; low: number }) {
    let { current, high, low } = existing;

    console.log('🌡️ PLAN: Enhanced matched day extraction:', {
      matchedStructure: {
        hasTemperature: !!matched.temperature,
        temperatureType: typeof matched.temperature,
        hasMain: !!matched.main,
        mainType: typeof matched.main
      },
      planImplementation: 'enhanced_matched_day_analysis'
    });

    if (matched.temperature && typeof matched.temperature === 'object') {
      if (isNaN(high) && 'high' in matched.temperature) {
        high = TemperatureFormatter.extractSingleTemperature(matched.temperature.high, 'high-matched');
        console.log('🌡️ PLAN: Extracted high from matched.temperature.high:', high);
      }
      if (isNaN(low) && 'low' in matched.temperature) {
        low = TemperatureFormatter.extractSingleTemperature(matched.temperature.low, 'low-matched');
        console.log('🌡️ PLAN: Extracted low from matched.temperature.low:', low);
      }
    } else if (typeof matched.temperature === 'number' && isNaN(current)) {
      current = TemperatureFormatter.extractSingleTemperature(matched.temperature, 'current-matched');
      console.log('🌡️ PLAN: Extracted current from matched.temperature:', current);
    }

    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main) {
        current = TemperatureFormatter.extractSingleTemperature(matched.main.temp, 'current-main');
        console.log('🌡️ PLAN: Extracted current from matched.main.temp:', current);
      }
      if (isNaN(high) && 'temp_max' in matched.main) {
        high = TemperatureFormatter.extractSingleTemperature(matched.main.temp_max, 'high-main');
        console.log('🌡️ PLAN: Extracted high from matched.main.temp_max:', high);
      }
      if (isNaN(low) && 'temp_min' in matched.main) {
        low = TemperatureFormatter.extractSingleTemperature(matched.main.temp_min, 'low-main');
        console.log('🌡️ PLAN: Extracted low from matched.main.temp_min:', low);
      }
    }

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
