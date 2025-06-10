
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

// Helper function to check if weather has high/low temperatures
function hasHighLowTemps(weather: any): boolean {
  return !!(weather.highTemp && weather.lowTemp);
}

export const validateWeatherData = (
  weather: any, 
  cityName: string,
  segmentDate?: Date | null
): WeatherValidationResult => {
  console.log(`🔍 WeatherValidationService: Validating for ${cityName}:`, {
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasHighTemp: weather?.highTemp !== undefined,
    hasLowTemp: weather?.lowTemp !== undefined,
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
  
  // Prioritize actual forecast with high/low temps
  if (hasActualForecast && hasHighLowTemps(weather)) {
    console.log(`✅ Live forecast validation passed for ${cityName}`);
    return {
      isValid: true,
      hasActualForecast: true,
      hasTemperatureRange: true,
      hasMatchedForecast: true,
      daysFromNow: weather.dateMatchInfo?.daysOffset || 1,
      isWithinForecastRange: true,
      dataQuality: 'excellent',
      warnings: []
    };
  }

  // Enhanced temperature range validation
  const hasTemperatureRange = (
    (weather.highTemp !== undefined && weather.lowTemp !== undefined) ||
    (weather.temperature !== undefined) ||
    (weather.forecast && weather.forecast.length > 0)
  );
  
  const hasMatchedForecast = weather.matchedForecastDay !== undefined || 
                            (weather.forecast && weather.forecast.length > 0);
  
  // Calculate days from now
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

  // Quality assessment
  let dataQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable' = 'unavailable';
  
  if (hasActualForecast && hasTemperatureRange) {
    if (weather.dateMatchInfo?.matchType === 'exact') {
      dataQuality = 'excellent';
    } else if (weather.dateMatchInfo?.matchType === 'closest') {
      dataQuality = 'good';
      warnings.push(`Date match is approximate (${weather.dateMatchInfo.daysOffset} days offset)`);
    } else if (isWithinForecastRange) {
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

  console.log(`✅ Final validation for ${cityName}:`, result);
  return result;
};

export const getWeatherDisplayType = (
  validation: WeatherValidationResult,
  error: string | null,
  retryCount: number,
  weather?: any
): WeatherDisplayType => {
  console.log(`🎯 Display type determination:`, {
    validation,
    error,
    retryCount,
    hasActualForecast: weather?.isActualForecast
  });

  // Handle error states first
  if (error || retryCount > 2) {
    return 'service-unavailable';
  }

  // Handle loading state
  if (!validation.isValid && validation.dataQuality === 'unavailable' && !error) {
    return 'loading';
  }

  // Prioritize actual forecast data
  if (weather?.isActualForecast === true && hasHighLowTemps(weather)) {
    console.log(`🌤️ Live forecast prioritized`);
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
