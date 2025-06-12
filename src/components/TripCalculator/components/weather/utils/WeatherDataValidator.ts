
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    // Simplified validation - just check if we have the weather object
    const isValid = !!data;
    
    console.log('🔧 SIMPLIFIED VALIDATION for', city, ':', {
      hasWeatherObject: !!data,
      isValid,
      temperature: data?.temperature,
      highTemp: data?.highTemp,
      lowTemp: data?.lowTemp
    });

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    // Simplified live forecast validation
    const isValidLiveForecast = !!data;
    
    console.log('🔧 SIMPLIFIED LIVE FORECAST VALIDATION:', {
      hasData: !!data,
      isValidLiveForecast
    });

    return isValidLiveForecast;
  }
}
