
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
  // SIMPLIFIED LOGIC: Use isActualForecast as the single source of truth
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    console.log('🏷️ WeatherBadge SIMPLIFIED LOGIC for', cityName, {
      isActualForecast,
      source,
      dateMatchSource,
      decision: isActualForecast === true ? 'LIVE_FORECAST' : 'HISTORICAL_AVERAGE'
    });

    // SIMPLE RULE: If isActualForecast is explicitly true, show live forecast
    if (isActualForecast === true) {
      console.log('✅ WeatherBadge: LIVE FORECAST (isActualForecast=true)');
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // SIMPLE RULE: Everything else is historical/seasonal
    console.log('📊 WeatherBadge: HISTORICAL AVERAGE (isActualForecast!=true)');
    return {
      text: '📊 Seasonal Average',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
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
