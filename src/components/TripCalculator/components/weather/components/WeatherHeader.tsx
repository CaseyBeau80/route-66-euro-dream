
import React from 'react';
import { format } from 'date-fns';
import WeatherIcon from '../WeatherIcon';
import WeatherBadge from './WeatherBadge';
import { WeatherTypeDetector } from '../utils/WeatherTypeDetector';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

interface WeatherHeaderProps {
  weather: {
    icon?: string;
    description?: string;
    source?: string;
    isActualForecast?: boolean;
    dateMatchInfo?: { source?: string };
  };
  segmentDate?: Date | null;
  cityName: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  const weatherType = React.useMemo(() => {
    return WeatherTypeDetector.detectWeatherType(weather);
  }, [weather.source, weather.isActualForecast, weather.dateMatchInfo?.source]);

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
            {weather.description || weatherType.displayLabel}
          </h4>
          {segmentDate && (
            <div className="text-sm text-blue-600">
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
      
      <WeatherBadge
        source={sourceType}
        isActualForecast={weather.isActualForecast}
        dateMatchSource={weather.dateMatchInfo?.source}
        cityName={cityName}
      />
    </div>
  );
};

export default WeatherHeader;
