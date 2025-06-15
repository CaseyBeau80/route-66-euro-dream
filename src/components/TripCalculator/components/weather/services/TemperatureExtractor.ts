
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
    console.log('🌡️ FORECAST: TemperatureExtractor - using actual forecast data:', {
      cityName,
      rawWeatherInput: weather,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      isActualForecast: weather?.isActualForecast,
      source: weather?.source
    });

    if (!weather) {
      console.warn('❌ FORECAST: TemperatureExtractor: No weather data provided');
      return this.createInvalidResult();
    }

    // FORECAST: Use the actual forecast temperatures directly - NO ARTIFICIAL GENERATION
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Extract current temperature
    if (weather.temperature !== undefined && weather.temperature !== null && !isNaN(weather.temperature)) {
      current = Math.round(weather.temperature);
      console.log('🌡️ FORECAST: Extracted current temperature from forecast:', current);
    }

    // Extract high temperature from forecast data
    if (weather.highTemp !== undefined && weather.highTemp !== null && !isNaN(weather.highTemp)) {
      high = Math.round(weather.highTemp);
      console.log('🌡️ FORECAST: Extracted HIGH temperature from forecast:', high);
    }
    
    // Extract low temperature from forecast data
    if (weather.lowTemp !== undefined && weather.lowTemp !== null && !isNaN(weather.lowTemp)) {
      low = Math.round(weather.lowTemp);
      console.log('🌡️ FORECAST: Extracted LOW temperature from forecast:', low);
    }

    // Try to extract from matchedForecastDay if main data is missing
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ FORECAST: Extracting from matchedForecastDay for missing values');
      const extracted = this.extractFromMatchedDay(weather.matchedForecastDay, { current, high, low });
      
      if (isNaN(current)) current = extracted.current;
      if (isNaN(high)) high = extracted.high;
      if (isNaN(low)) low = extracted.low;
    }

    const result = {
      current,
      high,
      low,
      isValid: !isNaN(current) || (!isNaN(high) && !isNaN(low))
    };

    console.log('🌡️ FORECAST: TemperatureExtractor FINAL result - using actual forecast data:', {
      cityName,
      result,
      hasValidCurrent: !isNaN(result.current),
      hasValidHigh: !isNaN(result.high),
      hasValidLow: !isNaN(result.low),
      temperatureSpread: !isNaN(result.high) && !isNaN(result.low) ? result.high - result.low : 'N/A',
      usingActualForecastData: true,
      noArtificialTemperatures: true
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

    console.log('🌡️ FORECAST: Extracting from matched day structure:', {
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
        console.log('🌡️ FORECAST: Extracted high from matched.temperature.high:', high);
      }
      if (isNaN(low) && 'low' in matched.temperature && !isNaN(matched.temperature.low)) {
        low = Math.round(matched.temperature.low);
        console.log('🌡️ FORECAST: Extracted low from matched.temperature.low:', low);
      }
    }

    // Try to extract from main weather data
    if (matched.main && typeof matched.main === 'object') {
      if (isNaN(current) && 'temp' in matched.main && !isNaN(matched.main.temp)) {
        current = Math.round(matched.main.temp);
        console.log('🌡️ FORECAST: Extracted current from matched.main.temp:', current);
      }
      if (isNaN(high) && 'temp_max' in matched.main && !isNaN(matched.main.temp_max)) {
        high = Math.round(matched.main.temp_max);
        console.log('🌡️ FORECAST: Extracted high from matched.main.temp_max:', high);
      }
      if (isNaN(low) && 'temp_min' in matched.main && !isNaN(matched.main.temp_min)) {
        low = Math.round(matched.main.temp_min);
        console.log('🌡️ FORECAST: Extracted low from matched.main.temp_min:', low);
      }
    }

    return { current, high, low };
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    return TemperatureValidation.hasAnyValidTemperature(temperatures);
  }
}
