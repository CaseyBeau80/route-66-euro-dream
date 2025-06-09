
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
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 WeatherValidationService: Enhanced validation for ${cityName}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasDateMatchInfo: !!weather?.dateMatchInfo,
    matchType: weather?.dateMatchInfo?.matchType,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
    daysOffset: weather?.dateMatchInfo?.daysOffset,
    hasTemperatureInWeather: weather?.temperature !== undefined,
    hasForecastArray: !!weather?.forecast?.length,
    segmentDate: segmentDate?.toISOString()
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
  
  // Enhanced temperature range validation - check multiple sources
  const hasTemperatureRange = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined) ||
    (weather.temperature !== undefined) ||
    (weather.forecast && weather.forecast.length > 0)
  );
  
  const hasMatchedForecast = weather.matchedForecastDay !== undefined || 
                            (weather.forecast && weather.forecast.length > 0);
  
  // **PHASE 1 FIX**: Enhanced days calculation with bulletproof fallback methods
  let daysFromNow: number | null = null;
  
  if (weather.dateMatchInfo?.daysOffset !== undefined) {
    daysFromNow = weather.dateMatchInfo.daysOffset;
    console.log(`📅 Using dateMatchInfo.daysOffset: ${daysFromNow}`);
  } else if (weather.forecastDate) {
    // Fallback: calculate from forecast date
    const forecastDate = new Date(weather.forecastDate);
    const now = new Date();
    daysFromNow = Math.ceil((forecastDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    console.log(`📅 Calculated daysFromNow from forecastDate: ${daysFromNow}`);
  } else if (segmentDate) {
    // **NEW FALLBACK**: Calculate from segmentDate parameter
    const now = new Date();
    daysFromNow = Math.ceil((segmentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    console.log(`📅 Calculated daysFromNow from segmentDate parameter: ${daysFromNow}`);
    warnings.push('Date calculated from segment date (dateMatchInfo missing)');
  } else {
    console.log(`⚠️ No date information available for ${cityName}`);
  }

  // Enhanced forecast range validation - now supports 5 days
  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;

  console.log(`📊 Enhanced analysis for ${cityName}:`, {
    hasActualForecast,
    hasTemperatureRange,
    hasMatchedForecast,
    daysFromNow,
    isWithinForecastRange,
    matchType: weather.dateMatchInfo?.matchType || 'no-match-info'
  });

  // **PHASE 1 FIX**: Bulletproof quality assessment - prioritize actual forecast data
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'unavailable';
  
  // **CRITICAL FIX**: Accept as valid if it's actual forecast data, even without perfect dateMatchInfo
  if (hasActualForecast && hasTemperatureRange) {
    if (weather.dateMatchInfo?.matchType === 'exact') {
      dataQuality = 'excellent';
    } else if (weather.dateMatchInfo?.matchType === 'closest') {
      dataQuality = 'good';
      warnings.push(`Date match is approximate (${weather.dateMatchInfo.daysOffset} days offset)`);
    } else if (isWithinForecastRange) {
      // **NEW**: Even without dateMatchInfo, if we have actual forecast within range, it's good
      dataQuality = 'good';
      warnings.push('Live forecast data available (dateMatchInfo incomplete)');
    } else if (daysFromNow !== null && daysFromNow > 5) {
      dataQuality = 'poor';
      warnings.push(`Date beyond 5-day forecast range (${daysFromNow} days ahead)`);
    } else {
      dataQuality = 'fair';
      warnings.push('Limited forecast information available');
    }
  } else if (hasTemperatureRange || weather.temperature !== undefined) {
    // If we have some temperature data, even without full forecast info
    dataQuality = 'fair';
    warnings.push('Partial weather data available');
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

  console.log(`✅ Final enhanced validation for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 Enhanced display type determination:`, {
    validation,
    error,
    retryCount,
    hasActualForecast: weather?.isActualForecast,
    isWithinRange: validation.isWithinForecastRange
  });

  // Handle error states first
  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  // Handle loading state
  if (!validation.isValid && validation.dataQuality === 'unavailable' && !error) {
    return 'loading';
  }

  // **PHASE 2 PREVIEW**: Prioritize actual forecast data even with incomplete validation
  if (weather?.isActualForecast === true && (validation.isWithinForecastRange || validation.hasTemperatureRange)) {
    console.log(`🌤️ Live forecast prioritized - quality: ${validation.dataQuality}`);
    return 'live-forecast';
  }

  // Enhanced logic - prioritize actual forecast data even with incomplete dateMatchInfo
  if (validation.hasActualForecast && (validation.isWithinForecastRange || validation.hasTemperatureRange)) {
    console.log(`🌤️ Live forecast available - quality: ${validation.dataQuality}`);
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
