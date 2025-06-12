
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    console.log('🔍 WeatherDataValidator ULTRA-PERMISSIVE for', city, 'on', dateString, ':', data);

    // ULTRA-PERMISSIVE: Accept ANY non-null weather data object
    const isValid = !!data && typeof data === 'object';
    
    console.log('✅ ULTRA-PERMISSIVE VALIDATION for', city, ':', {
      isValid,
      hasData: !!data,
      isObject: typeof data === 'object',
      willRender: isValid
    });

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    console.log('🔍 validateLiveForecastData - ULTRA-PERMISSIVE');
    
    // Accept any non-null data object
    const isValid = !!data && typeof data === 'object';
    
    console.log('✅ LIVE FORECAST VALIDATION (ULTRA-PERMISSIVE):', {
      isValid,
      hasData: !!data,
      isObject: typeof data === 'object'
    });
    
    return isValid;
  }
}
