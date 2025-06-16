
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
  segmentDate?: Date; // PLAN: Added segment date for enhanced validation
}

const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  source,
  isActualForecast,
  dateMatchSource,
  cityName,
  weather,
  segmentDate
}) => {
  console.log('🏷️ PLAN: WeatherBadge using ENHANCED date-based validation for', cityName);

  // PLAN IMPLEMENTATION: Use enhanced validation with segment date
  const validation = UnifiedWeatherValidator.validateWeatherData(weather || {
    source,
    isActualForecast,
    dateMatchInfo: { source: dateMatchSource }
  }, segmentDate);

  const badgeStyles = UnifiedStylingService.getBadgeStyles(validation.styleTheme);

  console.log('🏷️ PLAN: WeatherBadge ENHANCED validation result for', cityName, {
    validation: validation.isLiveForecast ? 'LIVE' : 'HISTORICAL',
    styleTheme: validation.styleTheme,
    badgeText: validation.badgeText,
    dateBasedDecision: validation.dateBasedDecision,
    daysFromToday: validation.daysFromToday,
    forecastRangeCheck: validation.forecastRangeCheck,
    segmentDate: segmentDate?.toLocaleDateString(),
    planImplementation: 'ENHANCED_DATE_BASED_VALIDATION'
  });

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeStyles.classes}`}>
      {validation.badgeText}
      {process.env.NODE_ENV === 'development' && validation.dateBasedDecision && (
        <span className="ml-1 opacity-75 text-xs">
          ({validation.daysFromToday}d)
        </span>
      )}
    </span>
  );
};

export default WeatherBadge;
