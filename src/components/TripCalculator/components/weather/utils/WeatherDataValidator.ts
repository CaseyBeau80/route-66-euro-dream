
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    console.log('🔍 WeatherDataValidator for', city, 'on', dateString, ':', data);

    // ULTRA-PERMISSIVE: Accept ANY weather data object
    const isValid = !!data;
    
    console.log('✅ ULTRA-PERMISSIVE VALIDATION for', city, ':', {
      isValid,
      hasData: !!data,
      willRender: isValid
    });

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    console.log('🔍 validateLiveForecastData - ULTRA-PERMISSIVE');
    
    // Accept any data object
    const isValid = !!data;
    
    console.log('✅ LIVE FORECAST VALIDATION (ULTRA-PERMISSIVE):', {
      isValid,
      hasData: !!data
    });
    
    return isValid;
  }
}
