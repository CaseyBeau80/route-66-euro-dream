
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    const validationResult = {
      hasTemperature: !!(data.temperature || data.highTemp || data.lowTemp),
      hasDescription: !!data.description,
      hasValidDateMatch: !!data.dateMatchInfo,
      isActualForecast: data.isActualForecast
    };

    const isValid = validationResult.hasTemperature && validationResult.hasDescription;
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherDataValidator.validateWeatherData [${city}]`,
      { dateString, validationResult, isValid }
    );

    return isValid;
  }
}
