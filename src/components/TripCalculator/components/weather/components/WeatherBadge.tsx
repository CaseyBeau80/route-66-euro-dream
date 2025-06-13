
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
    console.log('🏷️ WeatherBadge: Enhanced source-based badge logic for', cityName, {
      source,
      isActualForecast,
      dateMatchSource
    });

    // Primary check: Use dateMatchInfo.source as the definitive source of truth
    if (dateMatchSource === 'seasonal-estimate') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using seasonal weather patterns for this date'
      };
    }

    if (dateMatchSource === 'historical_fallback') {
      return {
        text: '📊 Historical Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather data',
        showTooltip: true,
        tooltipMessage: 'Live forecast not available - using historical weather patterns'
      };
    }

    if (dateMatchSource === 'api-forecast' || dateMatchSource === 'enhanced-fallback') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    if (dateMatchSource === 'live_forecast') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Fallback logic based on explicit source property
    if (source === 'historical_fallback') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using seasonal weather patterns'
      };
    }

    if (source === 'live_forecast' && isActualForecast === true) {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Final fallback - treat any uncertain data as seasonal to avoid misleading users
    console.warn('🏷️ WeatherBadge: Uncertain source detected, defaulting to seasonal', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource
    });

    return {
      text: '📊 Seasonal Average',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      explanation: 'Weather data source uncertain',
      showTooltip: true,
      tooltipMessage: 'Weather data source could not be determined - displaying seasonal estimates'
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
