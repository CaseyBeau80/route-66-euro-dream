
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDebugService } from './WeatherDebugService';

export class TemperatureExtractor {
  static extractTemperatures(weather: ForecastWeatherData, cityName: string): {
    current: number;
    high: number;
    low: number;
  } {
    WeatherDebugService.logWeatherFlow(`TemperatureExtractor.extract [${cityName}]`, {
      inputWeather: {
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        matchedForecastDay: weather.matchedForecastDay?.temperature
      }
    });

    let current = 65;
    let high = 75;
    let low = 55;

    // Priority 1: Use highTemp/lowTemp if available
    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      WeatherDebugService.logWeatherFlow(`TemperatureExtractor.priority1 [${cityName}]`, {
        rawHighTemp: weather.highTemp,
        rawLowTemp: weather.lowTemp
      });

      high = Math.round(weather.highTemp);
      low = Math.round(weather.lowTemp);
      current = Math.round((high + low) / 2);
    }
    // Priority 2: Use temperature field
    else if (weather.temperature !== undefined) {
      WeatherDebugService.logWeatherFlow(`TemperatureExtractor.priority2 [${cityName}]`, {
        rawTemperature: weather.temperature
      });

      current = Math.round(weather.temperature);
      high = current + 10;
      low = current - 10;
    }
    // Priority 3: Check matched forecast day
    else if (weather.matchedForecastDay?.temperature) {
      WeatherDebugService.logWeatherFlow(`TemperatureExtractor.priority3 [${cityName}]`, {
        matchedForecastTemp: weather.matchedForecastDay.temperature
      });

      const temp = weather.matchedForecastDay.temperature;
      if (typeof temp === 'object' && 'high' in temp && 'low' in temp) {
        high = Math.round(temp.high);
        low = Math.round(temp.low);
        current = Math.round((high + low) / 2);
      } else if (typeof temp === 'number') {
        current = Math.round(temp);
        high = current + 10;
        low = current - 10;
      }
    } else {
      WeatherDebugService.logWeatherFlow(`TemperatureExtractor.fallback [${cityName}]`, {
        reason: 'no_valid_temperature_data_found'
      });
    }

    const result = { current, high, low };

    WeatherDebugService.logWeatherFlow(`TemperatureExtractor.result [${cityName}]`, {
      result,
      isValid: result.current > 0 && result.high > 0 && result.low > 0
    });

    return result;
  }

  static hasDisplayableTemperatureData(temps: { current: number; high: number; low: number }): boolean {
    const isValid = temps.current > 0 && temps.high > 0 && temps.low > 0;
    
    WeatherDebugService.logWeatherFlow('TemperatureExtractor.validation', {
      temps,
      validationResult: isValid,
      checks: {
        currentValid: temps.current > 0,
        highValid: temps.high > 0,
        lowValid: temps.low > 0
      }
    });

    return isValid;
  }
}
