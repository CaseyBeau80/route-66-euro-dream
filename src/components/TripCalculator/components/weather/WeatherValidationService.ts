
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from './WeatherDataDebugger';

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
  validationDetails?: any; // For debugging
}

export type WeatherDisplayType = 
  | 'live-forecast' 
  | 'seasonal-estimate' 
  | 'service-unavailable' 
  | 'loading';

// FIXED: Much more permissive live forecast validation
function hasValidLiveForecastData(weather: any): boolean {
  // CRITICAL: Accept weather data if we have ANY temperature and description
  const hasAnyTemp = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasDescription = !!weather.description;
  
  // NEW: Don't require isActualForecast flag to be true
  const hasReasonableData = hasAnyTemp && hasDescription;
  
  console.log(`🔍 RELAXED live forecast validation for ${weather.cityName || 'unknown'}:`, {
    hasAnyTemp,
    hasDescription,
    hasReasonableData,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description,
    isActualForecast: weather.isActualForecast,
    source: weather.dateMatchInfo?.source
  });

  return hasReasonableData;
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 CRITICAL VALIDATION START for ${cityName}:`, {
    hasWeather: !!weather,
    weatherKeys: weather ? Object.keys(weather) : [],
    segmentDate: segmentDate?.toISOString()
  });

  // Force validation debugging
  if (weather) {
    WeatherDataDebugger.debugForceValidation(cityName, weather);
  }

  const warnings: string[] = [];

  if (!weather) {
    const failureResult = {
      isValid: false,
      hasActualForecast: false,
      hasTemperatureRange: false,
      hasMatchedForecast: false,
      daysFromNow: null,
      isWithinForecastRange: false,
      dataQuality: 'unavailable' as const,
      warnings: ['No weather data available'],
      hasCompleteData: false,
      canShowLiveForecast: false,
      validationDetails: { reason: 'no_weather_data' }
    };
    
    WeatherDataDebugger.debugValidationFailure(cityName, weather, failureResult);
    return failureResult;
  }

  // CRITICAL: Use much more relaxed validation
  const hasAnyTemperature = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasDescription = !!weather.description;
  const hasMinimalData = hasAnyTemperature && hasDescription;
  
  console.log(`🎯 MINIMAL DATA CHECK for ${cityName}:`, {
    hasAnyTemperature,
    hasDescription,
    hasMinimalData,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description
  });

  // Calculate days from now
  let daysFromNow: number | null = null;
  
  if (weather.dateMatchInfo?.daysOffset !== undefined) {
    daysFromNow = weather.dateMatchInfo.daysOffset;
  } else if (segmentDate) {
    const now = new Date();
    daysFromNow = Math.ceil((segmentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    warnings.push('Date calculated from segment date (dateMatchInfo missing)');
  }

  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;
  
  // CRITICAL: If we have minimal data, consider it valid
  if (!hasMinimalData) {
    const failureResult = {
      isValid: false,
      hasActualForecast: false,
      hasTemperatureRange: false,
      hasMatchedForecast: false,
      daysFromNow,
      isWithinForecastRange,
      dataQuality: 'unavailable' as const,
      warnings: ['Missing essential weather data (temperature or description)'],
      hasCompleteData: false,
      canShowLiveForecast: false,
      validationDetails: { 
        reason: 'missing_minimal_data',
        hasAnyTemperature,
        hasDescription
      }
    };
    
    WeatherDataDebugger.debugValidationFailure(cityName, weather, failureResult);
    return failureResult;
  }

  // FIXED: Much more permissive quality assessment
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'fair';
  let canShowLiveForecast = true; // Default to true if we have minimal data
  
  const hasValidLiveData = hasValidLiveForecastData(weather);
  
  if (hasValidLiveData && isWithinForecastRange) {
    if (weather.dateMatchInfo?.matchType === 'exact') {
      dataQuality = 'excellent';
    } else {
      dataQuality = 'good';
    }
  } else if (hasValidLiveData) {
    dataQuality = 'good';
  } else if (hasMinimalData) {
    dataQuality = 'fair';
    warnings.push('Using available weather data');
  }

  const result = {
    isValid: true, // CRITICAL: If we have minimal data, it's valid
    hasActualForecast: !!weather.isActualForecast,
    hasTemperatureRange: hasAnyTemperature,
    hasMatchedForecast: !!(weather.matchedForecastDay || weather.forecast?.length),
    daysFromNow,
    isWithinForecastRange,
    dataQuality,
    warnings,
    hasCompleteData: hasValidLiveData,
    canShowLiveForecast,
    validationDetails: {
      hasMinimalData,
      hasValidLiveData,
      isWithinForecastRange,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description
    }
  };

  console.log(`✅ FINAL VALIDATION RESULT for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 DISPLAY TYPE DECISION for ${weather?.cityName || 'unknown'}:`, {
    validation,
    error,
    retryCount,
    hasMinimalData: validation.validationDetails?.hasMinimalData
  });

  if (error || retryCount > 2) {
    WeatherDataDebugger.debugRenderDecision(weather?.cityName || 'unknown', 'service-unavailable', { error, retryCount });
    return 'service-unavailable';
  }

  if (!validation.isValid) {
    WeatherDataDebugger.debugRenderDecision(weather?.cityName || 'unknown', 'loading', { reason: 'invalid_data' });
    return 'loading';
  }

  // CRITICAL: If validation passed, show as live forecast
  if (validation.isValid && validation.validationDetails?.hasMinimalData) {
    WeatherDataDebugger.debugRenderDecision(weather?.cityName || 'unknown', 'live-forecast', { 
      reason: 'minimal_data_available',
      dataQuality: validation.dataQuality
    });
    return 'live-forecast';
  }

  // Fallback to seasonal estimate
  WeatherDataDebugger.debugRenderDecision(weather?.cityName || 'unknown', 'seasonal-estimate', { reason: 'fallback' });
  return 'seasonal-estimate';
};
