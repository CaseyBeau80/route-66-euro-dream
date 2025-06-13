
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeConfig {
  text: string;
  bgColor: string;
  textColor: string;
  explanation: string;
  showTooltip?: boolean;
  tooltipMessage?: string;
}

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
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    // DEBUGGING: Log all the inputs to understand what's happening
    console.log('🔍 WeatherBadge DEBUG - All inputs for', cityName, {
      source,
      isActualForecast,
      dateMatchSource,
      timestamp: new Date().toISOString()
    });

    // FIXED LOGIC: If isActualForecast is false, it's definitely not live forecast
    if (isActualForecast === false) {
      console.log('🔍 WeatherBadge: isActualForecast=false detected, showing historical badge', {
        cityName,
        reason: 'isActualForecast_false'
      });
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
      };
    }

    // FIXED LOGIC: Check for historical/seasonal sources
    if (source === 'historical_fallback' || source === 'seasonal' || dateMatchSource === 'historical_fallback') {
      console.log('🔍 WeatherBadge: Historical source detected, showing seasonal badge', {
        cityName,
        source,
        dateMatchSource,
        reason: 'source_indicates_historical'
      });
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
      };
    }

    // FIXED LOGIC: Only show live forecast if explicitly confirmed
    if (dateMatchSource === 'live_forecast' && isActualForecast === true) {
      console.log('🔍 WeatherBadge: Confirmed live forecast, showing live badge', {
        cityName,
        reason: 'confirmed_live_forecast'
      });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // FIXED LOGIC: Default to unavailable for any unclear cases
    console.log('🔍 WeatherBadge: Unclear data source, showing unavailable badge', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource,
      reason: 'unclear_source_defaulting_to_unavailable'
    });

    return {
      text: '❓ Forecast Unavailable',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      explanation: 'Weather data source unavailable',
      showTooltip: true,
      tooltipMessage: 'Weather data could not be retrieved for this location and date'
    };
  }, [source, isActualForecast, dateMatchSource, cityName]);

  const BadgeContent = () => (
    <div className={`text-xs px-2 py-1 rounded ${getBadgeConfig.bgColor} ${getBadgeConfig.textColor}`}>
      {getBadgeConfig.text}
    </div>
  );

  if (getBadgeConfig.showTooltip && getBadgeConfig.tooltipMessage) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <BadgeContent />
          </TooltipTrigger>
          <TooltipContent>
            <p>{getBadgeConfig.tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <BadgeContent />;
};

export default WeatherBadge;
