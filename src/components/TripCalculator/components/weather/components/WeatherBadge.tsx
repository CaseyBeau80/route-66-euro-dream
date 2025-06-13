
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
  // FIXED: Simplified and more reliable badge logic
  console.log('🔧 FIXED: WeatherBadge ENHANCED DEBUG for', cityName, {
    receivedProps: {
      source,
      isActualForecast,
      dateMatchSource,
      cityName
    },
    propTypes: {
      sourceType: typeof source,
      isActualForecastType: typeof isActualForecast,
      dateMatchSourceType: typeof dateMatchSource
    },
    timestamp: new Date().toISOString()
  });

  // FIXED: Simplified badge logic with clear decision flow
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    // Primary check: isActualForecast takes precedence
    if (isActualForecast === true) {
      console.log('✅ FIXED: WeatherBadge LIVE FORECAST badge (isActualForecast=true) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Secondary check: source property
    if (source === 'live_forecast') {
      console.log('✅ FIXED: WeatherBadge LIVE FORECAST badge (source=live_forecast) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Tertiary check: dateMatchSource
    if (dateMatchSource === 'live_forecast') {
      console.log('✅ FIXED: WeatherBadge LIVE FORECAST badge (dateMatchSource=live_forecast) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Default: Historical/Seasonal Average
    console.log('📊 FIXED: WeatherBadge HISTORICAL/SEASONAL badge for', cityName, {
      decision: 'historical_average',
      source,
      dateMatchSource,
      isActualForecast
    });

    return {
      text: '📊 Seasonal Average',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      explanation: 'Based on historical weather patterns',
      showTooltip: true,
      tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
    };
  }, [isActualForecast, source, dateMatchSource, cityName]);

  // Log final badge configuration
  console.log('🔧 FIXED: WeatherBadge FINAL CONFIG for', cityName, {
    badgeText: getBadgeConfig.text,
    showTooltip: getBadgeConfig.showTooltip,
    isLiveBadge: getBadgeConfig.text.includes('Live Forecast'),
    decisionFactors: {
      isActualForecast,
      source,
      dateMatchSource
    }
  });

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
