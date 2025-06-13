
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
    console.log('🌡️ TemperatureExtractor.extractTemperatures:', {
      cityName,
      inputWeather: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        temperatureType: typeof weather.temperature,
        highTempType: typeof weather.highTemp,
        lowTempType: typeof weather.lowTemp
      }
    });

    // Extract individual temperature values with more lenient validation
    const current = this.extractSingleTemperature(weather.temperature, 'current');
    const high = this.extractSingleTemperature(weather.highTemp, 'high');
    const low = this.extractSingleTemperature(weather.lowTemp, 'low');

    console.log('🌡️ TemperatureExtractor extracted values:', {
      cityName,
      current,
      high,
      low,
      currentValid: this.isValidTemperature(current),
      highValid: this.isValidTemperature(high),
      lowValid: this.isValidTemperature(low)
    });

    // If we have high/low but not current, calculate current as average
    let finalCurrent = current;
    if (!this.isValidTemperature(current) && this.isValidTemperature(high) && this.isValidTemperature(low)) {
      finalCurrent = Math.round((high + low) / 2);
      console.log('🌡️ TemperatureExtractor calculated current from high/low:', finalCurrent);
    }

    // If we have current but not high/low, estimate them
    let finalHigh = high;
    let finalLow = low;
    if (this.isValidTemperature(finalCurrent)) {
      if (!this.isValidTemperature(high)) {
        finalHigh = finalCurrent + 5; // Estimate high temp
      }
      if (!this.isValidTemperature(low)) {
        finalLow = finalCurrent - 5; // Estimate low temp
      }
    }

    const result = {
      current: finalCurrent,
      high: finalHigh,
      low: finalLow,
      isValid: this.hasDisplayableTemperatureData({
        current: finalCurrent,
        high: finalHigh,
        low: finalLow,
        isValid: true
      })
    };

    console.log('🌡️ TemperatureExtractor final result:', result);
    return result;
  }

  private static extractSingleTemperature(temp: any, type: string): number {
    console.log(`🌡️ TemperatureExtractor.extractSingleTemperature [${type}]:`, {
      temp,
      type: typeof temp,
      isNumber: typeof temp === 'number',
      isObject: typeof temp === 'object'
    });

    // Handle different temperature formats
    if (typeof temp === 'number' && !isNaN(temp)) {
      return Math.round(temp);
    }

    if (temp && typeof temp === 'object') {
      // Handle object format like { high: 75, low: 65 }
      if ('high' in temp && typeof temp.high === 'number') {
        return Math.round(temp.high);
      }
      if ('low' in temp && typeof temp.low === 'number') {
        return Math.round(temp.low);
      }
      if ('temp' in temp && typeof temp.temp === 'number') {
        return Math.round(temp.temp);
      }
    }

    // Handle string numbers
    if (typeof temp === 'string') {
      const parsed = parseFloat(temp);
      if (!isNaN(parsed)) {
        return Math.round(parsed);
      }
    }

    console.warn(`❌ TemperatureExtractor: Could not extract ${type} temperature from:`, temp);
    return 0; // Return 0 instead of NaN for invalid temperatures
  }

  private static isValidTemperature(temp: number): boolean {
    return typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150; // More reasonable temperature range
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    const hasValidCurrent = this.isValidTemperature(temperatures.current);
    const hasValidHigh = this.isValidTemperature(temperatures.high);
    const hasValidLow = this.isValidTemperature(temperatures.low);

    // We need at least one valid temperature to display
    const hasAnyValidTemp = hasValidCurrent || hasValidHigh || hasValidLow;

    console.log('🌡️ TemperatureExtractor.hasDisplayableTemperatureData:', {
      temperatures,
      hasValidCurrent,
      hasValidHigh,
      hasValidLow,
      hasAnyValidTemp
    });

    return hasAnyValidTemp;
  }
}
