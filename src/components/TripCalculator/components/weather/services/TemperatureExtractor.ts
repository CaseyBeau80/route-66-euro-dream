
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures FIXED VERSION:', {
      cityName,
      rawWeatherInput: weather,
      availableProperties: Object.keys(weather || {}),
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      matchedForecastDay: weather?.matchedForecastDay
    });

    if (!weather) {
      console.warn('❌ TemperatureExtractor: No weather data provided');
      return {
        current: NaN,
        high: NaN,
        low: NaN,
        isValid: false
      };
    }

    // Try multiple extraction paths using only available properties
    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Path 1: Direct properties (normalized data)
    if (weather.temperature !== undefined) {
      current = this.extractSingleTemperature(weather.temperature, 'current-direct');
    }
    if (weather.highTemp !== undefined) {
      high = this.extractSingleTemperature(weather.highTemp, 'high-direct');
    }
    if (weather.lowTemp !== undefined) {
      low = this.extractSingleTemperature(weather.lowTemp, 'low-direct');
    }

    // Path 2: If we have a matchedForecastDay, try extracting from it
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      console.log('🌡️ TemperatureExtractor: Trying matchedForecastDay extraction', weather.matchedForecastDay);
      const matched = weather.matchedForecastDay;
      
      if (matched.temperature && typeof matched.temperature === 'object') {
        if (isNaN(high) && 'high' in matched.temperature) {
          high = this.extractSingleTemperature(matched.temperature.high, 'high-matched');
        }
        if (isNaN(low) && 'low' in matched.temperature) {
          low = this.extractSingleTemperature(matched.temperature.low, 'low-matched');
        }
        if (isNaN(current) && 'high' in matched.temperature && 'low' in matched.temperature) {
          current = Math.round((matched.temperature.high + matched.temperature.low) / 2);
          console.log('🌡️ TemperatureExtractor: Calculated current from high/low:', current);
        }
      } else if (typeof matched.temperature === 'number') {
        if (isNaN(current)) {
          current = this.extractSingleTemperature(matched.temperature, 'current-matched');
        }
      }
    }

    console.log('🌡️ TemperatureExtractor extracted raw values:', {
      cityName,
      current,
      high,
      low,
      currentValid: this.isValidTemperature(current),
      highValid: this.isValidTemperature(high),
      lowValid: this.isValidTemperature(low)
    });

    let finalCurrent = current;
    let finalHigh = high;
    let finalLow = low;

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
    if (typeof temp === 'number' && !isNaN(temp)) {
      const rounded = Math.round(temp);
      console.log(`✅ TemperatureExtractor: Direct number extraction [${type}]:`, rounded);
      return rounded;
    }

    // Handle string numbers
    if (typeof temp === 'string' && temp.trim() !== '') {
      const parsed = parseFloat(temp);
      if (!isNaN(parsed)) {
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
      if ('max' in temp && typeof temp.max === 'number' && !isNaN(temp.max)) {
        return Math.round(temp.max);
      }
      if ('min' in temp && typeof temp.min === 'number' && !isNaN(temp.min)) {
        return Math.round(temp.min);
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
