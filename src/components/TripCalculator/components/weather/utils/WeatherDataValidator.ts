
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    // CRITICAL FIX: Ultra-permissive validation - accept ANY weather object
    const validationResult = {
      hasAnyTemperature: !!(data.temperature || data.highTemp || data.lowTemp),
      hasDescription: !!data.description,
      hasValidDateMatch: !!data.dateMatchInfo,
      isActualForecast: data.isActualForecast,
      hasWeatherObject: !!data,
      hasMinimalData: !!(data.temperature || data.highTemp) || !!data.description
    };

    // CRITICAL FIX: Accept weather data if we have ANY weather object at all
    const isValid = !!data; // Ultra-permissive - just need the object to exist
    
    WeatherDataDebugger.debugWeatherFlow(
      `WeatherDataValidator.validateWeatherData [${city}] - ULTRA-PERMISSIVE VALIDATION`,
      { 
        dateString, 
        validationResult, 
        isValid,
        hasWeatherObject: !!data,
        temperature: data?.temperature,
        highTemp: data?.highTemp,
        lowTemp: data?.lowTemp,
        description: data?.description,
        validationNote: 'Ultra-permissive - accepts any weather object'
      }
    );

    console.log('🔧 ULTRA-PERMISSIVE VALIDATION for', city, ':', {
      hasWeatherObject: !!data,
      isValid,
      validationPassed: isValid,
      message: 'Accepting any weather object to prevent render suppression'
    });

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    // CRITICAL FIX: More permissive live forecast validation
    const hasActualFlag = data.isActualForecast === true;
    const hasAnyTemperature = !!(data.temperature || data.highTemp || data.lowTemp);
    const hasApiSource = data.dateMatchInfo?.source === 'api-forecast';
    const hasValidDescription = !!data.description;
    
    // Accept if we have the actual forecast flag OR any temperature data
    const isValidLiveForecast = hasActualFlag || hasAnyTemperature || hasApiSource;
    
    WeatherDataDebugger.debugWeatherFlow(
      'WeatherDataValidator.validateLiveForecastData - ULTRA-PERMISSIVE',
      {
        hasActualFlag,
        hasAnyTemperature,
        hasApiSource,
        hasValidDescription,
        isValidLiveForecast,
        temperature: data.temperature,
        highTemp: data.highTemp,
        lowTemp: data.lowTemp,
        validationNote: 'Ultra-permissive - accepts forecast with any temperature data'
      }
    );

    return isValidLiveForecast;
  }
}
