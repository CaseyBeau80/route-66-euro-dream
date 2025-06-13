
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures ENHANCED DEBUG:', {
      cityName,
      rawWeatherInput: weather,
      weatherKeys: Object.keys(weather),
      temperatureField: weather.temperature,
      highTempField: weather.highTemp,
      lowTempField: weather.lowTemp,
      mainField: weather.main,
      tempField: weather.temp
    });

    // Extract individual temperature values with enhanced logic
    const current = this.extractSingleTemperature(weather.temperature, 'current', weather);
    const high = this.extractSingleTemperature(weather.highTemp, 'high', weather);
    const low = this.extractSingleTemperature(weather.lowTemp, 'low', weather);

    console.log('🌡️ TemperatureExtractor extracted raw values:', {
      cityName,
      current,
      high,
      low,
      currentValid: this.isValidTemperature(current),
      highValid: this.isValidTemperature(high),
      lowValid: this.isValidTemperature(low)
    });

    // Try alternative extraction methods if primary fields are empty
    let finalCurrent = current;
    let finalHigh = high;
    let finalLow = low;

    // If we don't have valid temperatures, try extracting from nested structures
    if (!this.isValidTemperature(finalCurrent) && !this.isValidTemperature(finalHigh) && !this.isValidTemperature(finalLow)) {
      console.log('🔍 TemperatureExtractor: Trying alternative extraction methods...');
      
      // Try main.temp structure (OpenWeatherMap current weather)
      if (weather.main) {
        console.log('🔍 Trying main object extraction:', weather.main);
        if (weather.main.temp && this.isValidTemperature(weather.main.temp)) {
          finalCurrent = Math.round(weather.main.temp);
        }
        if (weather.main.temp_max && this.isValidTemperature(weather.main.temp_max)) {
          finalHigh = Math.round(weather.main.temp_max);
        }
        if (weather.main.temp_min && this.isValidTemperature(weather.main.temp_min)) {
          finalLow = Math.round(weather.main.temp_min);
        }
      }

      // Try temp object structure (OpenWeatherMap forecast)
      if (weather.temp && typeof weather.temp === 'object') {
        console.log('🔍 Trying temp object extraction:', weather.temp);
        if (weather.temp.day && this.isValidTemperature(weather.temp.day)) {
          finalCurrent = Math.round(weather.temp.day);
        }
        if (weather.temp.max && this.isValidTemperature(weather.temp.max)) {
          finalHigh = Math.round(weather.temp.max);
        }
        if (weather.temp.min && this.isValidTemperature(weather.temp.min)) {
          finalLow = Math.round(weather.temp.min);
        }
      }

      // Try direct temperature field
      if (weather.temperature && this.isValidTemperature(weather.temperature)) {
        finalCurrent = Math.round(weather.temperature);
      }
    }

    // If we have high/low but not current, calculate current as average
    if (!this.isValidTemperature(finalCurrent) && this.isValidTemperature(finalHigh) && this.isValidTemperature(finalLow)) {
      finalCurrent = Math.round((finalHigh + finalLow) / 2);
      console.log('🌡️ TemperatureExtractor calculated current from high/low:', finalCurrent);
    }

    // If we have current but not high/low, estimate them
    if (this.isValidTemperature(finalCurrent)) {
      if (!this.isValidTemperature(finalHigh)) {
        finalHigh = finalCurrent + 8; // Estimate high temp
      }
      if (!this.isValidTemperature(finalLow)) {
        finalLow = finalCurrent - 8; // Estimate low temp
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

    console.log('🌡️ TemperatureExtractor FINAL RESULT:', result);
    return result;
  }

  private static extractSingleTemperature(temp: any, type: string, fullWeatherObject?: any): number {
    console.log(`🌡️ TemperatureExtractor.extractSingleTemperature [${type}]:`, {
      temp,
      type: typeof temp,
      isNumber: typeof temp === 'number',
      isObject: typeof temp === 'object',
      isString: typeof temp === 'string',
      fullWeatherKeys: fullWeatherObject ? Object.keys(fullWeatherObject) : 'no-full-object'
    });

    // Handle direct numbers
    if (typeof temp === 'number' && !isNaN(temp) && temp !== 0) {
      const rounded = Math.round(temp);
      console.log(`✅ TemperatureExtractor: Direct number extraction [${type}]:`, rounded);
      return rounded;
    }

    // Handle string numbers
    if (typeof temp === 'string' && temp.trim() !== '') {
      const parsed = parseFloat(temp);
      if (!isNaN(parsed) && parsed !== 0) {
        const rounded = Math.round(parsed);
        console.log(`✅ TemperatureExtractor: String number extraction [${type}]:`, rounded);
        return rounded;
      }
    }

    // Handle object format like { high: 75, low: 65 }
    if (temp && typeof temp === 'object') {
      console.log(`🔍 TemperatureExtractor: Object extraction [${type}]:`, temp);
      if ('high' in temp && typeof temp.high === 'number' && !isNaN(temp.high)) {
        return Math.round(temp.high);
      }
      if ('low' in temp && typeof temp.low === 'number' && !isNaN(temp.low)) {
        return Math.round(temp.low);
      }
      if ('temp' in temp && typeof temp.temp === 'number' && !isNaN(temp.temp)) {
        return Math.round(temp.temp);
      }
      if ('day' in temp && typeof temp.day === 'number' && !isNaN(temp.day)) {
        return Math.round(temp.day);
      }
    }

    console.warn(`❌ TemperatureExtractor: Could not extract ${type} temperature from:`, temp);
    return NaN; // Return NaN instead of 0 to indicate invalid data
  }

  private static isValidTemperature(temp: number): boolean {
    return typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150; // Reasonable temperature range
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
