
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures ENHANCED FOR SHARED VIEWS:', {
      cityName,
      rawWeatherInput: weather,
      availableProperties: Object.keys(weather || {}),
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      matchedForecastDay: weather?.matchedForecastDay,
      isActualForecast: weather?.isActualForecast,
      source: weather?.source
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

    // Path 2: If we have a matchedForecastDay and it exists, try extracting from it
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
          const tempHigh = this.extractSingleTemperature(matched.temperature.high, 'calc-high');
          const tempLow = this.extractSingleTemperature(matched.temperature.low, 'calc-low');
          if (!isNaN(tempHigh) && !isNaN(tempLow)) {
            current = Math.round((tempHigh + tempLow) / 2);
            console.log('🌡️ TemperatureExtractor: Calculated current from high/low:', current);
          }
        }
      } else if (typeof matched.temperature === 'number') {
        if (isNaN(current)) {
          current = this.extractSingleTemperature(matched.temperature, 'current-matched');
        }
      }

      // Try extracting directly from matched day if it has main properties
      if (matched.main) {
        if (isNaN(current) && matched.main.temp) {
          current = this.extractSingleTemperature(matched.main.temp, 'current-main');
        }
        if (isNaN(high) && matched.main.temp_max) {
          high = this.extractSingleTemperature(matched.main.temp_max, 'high-main');
        }
        if (isNaN(low) && matched.main.temp_min) {
          low = this.extractSingleTemperature(matched.main.temp_min, 'low-main');
        }
      }
    }

    // Path 3: Enhanced fallback - check for common weather API response formats
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather) {
      // OpenWeatherMap current weather format
      if (weather.main) {
        if (isNaN(current) && weather.main.temp) {
          current = this.extractSingleTemperature(weather.main.temp, 'current-owm');
        }
        if (isNaN(high) && weather.main.temp_max) {
          high = this.extractSingleTemperature(weather.main.temp_max, 'high-owm');
        }
        if (isNaN(low) && weather.main.temp_min) {
          low = this.extractSingleTemperature(weather.main.temp_min, 'low-owm');
        }
      }

      // Try temp object format
      if (weather.temp) {
        if (isNaN(current) && weather.temp.day) {
          current = this.extractSingleTemperature(weather.temp.day, 'current-temp-day');
        }
        if (isNaN(high) && weather.temp.max) {
          high = this.extractSingleTemperature(weather.temp.max, 'high-temp-max');
        }
        if (isNaN(low) && weather.temp.min) {
          low = this.extractSingleTemperature(weather.temp.min, 'low-temp-min');
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

    // Enhanced smart fallbacks
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

    // If we only have one temperature value, use it for all
    if (!this.isValidTemperature(finalCurrent) && !this.isValidTemperature(finalHigh) && !this.isValidTemperature(finalLow)) {
      // Last resort: check if there's any temperature value anywhere
      const anyTemp = this.findAnyTemperature(weather);
      if (anyTemp !== null) {
        finalCurrent = anyTemp;
        finalHigh = anyTemp + 5;
        finalLow = anyTemp - 5;
        console.log('🌡️ TemperatureExtractor: Used any available temperature:', anyTemp);
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

  private static findAnyTemperature(weather: any): number | null {
    // Deep search for any temperature value in the weather object
    const searchForTemp = (obj: any, path: string = ''): number | null => {
      if (typeof obj === 'number' && !isNaN(obj) && obj > -150 && obj < 150) {
        console.log(`🌡️ Found temperature at ${path}:`, obj);
        return obj;
      }

      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          if (key.toLowerCase().includes('temp') || key.toLowerCase().includes('temperature')) {
            const temp = searchForTemp(value, `${path}.${key}`);
            if (temp !== null) return temp;
          }
        }
        
        // Search in other properties
        for (const [key, value] of Object.entries(obj)) {
          const temp = searchForTemp(value, `${path}.${key}`);
          if (temp !== null) return temp;
        }
      }

      return null;
    };

    return searchForTemp(weather);
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
      
      const possibleKeys = ['high', 'low', 'temp', 'day', 'max', 'min', 'avg', 'current'];
      for (const key of possibleKeys) {
        if (key in temp && typeof temp[key] === 'number' && !isNaN(temp[key])) {
          const rounded = Math.round(temp[key]);
          console.log(`✅ TemperatureExtractor: Object key extraction [${type}] from ${key}:`, rounded);
          return rounded;
        }
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
