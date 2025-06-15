
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { TemperatureValidation } from '../utils/TemperatureValidation';

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
    console.log('🌡️ TEMPERATURE FIX: TemperatureExtractor - extracting REAL temperatures for', cityName, {
      rawWeatherInput: weather,
      weatherStructure: {
        hasTemperature: weather?.temperature !== undefined,
        hasHighTemp: weather?.highTemp !== undefined,
        hasLowTemp: weather?.lowTemp !== undefined,
        hasMatchedForecastDay: !!weather?.matchedForecastDay,
        temperature: weather?.temperature,
        highTemp: weather?.highTemp,
        lowTemp: weather?.lowTemp
      },
      isActualForecast: weather?.isActualForecast,
      source: weather?.source
    });

    if (!weather) {
      console.warn('❌ TEMPERATURE FIX: No weather data provided');
      return this.createInvalidResult();
    }

    // TEMPERATURE FIX: Extract temperatures from actual OpenWeatherMap data ONLY
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Extract current temperature (temp)
    if (weather.temperature !== undefined && weather.temperature !== null && !isNaN(weather.temperature)) {
      current = Math.round(weather.temperature);
      console.log('🌡️ TEMPERATURE FIX: Extracted CURRENT temperature from API:', current);
    }

    // Extract high temperature (temp_max)
    if (weather.highTemp !== undefined && weather.highTemp !== null && !isNaN(weather.highTemp)) {
      high = Math.round(weather.highTemp);
      console.log('🌡️ TEMPERATURE FIX: Extracted HIGH temperature from API:', high);
    }
    
    // Extract low temperature (temp_min)
    if (weather.lowTemp !== undefined && weather.lowTemp !== null && !isNaN(weather.lowTemp)) {
      low = Math.round(weather.lowTemp);
      console.log('🌡️ TEMPERATURE FIX: Extracted LOW temperature from API:', low);
    }

    // Try to extract from matchedForecastDay if main data is missing
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ TEMPERATURE FIX: Attempting to extract from matchedForecastDay structure');
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      if (isNaN(current)) current = extracted.current;
      if (isNaN(high)) high = extracted.high;
      if (isNaN(low)) low = extracted.low;
    }

    // TEMPERATURE FIX: Log extracted values before validation
    console.log('🌡️ TEMPERATURE FIX: Extracted temperature values (before normalization):', {
      cityName,
      current,
      high,
      low,
      currentType: typeof current,
      highType: typeof high,
      lowType: typeof low,
      currentIsNaN: isNaN(current),
      highIsNaN: isNaN(high),
      lowIsNaN: isNaN(low)
    });

    // TEMPERATURE FIX: Validate and normalize the temperatures
    const preliminaryResult = { current, high, low, isValid: true };
    const normalizedTemperatures = TemperatureValidation.normalizeTemperatures(preliminaryResult, cityName);
    const isValidRange = TemperatureValidation.validateTemperatureRange(normalizedTemperatures, cityName);

    const result = {
      current: normalizedTemperatures.current,
      high: normalizedTemperatures.high,
      low: normalizedTemperatures.low,
      isValid: isValidRange && normalizedTemperatures.isValid
    };

    console.log('🌡️ TEMPERATURE FIX: TemperatureExtractor FINAL result:', {
      cityName,
      result,
      hasValidCurrent: !isNaN(result.current),
      hasValidHigh: !isNaN(result.high),
      hasValidLow: !isNaN(result.low),
      temperatureSpread: !isNaN(result.high) && !isNaN(result.low) ? result.high - result.low : 'N/A',
      allTemperaturesDifferent: result.current !== result.high || result.high !== result.low,
      usingRealForecastDataOnly: true,
      validationPassed: isValidRange
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

    console.log('🌡️ TEMPERATURE FIX: Extracting from matched day - FULL STRUCTURE DEBUG:', {
      matchedDayStructure: matched,
      hasMain: !!matched.main,
      mainKeys: matched.main ? Object.keys(matched.main) : [],
      mainValues: matched.main,
      hasTemperature: !!matched.temperature,
      temperatureStructure: matched.temperature
    });

    // Try to extract from main weather data (standard OpenWeatherMap structure)
    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main && !isNaN(matched.main.temp)) {
        current = Math.round(matched.main.temp);
        console.log('🌡️ TEMPERATURE FIX: Extracted current from matched.main.temp:', current);
      }
      if (isNaN(high) && 'temp_max' in matched.main && !isNaN(matched.main.temp_max)) {
        high = Math.round(matched.main.temp_max);
        console.log('🌡️ TEMPERATURE FIX: Extracted high from matched.main.temp_max:', high);
      }
      if (isNaN(low) && 'temp_min' in matched.main && !isNaN(matched.main.temp_min)) {
        low = Math.round(matched.main.temp_min);
        console.log('🌡️ TEMPERATURE FIX: Extracted low from matched.main.temp_min:', low);
      }
    }

    // Try to extract from temperature object if available
    if (matched.temperature && typeof matched.temperature === 'object') {
      if (isNaN(high) && 'high' in matched.temperature && !isNaN(matched.temperature.high)) {
        high = Math.round(matched.temperature.high);
        console.log('🌡️ TEMPERATURE FIX: Extracted high from matched.temperature.high:', high);
      }
      if (isNaN(low) && 'low' in matched.temperature && !isNaN(matched.temperature.low)) {
        low = Math.round(matched.temperature.low);
        console.log('🌡️ TEMPERATURE FIX: Extracted low from matched.temperature.low:', low);
      }
    }

    console.log('🌡️ TEMPERATURE FIX: Final extraction from matched day:', {
      current,
      high,
      low,
      anyChanges: current !== existing.current || high !== existing.high || low !== existing.low
    });

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
