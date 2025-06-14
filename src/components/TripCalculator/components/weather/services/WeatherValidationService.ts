import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherValidationService {
  /**
   * Ensures live weather data has the correct properties set
   */
  static ensureLiveWeatherMarking(weather: ForecastWeatherData): ForecastWeatherData {
    // If this is already marked as live forecast from API, ensure proper marking
    if (weather.source === 'live_forecast' || weather.isActualForecast === true) {
      console.log('🔧 WeatherValidationService: Ensuring live weather is properly marked:', {
        cityName: weather.cityName,
        originalSource: weather.source,
        originalIsActualForecast: weather.isActualForecast
      });

      return {
        ...weather,
        source: 'live_forecast' as const,
        isActualForecast: true
      };
    }

    // Return unchanged if not live weather
    return weather;
  }

  /**
   * Validates weather data structure
   */
  static validateWeatherData(weather: ForecastWeatherData): boolean {
    const hasRequiredFields = !!(
      weather.temperature &&
      weather.description &&
      weather.cityName &&
      weather.source
    );

    const hasReasonableTemperature = weather.temperature >= -50 && weather.temperature <= 150;

    console.log('🔧 WeatherValidationService: Validating weather data:', {
      cityName: weather.cityName,
      hasRequiredFields,
      hasReasonableTemperature,
      temperature: weather.temperature,
      source: weather.source
    });

    return hasRequiredFields && hasReasonableTemperature;
  }

  /**
   * Determines if weather data should be considered live based on multiple factors
   */
  static isLiveWeatherData(weather: ForecastWeatherData): boolean {
    const primaryCheck = weather.source === 'live_forecast' && weather.isActualForecast === true;
    const hasValidData = this.validateWeatherData(weather);
    
    const result = primaryCheck && hasValidData;
    
    console.log('🔧 WeatherValidationService: Live weather determination:', {
      cityName: weather.cityName,
      primaryCheck,
      hasValidData,
      finalResult: result,
      source: weather.source,
      isActualForecast: weather.isActualForecast
    });

    return result;
  }
}
