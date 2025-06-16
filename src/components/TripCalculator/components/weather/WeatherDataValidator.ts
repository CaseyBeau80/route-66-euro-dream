
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
   * FIXED: Validate weather data using UnifiedWeatherValidator and APPLY the validation results
   */
  static validateWeatherData(
    weather: any,
    cityName: string,
    segmentDate?: Date | null
  ): WeatherValidationResult {
    console.log('🔍 FIXED: WeatherDataValidator applying unified validation consistently for', cityName, {
      hasWeather: !!weather,
      hasSegmentDate: !!segmentDate,
      segmentDate: segmentDate?.toLocaleDateString(),
      originalSource: weather?.source,
      originalIsActualForecast: weather?.isActualForecast,
      fixedImplementation: 'APPLIES_UNIFIED_VALIDATION_RESULTS'
    });

    // FIXED: Use unified validation with REQUIRED segment date
    const validation = UnifiedWeatherValidator.validateWeatherData(weather, segmentDate || undefined);

    // Check if we have displayable data
    const hasTemperatureData = !!(weather?.temperature || weather?.highTemp || weather?.lowTemp);
    const hasDescription = !!weather?.description;
    const canDisplay = hasTemperatureData || hasDescription;

    // CRITICAL FIX: Apply the validation results to the normalized weather data
    // Do NOT preserve original conflicting source values
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
      // CRITICAL FIX: Apply unified validation results instead of preserving original values
      isActualForecast: validation.isLiveForecast,
      source: validation.source as 'live_forecast' | 'historical_fallback'
    };

    console.log('✅ FIXED: WeatherDataValidator APPLIED unified validation results for', cityName, {
      originalData: {
        source: weather?.source,
        isActualForecast: weather?.isActualForecast
      },
      validationResults: {
        isLiveForecast: validation.isLiveForecast,
        source: validation.source,
        dateBasedDecision: validation.dateBasedDecision,
        daysFromToday: validation.daysFromToday
      },
      normalizedData: {
        source: normalizedWeather.source,
        isActualForecast: normalizedWeather.isActualForecast
      },
      consistencyFixed: true
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
