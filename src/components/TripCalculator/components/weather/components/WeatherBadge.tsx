
import React from 'react';
import { WeatherSourceType } from '@/components/Route66Map/services/weather/WeatherServiceTypes';

interface WeatherBadgeProps {
  source: WeatherSourceType;
  isActualForecast?: boolean;
  dateMatchSource?: string;
  cityName: string;
}

const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  source,
  isActualForecast,
  dateMatchSource,
  cityName
}) => {
  const isLive = isActualForecast === true && source === 'live_forecast';
  
  return (
    <div className={`px-2 py-1 rounded text-xs font-medium ${
      isLive 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-gray-100 text-gray-600 border border-gray-200'
    }`}>
      {isLive ? '🔴 Live' : '📊 Historical'}
    </div>
  );
};

export default WeatherBadge;
