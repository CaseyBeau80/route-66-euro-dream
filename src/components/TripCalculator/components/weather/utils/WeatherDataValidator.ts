
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    // FIXED: Less strict validation - accept data if we have basic weather information
    const validationResult = {
      hasTemperature: !!(data.temperature || data.highTemp || data.lowTemp),
      hasDescription: !!data.description,
      hasValidDateMatch: !!data.dateMatchInfo,
      isActualForecast: data.isActualForecast,
      hasMinimalData: !!(data.temperature || data.highTemp) && !!data.description
    };

    // FIXED: Accept weather data if we have minimal required information
    const isValid = validationResult.hasMinimalData;
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherDataValidator.validateWeatherData [${city}] - RELAXED VALIDATION`,
      { 
        dateString, 
        validationResult, 
        isValid,
        temperature: data.temperature,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp,
        description: data.description
      }
    );

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    // FIXED: More permissive live forecast validation
    const hasActualFlag = data.isActualForecast === true;
    const hasValidTemps = (
      (data.highTemp !== undefined && data.lowTemp !== undefined) ||
      (data.temperature !== undefined && data.temperature > -50 && data.temperature < 150)
    );
    const hasApiSource = data.dateMatchInfo?.source === 'api-forecast';
    const hasValidDescription = !!data.description;
    
    const isValidLiveForecast = hasActualFlag && hasValidTemps && hasApiSource && hasValidDescription;
    
    WeatherDataDebugger.debugWeatherFlow(
      'WeatherDataValidator.validateLiveForecastData - IMPROVED',
      {
        hasActualFlag,
        hasValidTemps,
        hasApiSource,
        hasValidDescription,
        isValidLiveForecast,
        temperature: data.temperature,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp
      }
    );

    return isValidLiveForecast;
  }
}
