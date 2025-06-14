
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherValidationService {
  /**
   * Validate that weather data is properly formatted for live forecast
   */
  static validateLiveWeatherData(weather: ForecastWeatherData): {
    isValid: boolean;
    issues: string[];
    correctedWeather?: ForecastWeatherData;
  } {
    const issues: string[] = [];
    
    // Check critical live weather properties
    if (weather.source !== 'live_forecast') {
      issues.push(`Source should be 'live_forecast' but is '${weather.source}'`);
    }
    
    if (weather.isActualForecast !== true) {
      issues.push(`isActualForecast should be true but is ${weather.isActualForecast}`);
    }
    
    if (!weather.temperature || weather.temperature <= -100 || weather.temperature >= 200) {
      issues.push(`Invalid temperature: ${weather.temperature}`);
    }
    
    console.log('🔍 WeatherValidationService: Validation result:', {
      cityName: weather.cityName,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      issues,
      isValid: issues.length === 0
    });
    
    return {
      isValid: issues.length === 0,
      issues,
      correctedWeather: issues.length === 0 ? undefined : {
        ...weather,
        source: 'live_forecast' as const,
        isActualForecast: true
      }
    };
  }

  /**
   * Ensure weather data is properly marked as live forecast
   */
  static ensureLiveWeatherMarking(weather: ForecastWeatherData): ForecastWeatherData {
    const validation = this.validateLiveWeatherData(weather);
    
    if (!validation.isValid && validation.correctedWeather) {
      console.log('🔧 WeatherValidationService: Correcting weather data marking:', {
        before: { source: weather.source, isActualForecast: weather.isActualForecast },
        after: { source: validation.correctedWeather.source, isActualForecast: validation.correctedWeather.isActualForecast }
      });
      return validation.correctedWeather;
    }
    
    return weather;
  }
}
