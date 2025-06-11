
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
  validationDetails?: any;
}

export type WeatherDisplayType = 
  | 'live-forecast' 
  | 'seasonal-estimate' 
  | 'service-unavailable' 
  | 'loading';

// ULTRA-PERMISSIVE: Accept ANY weather data that exists
function hasAnyDisplayableData(weather: any): boolean {
  const hasAnyTemp = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasDescription = !!weather.description;
  const hasAnyData = hasAnyTemp || hasDescription;
  
  console.log(`🔍 FORCE LOG - ULTRA PERMISSIVE DATA CHECK:`, {
    hasAnyTemp,
    hasDescription,
    hasAnyData,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description,
    canDisplay: hasAnyData
  });

  return hasAnyData;
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🚨 FORCE LOG - VALIDATION START for ${cityName}:`, {
    hasWeather: !!weather,
    weatherType: typeof weather,
    segmentDate: segmentDate?.toISOString()
  });

  if (weather) {
    console.log(`🔍 FORCE LOG - RAW WEATHER DATA for ${cityName}:`, {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchInfo: weather.dateMatchInfo,
      allKeys: Object.keys(weather)
    });
  }

  const warnings: string[] = [];

  if (!weather) {
    console.log(`❌ FORCE LOG - NO WEATHER DATA for ${cityName}`);
    return {
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
  }

  // ULTRA-PERMISSIVE: Check for ANY displayable data
  const canDisplay = hasAnyDisplayableData(weather);
  
  if (!canDisplay) {
    console.log(`❌ FORCE LOG - NO DISPLAYABLE DATA for ${cityName}:`, {
      hasTemperature: !!weather.temperature,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      hasDescription: !!weather.description,
      description: weather.description,
      reason: 'no_displayable_data'
    });
    
    return {
      isValid: false,
      hasActualForecast: false,
      hasTemperatureRange: false,
      hasMatchedForecast: false,
      daysFromNow: null,
      isWithinForecastRange: false,
      dataQuality: 'unavailable' as const,
      warnings: ['No displayable weather data'],
      hasCompleteData: false,
      canShowLiveForecast: false,
      validationDetails: { 
        reason: 'no_displayable_data',
        hasTemperature: !!weather.temperature,
        hasHighTemp: !!weather.highTemp,
        hasLowTemp: !!weather.lowTemp,
        hasDescription: !!weather.description
      }
    };
  }

  // Calculate days from now
  let daysFromNow: number | null = null;
  if (weather.dateMatchInfo?.daysOffset !== undefined) {
    daysFromNow = weather.dateMatchInfo.daysOffset;
  } else if (segmentDate) {
    const now = new Date();
    daysFromNow = Math.ceil((segmentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  }

  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;

  // ULTRA-PERMISSIVE: If we have ANY data, mark as valid
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'fair';
  
  // Determine quality based on available data
  if (weather.isActualForecast && isWithinForecastRange && weather.dateMatchInfo?.matchType === 'exact') {
    dataQuality = 'excellent';
  } else if (weather.isActualForecast && isWithinForecastRange) {
    dataQuality = 'good';
  } else if (canDisplay) {
    dataQuality = 'fair';
  }

  const result = {
    isValid: true, // ULTRA-PERMISSIVE: Always true if we have ANY displayable data
    hasActualForecast: !!weather.isActualForecast,
    hasTemperatureRange: !!(weather.highTemp && weather.lowTemp) || !!weather.temperature,
    hasMatchedForecast: !!weather.dateMatchInfo,
    daysFromNow,
    isWithinForecastRange,
    dataQuality,
    warnings,
    hasCompleteData: !!weather.isActualForecast,
    canShowLiveForecast: true, // ULTRA-PERMISSIVE: Always true if we have ANY displayable data
    validationDetails: {
      canDisplay,
      hasTemperature: !!weather.temperature,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      hasDescription: !!weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      validationMode: 'ultra_permissive'
    }
  };

  console.log(`✅ FORCE LOG - VALIDATION RESULT for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 FORCE LOG - DISPLAY TYPE for ${weather?.cityName || 'unknown'}:`, {
    isValid: validation.isValid,
    canShowLiveForecast: validation.canShowLiveForecast,
    error,
    retryCount,
    validationMode: 'ultra_permissive'
  });

  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  // ULTRA-PERMISSIVE: If validation says it's valid, show it
  if (validation.isValid && validation.canShowLiveForecast) {
    console.log(`✅ FORCE LOG - SHOWING LIVE FORECAST for ${weather?.cityName || 'unknown'}`);
    return 'live-forecast';
  }

  return 'loading';
};
