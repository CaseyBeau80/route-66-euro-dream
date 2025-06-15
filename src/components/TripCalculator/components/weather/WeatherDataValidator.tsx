
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  validationErrors: string[];
  normalizedWeather: ForecastWeatherData;
}

export class WeatherDataValidator {
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const errors: string[] = [];
    
    // Validate basic structure
    if (!weather) {
      errors.push('Weather data is null/undefined');
      return {
        isValid: false,
        isLiveForecast: false,
        validationErrors: errors,
        normalizedWeather: weather
      };
    }

    // Validate temperature data
    if (typeof weather.temperature !== 'number' || weather.temperature < -100 || weather.temperature > 150) {
      errors.push(`Invalid temperature: ${weather.temperature}`);
    }

    // CRITICAL FIX: Validate date range first before trusting source flags
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedSegmentDate = new Date(segmentDate.getFullYear(), segmentDate.getMonth(), segmentDate.getDate());
    const daysFromToday = Math.ceil((normalizedSegmentDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
    
    // Only dates within 0-5 days can be truly live forecasts
    const isWithinLiveRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    const originalSource = weather.source;
    const originalIsActualForecast = weather.isActualForecast;
    
    // FIXED: True live forecast requires BOTH proper source AND being within forecast range
    const isActuallyLive = originalSource === 'live_forecast' && 
                          originalIsActualForecast === true && 
                          isWithinLiveRange;

    console.log('🔧 FIXED: WeatherDataValidator with date range validation:', {
      cityName,
      segmentDate: segmentDate.toLocaleDateString(),
      daysFromToday,
      isWithinLiveRange,
      originalSource,
      originalIsActualForecast,
      isActuallyLive,
      shouldShowAsLive: isActuallyLive ? 'YES_GREEN' : 'NO_AMBER',
      validationLogic: 'source_AND_date_range_required'
    });

    // CRITICAL FIX: Override source for dates outside live range
    let finalSource = originalSource;
    let finalIsActualForecast = originalIsActualForecast;
    
    if (!isWithinLiveRange && originalSource === 'live_forecast') {
      console.log('🔧 OVERRIDE: Date outside live range, forcing historical fallback display');
      finalSource = 'historical_fallback';
      finalIsActualForecast = false;
    }

    // Create normalized weather data with corrected source
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      source: finalSource,
      isActualForecast: finalIsActualForecast
    };

    console.log('🔧 FIXED: WeatherDataValidator final result:', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast: isActuallyLive,
      daysFromToday,
      originalData: {
        source: originalSource,
        isActualForecast: originalIsActualForecast
      },
      finalData: {
        source: finalSource,
        isActualForecast: finalIsActualForecast
      },
      shouldDisplayGreen: isActuallyLive,
      dateRangeValidation: true
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast: isActuallyLive,
      validationErrors: errors,
      normalizedWeather
    };
  }
}
