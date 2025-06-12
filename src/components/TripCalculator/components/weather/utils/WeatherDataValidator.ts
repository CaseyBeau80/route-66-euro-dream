
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    console.log('🔍 ENHANCED WeatherDataValidator for', city, 'on', dateString);

    // ULTRA-PERMISSIVE: Accept ANY weather data that has basic information
    const validationChecks = {
      hasTemperature: !!(data.temperature || data.highTemp || data.lowTemp),
      hasDescription: !!data.description,
      hasValidDateMatch: !!data.dateMatchInfo,
      isActualForecast: data.isActualForecast,
      hasAnyDisplayableData: !!(data.temperature || data.highTemp || data.lowTemp || data.description)
    };

    console.log('🔧 VALIDATION CHECKS for', city, ':', validationChecks);

    // Log specific field values that user requested
    console.log('📊 REQUESTED FIELD VALUES for', city, ':', {
      'weather.isActualForecast': data.isActualForecast,
      'weather.highTemp': data.highTemp,
      'weather.lowTemp': data.lowTemp,
      'weather.temperature': data.temperature,
      'weather.description': data.description,
      'weather.dateMatchInfo.source': data.dateMatchInfo?.source
    });

    // ULTRA-PERMISSIVE: Accept if we have ANY displayable data
    const isValid = validationChecks.hasAnyDisplayableData;
    
    console.log('✅ ULTRA-PERMISSIVE VALIDATION RESULT for', city, ':', {
      isValid,
      reason: isValid ? 'Has displayable data' : 'No displayable data found',
      willRender: isValid
    });

    WeatherDataDebugger.debugWeatherFlow(
      `WeatherDataValidator.validateWeatherData [${city}] - ULTRA-PERMISSIVE`,
      { 
        dateString, 
        validationChecks, 
        isValid,
        fieldValues: {
          temperature: data.temperature,
          highTemp: data.highTemp,
          lowTemp: data.lowTemp,
          description: data.description,
          isActualForecast: data.isActualForecast,
          dateMatchSource: data.dateMatchInfo?.source
        }
      }
    );

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    console.log('🔍 ENHANCED validateLiveForecastData');
    
    // ULTRA-PERMISSIVE: Accept any data with temperature or description
    const hasBasicData = !!(data.temperature || data.highTemp || data.lowTemp || data.description);
    
    console.log('✅ LIVE FORECAST VALIDATION (ULTRA-PERMISSIVE):', {
      hasBasicData,
      isActualForecast: data.isActualForecast,
      temperature: data.temperature,
      highTemp: data.highTemp,
      lowTemp: data.lowTemp,
      description: data.description,
      willAccept: hasBasicData
    });
    
    return hasBasicData;
  }
}
