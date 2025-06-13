
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
  source: 'live_forecast' | 'historical_fallback';
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
    console.log('🏷️ WeatherBadge: Enhanced badge logic for', cityName, {
      source,
      isActualForecast,
      dateMatchSource
    });

    // Primary check: Use dateMatchInfo.source as the source of truth
    if (dateMatchSource === 'live_forecast') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } 
    
    // If dateMatchSource indicates fallback or historical data
    if (dateMatchSource === 'historical_fallback' || dateMatchSource === 'seasonal_fallback') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast not available for current day; using historical weather'
      };
    }

    // Fallback to explicit source prop if dateMatchSource is not available
    if (source === 'live_forecast') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else if (source === 'historical_fallback') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }

    // Final fallback logic for legacy data without explicit source
    if (isActualForecast === true && 
        (dateMatchSource === 'api-forecast' || dateMatchSource === 'enhanced-fallback')) {
      console.log('🏷️ Legacy fallback: Live forecast detected', { cityName, source: dateMatchSource });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else {
      console.log('🏷️ Legacy fallback: Historical data detected', { cityName, isActualForecast });
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }
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
