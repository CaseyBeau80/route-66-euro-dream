
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
    console.log('🌡️ REAL DATA EXTRACTION: TemperatureExtractor - extracting REAL temperatures for', cityName, {
      rawWeatherInput: weather,
      weatherStructure: {
        hasTemperature: weather?.temperature !== undefined,
        hasHighTemp: weather?.highTemp !== undefined,
        hasLowTemp: weather?.lowTemp !== undefined,
        temperature: weather?.temperature,
        highTemp: weather?.highTemp,
        lowTemp: weather?.lowTemp
      },
      extractingRealDataOnly: true
    });

    if (!weather) {
      console.warn('❌ REAL DATA EXTRACTION: No weather data provided');
      return this.createInvalidResult();
    }

    // Extract temperatures from the ForecastWeatherData structure
    // These should already be the processed values from the API
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Extract current temperature (this should be the main temp from API)
    if (weather.temperature !== undefined && weather.temperature !== null && !isNaN(weather.temperature)) {
      current = Math.round(weather.temperature);
      console.log('🌡️ REAL DATA EXTRACTION: Extracted CURRENT temperature:', current);
    }

    // Extract high temperature (this should be temp_max from API)
    if (weather.highTemp !== undefined && weather.highTemp !== null && !isNaN(weather.highTemp)) {
      high = Math.round(weather.highTemp);
      console.log('🌡️ REAL DATA EXTRACTION: Extracted HIGH temperature:', high);
    }
    
    // Extract low temperature (this should be temp_min from API)
    if (weather.lowTemp !== undefined && weather.lowTemp !== null && !isNaN(weather.lowTemp)) {
      low = Math.round(weather.lowTemp);
      console.log('🌡️ REAL DATA EXTRACTION: Extracted LOW temperature:', low);
    }

    // Try to extract from matchedForecastDay if main data is incomplete
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ REAL DATA EXTRACTION: Attempting to extract from matchedForecastDay structure');
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      // Only use extracted values if we don't already have them
      if (isNaN(current)) current = extracted.current;
      if (isNaN(high)) high = extracted.high;
      if (isNaN(low)) low = extracted.low;
    }

    console.log('🌡️ REAL DATA EXTRACTION: Final extracted values (before validation):', {
      cityName,
      current,
      high,
      low,
      allDifferent: (current !== high && high !== low && current !== low),
      extractedFromRealAPI: true
    });

    // Use the real-data-only normalization (which preserves exact values)
    const preliminaryResult = { current, high, low, isValid: true };
    const normalizedTemperatures = TemperatureValidation.normalizeTemperatures(preliminaryResult, cityName);
    const isValidRange = TemperatureValidation.validateTemperatureRange(normalizedTemperatures, cityName);

    const result = {
      current: normalizedTemperatures.current,
      high: normalizedTemperatures.high,
      low: normalizedTemperatures.low,
      isValid: isValidRange && normalizedTemperatures.isValid
    };

    console.log('✅ REAL DATA EXTRACTION: TemperatureExtractor FINAL result:', {
      cityName,
      result,
      temperaturesAreDifferent: {
        currentVsHigh: !isNaN(result.current) && !isNaN(result.high) ? result.current !== result.high : 'N/A',
        currentVsLow: !isNaN(result.current) && !isNaN(result.low) ? result.current !== result.low : 'N/A', 
        highVsLow: !isNaN(result.high) && !isNaN(result.low) ? result.high !== result.low : 'N/A'
      },
      usingOnlyRealAPIData: true
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

    console.log('🌡️ REAL DATA EXTRACTION: Extracting from matched day - STRUCTURE DEBUG:', {
      matchedDayStructure: matched,
      hasMain: !!matched.main,
      mainValues: matched.main
    });

    // Try to extract from main weather data (standard OpenWeatherMap structure)
    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main && !isNaN(matched.main.temp)) {
        current = Math.round(matched.main.temp);
        console.log('🌡️ REAL DATA EXTRACTION: Extracted current from matched.main.temp:', current);
      }
      if (isNaN(high) && 'temp_max' in matched.main && !isNaN(matched.main.temp_max)) {
        high = Math.round(matched.main.temp_max);
        console.log('🌡️ REAL DATA EXTRACTION: Extracted high from matched.main.temp_max:', high);
      }
      if (isNaN(low) && 'temp_min' in matched.main && !isNaN(matched.main.temp_min)) {
        low = Math.round(matched.main.temp_min);
        console.log('🌡️ REAL DATA EXTRACTION: Extracted low from matched.main.temp_min:', low);
      }
    }

    console.log('🌡️ REAL DATA EXTRACTION: Final extraction from matched day:', {
      current,
      high,
      low,
      extractedRealData: true
    });

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
