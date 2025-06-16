
import React from 'react';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';
import { UnifiedWeatherValidator } from '../services/UnifiedWeatherValidator';
import { UnifiedStylingService } from '../services/UnifiedStylingService';

interface WeatherBadgeProps {
  source: WeatherSourceType;
  isActualForecast?: boolean;
  dateMatchSource?: string;
  cityName: string;
  weather?: any; // Full weather object for validation
}

const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  source,
  isActualForecast,
  dateMatchSource,
  cityName,
  weather
}) => {
  console.log('🏷️ FIXED: WeatherBadge using enhanced validation for', cityName);

  // Use enhanced validation for consistent badge display
  const validation = UnifiedWeatherValidator.validateWeatherData(weather || {
    source,
    isActualForecast,
    dateMatchInfo: { source: dateMatchSource }
  });

  const badgeStyles = UnifiedStylingService.getBadgeStyles(validation.styleTheme);

  console.log('🏷️ FIXED: WeatherBadge final styling for', cityName, {
    validation: validation.isLiveForecast ? 'LIVE' : 'HISTORICAL',
    styleTheme: validation.styleTheme,
    badgeText: validation.badgeText,
    actualWeatherData: weather ? {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      hasTemperature: !!(weather.temperature || weather.highTemp),
      hasMetrics: !!(weather.humidity || weather.windSpeed)
    } : null
  });

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeStyles.classes}`}>
      {validation.badgeText}
    </span>
  );
};

export default WeatherBadge;
