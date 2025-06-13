
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
    console.log('🌡️ TemperatureExtractor.extractTemperatures FOR SHARED VIEW:', {
      cityName,
      rawWeatherInput: weather,
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

    let current = NaN;
    let high = NaN;
    let low = NaN;

    // Path 1: Direct properties (normalized data) - PRIORITIZE HIGH/LOW for shared views
    if (weather.highTemp !== undefined && weather.highTemp !== null) {
      high = this.extractSingleTemperature(weather.highTemp, 'high-direct');
    }
    if (weather.lowTemp !== undefined && weather.lowTemp !== null) {
      low = this.extractSingleTemperature(weather.lowTemp, 'low-direct');
    }
    if (weather.temperature !== undefined && weather.temperature !== null) {
      current = this.extractSingleTemperature(weather.temperature, 'current-direct');
    }

    console.log('🌡️ TemperatureExtractor: Direct extraction results:', {
      cityName,
      current,
      high,
      low,
      directHighTemp: weather.highTemp,
      directLowTemp: weather.lowTemp,
      directTemp: weather.temperature
    });

    // Path 2: matchedForecastDay extraction
    if ((isNaN(current) || isNaN(high) || isNaN(low)) && weather.matchedForecastDay) {
      const matched = weather.matchedForecastDay;
      
      if (matched.temperature && typeof matched.temperature === 'object') {
        if (isNaN(high) && 'high' in matched.temperature) {
          high = this.extractSingleTemperature(matched.temperature.high, 'high-matched');
        }
        if (isNaN(low) && 'low' in matched.temperature) {
          low = this.extractSingleTemperature(matched.temperature.low, 'low-matched');
        }
      } else if (typeof matched.temperature === 'number' && isNaN(current)) {
        current = this.extractSingleTemperature(matched.temperature, 'current-matched');
      }

      // Try main object in matched day
      if (matched.main && typeof matched.main === 'object') {
        if (isNaN(current) && 'temp' in matched.main) {
          current = this.extractSingleTemperature(matched.main.temp, 'current-main');
        }
        if (isNaN(high) && 'temp_max' in matched.main) {
          high = this.extractSingleTemperature(matched.main.temp_max, 'high-main');
        }
        if (isNaN(low) && 'temp_min' in matched.main) {
          low = this.extractSingleTemperature(matched.main.temp_min, 'low-main');
        }
      }
    }

    console.log('🌡️ TemperatureExtractor: After matched day extraction:', {
      cityName,
      current,
      high,
      low
    });

    // Smart fallbacks - prioritize creating ranges for shared views
    let finalCurrent = current;
    let finalHigh = high;
    let finalLow = low;

    // If we have current but not high/low, estimate them
    if (this.isValidTemperature(finalCurrent) && (!this.isValidTemperature(finalHigh) || !this.isValidTemperature(finalLow))) {
      if (!this.isValidTemperature(finalHigh)) {
        finalHigh = finalCurrent + 5; // Conservative estimate
      }
      if (!this.isValidTemperature(finalLow)) {
        finalLow = finalCurrent - 5; // Conservative estimate
      }
      console.log('🌡️ TemperatureExtractor: Estimated range from current temp:', {
        cityName,
        currentTemp: finalCurrent,
        estimatedHigh: finalHigh,
        estimatedLow: finalLow
      });
    }

    // If we have high/low but not current, calculate current as average
    if (!this.isValidTemperature(finalCurrent) && this.isValidTemperature(finalHigh) && this.isValidTemperature(finalLow)) {
      finalCurrent = Math.round((finalHigh + finalLow) / 2);
      console.log('🌡️ TemperatureExtractor: Calculated current from high/low:', finalCurrent);
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

    console.log('🌡️ TemperatureExtractor FINAL RESULT FOR SHARED VIEW:', {
      cityName,
      result,
      hasValidRange: !isNaN(result.high) || !isNaN(result.low)
    });
    
    return result;
  }

  private static extractSingleTemperature(temp: any, type: string): number {
    console.log(`🌡️ TemperatureExtractor.extractSingleTemperature [${type}]:`, {
      temp,
      type: typeof temp
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

    console.warn(`❌ TemperatureExtractor: Could not extract ${type} temperature from:`, temp);
    return NaN;
  }

  private static isValidTemperature(temp: number): boolean {
    return typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150;
  }

  static hasDisplayableTemperatureData(temperatures: ExtractedTemperatures): boolean {
    const hasValidCurrent = this.isValidTemperature(temperatures.current);
    const hasValidHigh = this.isValidTemperature(temperatures.high);
    const hasValidLow = this.isValidTemperature(temperatures.low);

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
