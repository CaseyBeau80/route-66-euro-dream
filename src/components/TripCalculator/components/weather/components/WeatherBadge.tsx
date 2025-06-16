
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
  console.log('🏷️ CRITICAL FIX: WeatherBadge - STRICT SOURCE-BASED RENDERING:', {
    cityName,
    source,
    isActualForecast,
    dateMatchSource,
    strictLogic: 'SOURCE_DETERMINES_EVERYTHING'
  });

  // CRITICAL FIX: Strict source-based badge determination
  const isLiveWeather = source === 'live_forecast' && isActualForecast === true;

  console.log('🏷️ CRITICAL FIX: WeatherBadge determination for', cityName, {
    source,
    isActualForecast,
    isLiveWeather,
    willShowAsLive: isLiveWeather,
    strictDetermination: true
  });

  if (isLiveWeather) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        🟢 Live Forecast
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
      📊 Historical Data
    </span>
  );
};

export default WeatherBadge;
