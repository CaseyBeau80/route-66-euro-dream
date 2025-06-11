
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
  hasCompleteData: boolean;
  canShowLiveForecast: boolean;
}

export type WeatherDisplayType = 
  | 'live-forecast' 
  | 'seasonal-estimate' 
  | 'service-unavailable' 
  | 'loading';

// FIXED: More permissive live forecast validation
function hasValidLiveForecastData(weather: any): boolean {
  const hasActualFlag = weather.isActualForecast === true;
  const hasValidTemps = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined) ||
    (weather.temperature !== undefined && weather.temperature > -50 && weather.temperature < 150)
  );
  const hasApiSource = weather.dateMatchInfo?.source === 'api-forecast';
  const hasValidDescription = !!weather.description;
  
  console.log(`🔍 IMPROVED live forecast validation:`, {
    hasActualFlag,
    hasValidTemps,
    hasApiSource,
    hasValidDescription,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    source: weather.dateMatchInfo?.source,
    description: weather.description
  });

  return hasActualFlag && hasValidTemps && hasApiSource && hasValidDescription;
}

function hasHighLowTemps(weather: any): boolean {
  return !!(weather.highTemp && weather.lowTemp);
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 IMPROVED WeatherValidationService: Validating for ${cityName}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
    hasTemperature: weather?.temperature !== undefined,
    segmentDate: segmentDate?.toISOString(),
    dateMatchInfo: weather?.dateMatchInfo
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
      warnings: ['No weather data available'],
      hasCompleteData: false,
      canShowLiveForecast: false
    };
  }

  const hasActualForecast = weather.isActualForecast === true;
  const hasValidLiveForecast = hasValidLiveForecastData(weather);
  
  // FIXED: More permissive temperature validation
  const hasTemperatureRange = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined) ||
    (weather.temperature !== undefined && weather.temperature > -50 && weather.temperature < 150)
  );
  
  const hasMatchedForecast = weather.matchedForecastDay !== undefined || 
                            (weather.forecast && weather.forecast.length > 0);
  
  let daysFromNow: number | null = null;
  
  if (weather.dateMatchInfo?.daysOffset !== undefined) {
    daysFromNow = weather.dateMatchInfo.daysOffset;
  } else if (weather.forecastDate) {
    const forecastDate = new Date(weather.forecastDate);
    const now = new Date();
    daysFromNow = Math.ceil((forecastDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  } else if (segmentDate) {
    const now = new Date();
    daysFromNow = Math.ceil((segmentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    warnings.push('Date calculated from segment date (dateMatchInfo missing)');
  }

  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;

  // FIXED: More permissive quality assessment
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'unavailable';
  let canShowLiveForecast = false;
  
  if (hasValidLiveForecast && hasTemperatureRange) {
    if (isWithinForecastRange) {
      if (weather.dateMatchInfo?.matchType === 'exact') {
        dataQuality = 'excellent';
        canShowLiveForecast = true;
      } else if (weather.dateMatchInfo?.matchType === 'closest' || weather.dateMatchInfo?.matchType === 'fallback') {
        dataQuality = 'good';
        canShowLiveForecast = true;
        if (weather.dateMatchInfo.daysOffset) {
          warnings.push(`Date match is approximate (${weather.dateMatchInfo.daysOffset} days offset)`);
        }
      } else {
        dataQuality = 'good';
        canShowLiveForecast = true;
        warnings.push('Live forecast data available');
      }
    } else {
      dataQuality = 'fair';
      warnings.push(`Date beyond 5-day forecast range (${daysFromNow} days ahead)`);
    }
  } else if (hasActualForecast && hasTemperatureRange) {
    dataQuality = 'fair';
    canShowLiveForecast = isWithinForecastRange;
    warnings.push('Partial forecast data available');
  } else if (hasTemperatureRange || weather.temperature !== undefined) {
    dataQuality = 'fair';
    warnings.push('Using seasonal estimates');
  } else {
    dataQuality = 'unavailable';
    warnings.push('Weather service unavailable');
  }

  // FIXED: More permissive complete data check
  const hasCompleteData = hasValidLiveForecast && hasTemperatureRange && !!weather.description;

  const result = {
    isValid: dataQuality !== 'unavailable',
    hasActualForecast,
    hasTemperatureRange,
    hasMatchedForecast,
    daysFromNow,
    isWithinForecastRange,
    dataQuality,
    warnings,
    hasCompleteData,
    canShowLiveForecast
  };

  console.log(`✅ IMPROVED Final validation for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 IMPROVED Display type determination:`, {
    validation,
    error,
    retryCount,
    canShowLiveForecast: validation.canShowLiveForecast,
    hasCompleteData: validation.hasCompleteData,
    dataQuality: validation.dataQuality
  });

  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  if (!validation.isValid && validation.dataQuality === 'unavailable' && !error) {
    return 'loading';
  }

  // FIXED: More permissive live forecast display
  if (validation.canShowLiveForecast || (validation.hasActualForecast && validation.hasTemperatureRange && validation.isWithinForecastRange)) {
    console.log(`🌤️ LIVE FORECAST APPROVED - improved validation passed`);
    return 'live-forecast';
  }

  if (validation.daysFromNow !== null && validation.daysFromNow > 5) {
    console.log(`📊 Using seasonal estimate for date beyond 5-day range (${validation.daysFromNow} days)`);
    return 'seasonal-estimate';
  }

  // FIXED: Default to seasonal estimate with better logic
  console.log(`📊 Using seasonal estimate - live forecast criteria not fully met but data available`);
  return 'seasonal-estimate';
};
