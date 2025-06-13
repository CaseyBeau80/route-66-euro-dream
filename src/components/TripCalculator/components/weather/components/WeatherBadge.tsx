
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

    // FIXED LOGIC: The isActualForecast flag is the PRIMARY and DEFINITIVE source of truth
    // If it's explicitly false, this is NEVER a live forecast, regardless of other flags
    if (isActualForecast === false) {
      console.log('🔍 WeatherBadge: isActualForecast=false - DEFINITIVE HISTORICAL', {
        cityName,
        reason: 'isActualForecast_false_definitive'
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

    // FIXED LOGIC: Only if isActualForecast is explicitly true AND we have live_forecast sources
    // can we show a live forecast badge
    if (isActualForecast === true && 
        (source === 'live_forecast' || dateMatchSource === 'live_forecast' || dateMatchSource === 'api-forecast')) {
      console.log('🔍 WeatherBadge: CONFIRMED live forecast with strict validation', {
        cityName,
        isActualForecast,
        source,
        dateMatchSource,
        reason: 'confirmed_live_with_strict_validation'
      });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // FIXED LOGIC: Any other case should default to historical/unavailable
    // This includes undefined isActualForecast, historical sources, etc.
    console.log('🔍 WeatherBadge: Defaulting to historical for unclear case', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource,
      reason: 'default_to_historical_for_safety'
    });

    return {
      text: '📊 Seasonal Average',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      explanation: 'Based on historical weather patterns',
      showTooltip: true,
      tooltipMessage: 'Weather data based on historical patterns'
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
