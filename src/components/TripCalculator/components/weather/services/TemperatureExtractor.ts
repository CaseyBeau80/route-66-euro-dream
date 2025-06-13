
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
      cityNameField: weather.cityName,
      descriptionField: weather.description
    });

    // Extract individual temperature values from the normalized ForecastWeatherData
    const current = this.extractSingleTemperature(weather.temperature, 'current');
    const high = this.extractSingleTemperature(weather.highTemp, 'high');
    const low = this.extractSingleTemperature(weather.lowTemp, 'low');

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

    // If we don't have valid temperatures, try fallback logic
    if (!this.isValidTemperature(finalCurrent) && !this.isValidTemperature(finalHigh) && !this.isValidTemperature(finalLow)) {
      console.log('🔍 TemperatureExtractor: No valid temperatures found, checking for fallback data...');
      
      // For ForecastWeatherData, the temperature fields should already be normalized
      // So if they're not valid, we don't have usable data
      console.warn('⚠️ TemperatureExtractor: No valid temperature data available in ForecastWeatherData');
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

  private static extractSingleTemperature(temp: any, type: string): number {
    console.log(`🌡️ TemperatureExtractor.extractSingleTemperature [${type}]:`, {
      temp,
      type: typeof temp,
      isNumber: typeof temp === 'number',
      isString: typeof temp === 'string'
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
