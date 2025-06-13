
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
  console.log('🎯 FIXED: WeatherBadge for', cityName, {
    source,
    isActualForecast,
    dateMatchSource
  });

  // FIXED LOGIC: Properly detect historical data
  const isHistoricalData = (
    isActualForecast === false ||
    source === 'historical_fallback' ||
    source === 'seasonal' ||
    dateMatchSource === 'historical_fallback' ||
    dateMatchSource === 'seasonal-estimate'
  );

  // Only show live forecast if explicitly marked as actual forecast AND not from fallback sources
  const isLiveForecast = (
    isActualForecast === true &&
    source === 'live_forecast' &&
    dateMatchSource !== 'historical_fallback' &&
    dateMatchSource !== 'seasonal-estimate'
  );

  console.log('🎯 FIXED: Badge decision for', cityName, {
    isHistoricalData,
    isLiveForecast,
    decision: isLiveForecast ? 'LIVE_FORECAST' : 'HISTORICAL_DATA'
  });

  if (isLiveForecast) {
    return (
      <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
        📡 Live Forecast
      </div>
    );
  }

  // For all other cases (historical, seasonal, fallback), show historical data badge
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
