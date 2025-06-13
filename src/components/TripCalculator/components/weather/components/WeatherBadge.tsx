
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WeatherBadgeProps {
  source: 'live_forecast' | 'historical_fallback' | 'seasonal';
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
  console.log('🎯 SIMPLIFIED: WeatherBadge for', cityName, {
    source,
    isActualForecast,
    dateMatchSource
  });

  // SIMPLIFIED LOGIC: Just check if it's a live forecast or not
  const isLiveForecast = (
    isActualForecast === true ||
    source === 'live_forecast' ||
    dateMatchSource === 'live_forecast' ||
    dateMatchSource === 'api-forecast'
  );

  console.log('🎯 SIMPLIFIED: Badge decision for', cityName, {
    isLiveForecast,
    decision: isLiveForecast ? 'LIVE_FORECAST' : 'HISTORICAL'
  });

  if (isLiveForecast) {
    return (
      <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
        📡 Live Forecast
      </div>
    );
  }

  // For any non-live forecast, show historical with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
            📊 Historical Data
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Live forecast unavailable - using historical weather patterns</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WeatherBadge;
