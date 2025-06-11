
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

// ENHANCED: Stricter validation for live forecast detection
function hasValidLiveForecastData(weather: any): boolean {
  // Must have actual forecast flag AND valid temperatures AND recent API data
  const hasActualFlag = weather.isActualForecast === true;
  const hasValidTemps = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined && 
     weather.highTemp > 0 && weather.lowTemp > 0) ||
    (weather.temperature !== undefined && weather.temperature > 0)
  );
  const hasApiSource = weather.dateMatchInfo?.source === 'api-forecast';
  const hasValidDescription = weather.description && weather.description !== 'Clear' && weather.description.length > 3;
  
  console.log(`🔍 Enhanced live forecast validation:`, {
    hasActualFlag,
    hasValidTemps,
    hasApiSource,
    hasValidDescription,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    temperature: weather.temperature,
    source: weather.dateMatchInfo?.source,
    description: weather.description
  });

  return hasActualFlag && hasValidTemps && hasApiSource && hasValidDescription;
}

// Helper function to check if weather has high/low temperatures
function hasHighLowTemps(weather: any): boolean {
  return !!(weather.highTemp && weather.lowTemp && weather.highTemp > 0 && weather.lowTemp > 0);
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 ENHANCED WeatherValidationService: Validating for ${cityName}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
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

  // ENHANCED: Stricter validation for actual forecasts
  const hasActualForecast = weather.isActualForecast === true;
  const hasValidLiveForecast = hasValidLiveForecastData(weather);
  
  // Enhanced temperature range validation with strict requirements
  const hasTemperatureRange = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined && 
     weather.highTemp > 0 && weather.lowTemp > 0) ||
    (weather.temperature !== undefined && weather.temperature > 0)
  );
  
  const hasMatchedForecast = weather.matchedForecastDay !== undefined || 
                            (weather.forecast && weather.forecast.length > 0);
  
  // Calculate days from now with enhanced validation
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

  // ENHANCED: Stricter quality assessment
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'unavailable';
  let canShowLiveForecast = false;
  
  if (hasValidLiveForecast && hasTemperatureRange && isWithinForecastRange) {
    if (weather.dateMatchInfo?.matchType === 'exact') {
      dataQuality = 'excellent';
      canShowLiveForecast = true;
    } else if (weather.dateMatchInfo?.matchType === 'closest') {
      dataQuality = 'good';
      canShowLiveForecast = true;
      warnings.push(`Date match is approximate (${weather.dateMatchInfo.daysOffset} days offset)`);
    } else {
      dataQuality = 'fair';
      warnings.push('Live forecast data incomplete');
    }
  } else if (hasActualForecast && hasTemperatureRange && !isWithinForecastRange) {
    dataQuality = 'poor';
    warnings.push(`Date beyond reliable forecast range (${daysFromNow} days ahead)`);
  } else if (hasTemperatureRange || weather.temperature !== undefined) {
    dataQuality = 'fair';
    warnings.push('Using seasonal estimates');
  } else {
    dataQuality = 'unavailable';
    warnings.push('Weather service unavailable');
  }

  // Complete data check
  const hasCompleteData = hasValidLiveForecast && hasTemperatureRange && 
                         weather.description && weather.dateMatchInfo?.source === 'api-forecast';

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

  console.log(`✅ ENHANCED Final validation for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 ENHANCED Display type determination:`, {
    validation,
    error,
    retryCount,
    canShowLiveForecast: validation.canShowLiveForecast,
    hasCompleteData: validation.hasCompleteData
  });

  // Handle error states first
  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  // Handle loading state
  if (!validation.isValid && validation.dataQuality === 'unavailable' && !error) {
    return 'loading';
  }

  // ENHANCED: Only show live forecast if we have complete, validated data
  if (validation.canShowLiveForecast && validation.hasCompleteData) {
    console.log(`🌤️ LIVE FORECAST APPROVED - complete data validation passed`);
    return 'live-forecast';
  }

  // For dates beyond 5-day range or when actual forecast is not available
  if (validation.daysFromNow !== null && validation.daysFromNow > 5) {
    console.log(`📊 Using seasonal estimate for date beyond 5-day range (${validation.daysFromNow} days)`);
    return 'seasonal-estimate';
  }

  // ENHANCED: Default to seasonal estimate unless we have verified live data
  console.log(`📊 Using seasonal estimate - live forecast criteria not met`);
  return 'seasonal-estimate';
};
