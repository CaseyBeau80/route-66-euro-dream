
import React from 'react';
import { format } from 'date-fns';
import WeatherIcon from '../WeatherIcon';
import WeatherBadge from './WeatherBadge';
import { UnifiedWeatherValidator } from '../services/UnifiedWeatherValidator';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

interface WeatherHeaderProps {
  weather: {
    icon?: string;
    description?: string;
    source?: string;
    isActualForecast?: boolean;
    dateMatchInfo?: { source?: string };
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    precipitationChance?: number;
    cityName?: string;
    forecast?: any[];
    forecastDate?: Date;
  };
  segmentDate?: Date | null;
  cityName: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  // PLAN IMPLEMENTATION: Use enhanced validation with segment date
  const validation = UnifiedWeatherValidator.validateWeatherData(weather, segmentDate || undefined);

  console.log('🎯 PLAN: WeatherHeader using ENHANCED date-based validation for', cityName, {
    validation: validation.isLiveForecast ? 'LIVE' : 'HISTORICAL',
    displayLabel: validation.displayLabel,
    styleTheme: validation.styleTheme,
    dateBasedDecision: validation.dateBasedDecision,
    daysFromToday: validation.daysFromToday,
    segmentDate: segmentDate?.toLocaleDateString(),
    planImplementation: 'ENHANCED_DATE_BASED_VALIDATION'
  });

  // Safely convert source to WeatherSourceType with fallback
  const sourceType: WeatherSourceType = (weather.source as WeatherSourceType) || 'historical_fallback';

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {weather.icon && (
          <WeatherIcon iconCode={weather.icon} className="w-8 h-8" />
        )}
        <div>
          <h4 className="font-medium text-blue-900">
            {weather.description || validation.displayLabel}
          </h4>
          {segmentDate && (
            <div className="text-sm text-blue-600">
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
      
      {/* PLAN IMPLEMENTATION: Pass segment date to WeatherBadge for enhanced validation */}
      <WeatherBadge
        source={sourceType}
        isActualForecast={weather.isActualForecast}
        dateMatchSource={weather.dateMatchInfo?.source}
        cityName={cityName}
        weather={weather}
        segmentDate={segmentDate || undefined}
      />
    </div>
  );
};

export default WeatherHeader;
