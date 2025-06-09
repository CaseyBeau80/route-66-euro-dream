
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherValidationResult {
  isValid: boolean;
  hasActualForecast: boolean;
  hasTemperatureRange: boolean;
  hasMatchedForecast: boolean;
  daysFromNow: number | null;
  isWithinForecastRange: boolean;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable';
  warnings: string[];
}

export type WeatherDisplayType = 
  | 'live-forecast' 
  | 'seasonal-estimate' 
  | 'service-unavailable' 
  | 'loading';

export const validateWeatherData = (
  weather: any, 
  cityName: string
): WeatherValidationResult => {
  console.log(`🔍 WeatherValidationService: Validating weather for ${cityName}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasDateMatchInfo: !!weather?.dateMatchInfo,
    matchType: weather?.dateMatchInfo?.matchType,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
    daysOffset: weather?.dateMatchInfo?.daysOffset
  });

  const warnings: string[] = [];

  if (!weather) {
    return {
      isValid: false,
      hasActualForecast: false,
      hasTemperatureRange: false,
      hasMatchedForecast: false,
      daysFromNow: null,
      isWithinForecastRange: false,
      dataQuality: 'unavailable',
      warnings: ['No weather data available']
    };
  }

  const hasActualForecast = weather.isActualForecast === true;
  const hasTemperatureRange = weather.highTemp !== undefined && weather.lowTemp !== undefined;
  const hasMatchedForecast = weather.matchedForecastDay !== undefined;
  
  // Calculate days from now using dateMatchInfo if available
  let daysFromNow: number | null = null;
  if (weather.dateMatchInfo?.daysOffset !== undefined) {
    daysFromNow = weather.dateMatchInfo.daysOffset;
  }

  // Enhanced forecast range validation - now supports 5 days
  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;

  console.log(`📊 WeatherValidationService: Analysis for ${cityName}:`, {
    hasActualForecast,
    hasTemperatureRange,
    hasMatchedForecast,
    daysFromNow,
    isWithinForecastRange,
    matchType: weather.dateMatchInfo?.matchType
  });

  // Quality assessment with enhanced 5-day range
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'unavailable';
  
  if (hasActualForecast && isWithinForecastRange) {
    if (weather.dateMatchInfo?.matchType === 'exact' && hasTemperatureRange) {
      dataQuality = 'excellent';
    } else if (weather.dateMatchInfo?.matchType === 'closest' && hasTemperatureRange) {
      dataQuality = 'good';
      warnings.push(`Date match is approximate (${weather.dateMatchInfo.daysOffset} days offset)`);
    } else {
      dataQuality = 'fair';
      warnings.push('Forecast data incomplete');
    }
  } else if (!isWithinForecastRange && daysFromNow !== null) {
    dataQuality = 'poor';
    warnings.push(`Date beyond 5-day forecast range (${daysFromNow} days ahead)`);
  } else {
    dataQuality = 'unavailable';
    warnings.push('Weather service unavailable');
  }

  const result = {
    isValid: dataQuality !== 'unavailable',
    hasActualForecast,
    hasTemperatureRange,
    hasMatchedForecast,
    daysFromNow,
    isWithinForecastRange,
    dataQuality,
    warnings
  };

  console.log(`✅ WeatherValidationService: Final validation for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number
): WeatherDisplayType => {
  console.log(`🎯 WeatherValidationService: Determining display type:`, {
    validation,
    error,
    retryCount
  });

  // Handle error states first
  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  // Handle loading state
  if (!validation.isValid && validation.dataQuality === 'unavailable' && !error) {
    return 'loading';
  }

  // Enhanced logic for 5-day forecast range
  if (validation.hasActualForecast && validation.isWithinForecastRange) {
    console.log(`🌤️ Live forecast available within 5-day range`);
    return 'live-forecast';
  }

  // For dates beyond 5-day range or when actual forecast is not available
  if (validation.daysFromNow !== null && validation.daysFromNow > 5) {
    console.log(`📊 Using seasonal estimate for date beyond 5-day range (${validation.daysFromNow} days)`);
    return 'seasonal-estimate';
  }

  // Default to seasonal estimate for other cases
  console.log(`📊 Using seasonal estimate as fallback`);
  return 'seasonal-estimate';
};
