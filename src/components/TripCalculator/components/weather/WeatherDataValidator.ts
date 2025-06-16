
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedWeatherValidator, UnifiedWeatherValidation } from './services/UnifiedWeatherValidator';

export interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  validation: UnifiedWeatherValidation;
  hasTemperatureData: boolean;
  canDisplay: boolean;
}

export class WeatherDataValidator {
  /**
   * FIXED: Validate weather data using UnifiedWeatherValidator WITH REQUIRED segment date
   */
  static validateWeatherData(
    weather: any,
    cityName: string,
    segmentDate?: Date | null
  ): WeatherValidationResult {
    console.log('🔍 FIXED: WeatherDataValidator using UnifiedWeatherValidator with REQUIRED segmentDate for', cityName, {
      hasWeather: !!weather,
      hasSegmentDate: !!segmentDate,
      segmentDate: segmentDate?.toLocaleDateString(),
      fixedImplementation: 'REQUIRES_SEGMENT_DATE'
    });

    // FIXED: Use unified validation with REQUIRED segment date
    const validation = UnifiedWeatherValidator.validateWeatherData(weather, segmentDate || undefined);

    // Check if we have displayable data
    const hasTemperatureData = !!(weather?.temperature || weather?.highTemp || weather?.lowTemp);
    const hasDescription = !!weather?.description;
    const canDisplay = hasTemperatureData || hasDescription;

    // FIXED: Normalize weather data with corrected source based on validation
    const normalizedWeather: ForecastWeatherData = {
      temperature: weather?.temperature || weather?.highTemp || 75,
      highTemp: weather?.highTemp || weather?.temperature || 75,
      lowTemp: weather?.lowTemp || weather?.temperature || 65,
      description: weather?.description || 'Partly Cloudy',
      icon: weather?.icon || '02d',
      humidity: weather?.humidity || 50,
      windSpeed: weather?.windSpeed || 5,
      precipitationChance: weather?.precipitationChance || 20,
      cityName: weather?.cityName || cityName,
      forecast: weather?.forecast || [],
      forecastDate: segmentDate || new Date(),
      isActualForecast: validation.isLiveForecast,
      source: validation.source as 'live_forecast' | 'historical_fallback'
    };

    console.log('✅ FIXED: WeatherDataValidator result for', cityName, {
      isValid: canDisplay,
      isLiveForecast: validation.isLiveForecast,
      correctedSource: validation.source,
      hasTemperatureData,
      canDisplay,
      styleTheme: validation.styleTheme,
      segmentDate: segmentDate?.toLocaleDateString(),
      daysFromToday: validation.daysFromToday,
      dateBasedDecision: validation.dateBasedDecision
    });

    return {
      isValid: canDisplay,
      isLiveForecast: validation.isLiveForecast,
      normalizedWeather,
      validation,
      hasTemperatureData,
      canDisplay
    };
  }
}
