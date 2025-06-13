
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
  console.log('🎯 SIMPLIFIED: WeatherBadge for', cityName, {
    source,
    isActualForecast,
    dateMatchSource
  });

  // SIMPLIFIED LOGIC: Only show live forecast if EVERYTHING confirms it's live
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    // STRICT CHECK: Must have ALL live indicators
    const isDefinitelyLive = (
      isActualForecast === true &&
      source === 'live_forecast' &&
      (dateMatchSource === 'live_forecast' || dateMatchSource === 'api-forecast')
    );
    
    console.log('🎯 SIMPLIFIED: Badge decision for', cityName, {
      isDefinitelyLive,
      checks: {
        isActualForecast: isActualForecast === true,
        sourceLive: source === 'live_forecast',
        dateMatchLive: dateMatchSource === 'live_forecast' || dateMatchSource === 'api-forecast'
      }
    });

    if (isDefinitelyLive) {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Everything else is historical/seasonal
    if (source === 'seasonal' || dateMatchSource === 'seasonal-estimate') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on seasonal weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using seasonal weather patterns for this date'
      };
    }

    // Default: Historical
    return {
      text: '📊 Historical Average',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      explanation: 'Based on historical weather patterns',
      showTooltip: true,
      tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
    };
  }, [isActualForecast, source, dateMatchSource, cityName]);

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
