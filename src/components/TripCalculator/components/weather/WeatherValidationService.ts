
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
  validationDetails?: any;
}

export type WeatherDisplayType = 
  | 'live-forecast' 
  | 'seasonal-estimate' 
  | 'service-unavailable' 
  | 'loading';

function hasAnyDisplayableData(weather: any): boolean {
  const hasAnyTemp = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasDescription = !!weather.description;
  const hasAnyData = hasAnyTemp || hasDescription;
  
  console.log(`🔍 Weather data check:`, {
    hasAnyTemp,
    hasDescription,
    hasAnyData,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    description: weather.description
  });

  return hasAnyData;
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 Weather validation for ${cityName}:`, {
    hasWeather: !!weather,
    weatherType: typeof weather,
    segmentDate: segmentDate?.toISOString()
  });

  if (!weather) {
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

  const canDisplay = hasAnyDisplayableData(weather);
  
  if (!canDisplay) {
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
      validationDetails: { reason: 'no_displayable_data' }
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

  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'fair';
  
  if (weather.isActualForecast && isWithinForecastRange && weather.dateMatchInfo?.matchType === 'exact') {
    dataQuality = 'excellent';
  } else if (weather.isActualForecast && isWithinForecastRange) {
    dataQuality = 'good';
  }

  const result = {
    isValid: true,
    hasActualForecast: !!weather.isActualForecast,
    hasTemperatureRange: !!(weather.highTemp && weather.lowTemp) || !!weather.temperature,
    hasMatchedForecast: !!weather.dateMatchInfo,
    daysFromNow,
    isWithinForecastRange,
    dataQuality,
    warnings: [],
    hasCompleteData: !!weather.isActualForecast,
    canShowLiveForecast: true,
    validationDetails: {
      canDisplay,
      hasTemperature: !!weather.temperature,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      hasDescription: !!weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      validationMode: 'permissive'
    }
  };

  console.log(`✅ Validation result for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  if (validation.isValid && validation.canShowLiveForecast) {
    return 'live-forecast';
  }

  return 'loading';
};
