
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
  // ENHANCED DEBUGGING: Log every single prop and decision
  console.log('🏷️ WeatherBadge ENHANCED DEBUG for', cityName, {
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

  // ULTRA SIMPLE LOGIC: Only show live forecast if isActualForecast is EXACTLY true
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    const isLive = isActualForecast === true;
    
    console.log('🏷️ WeatherBadge DECISION LOGIC for', cityName, {
      isActualForecast,
      isActualForecastStrictCheck: isActualForecast === true,
      decision: isLive ? 'LIVE_FORECAST' : 'HISTORICAL_AVERAGE',
      decisionReason: isLive ? 'isActualForecast_exactly_true' : 'isActualForecast_not_exactly_true'
    });

    if (isLive) {
      console.log('✅ WeatherBadge: LIVE FORECAST badge for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    console.log('📊 WeatherBadge: HISTORICAL AVERAGE badge for', cityName);
    return {
      text: '📊 Seasonal Average',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      explanation: 'Based on historical weather patterns',
      showTooltip: true,
      tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
    };
  }, [isActualForecast, cityName]);

  // Log final badge configuration
  console.log('🏷️ WeatherBadge FINAL CONFIG for', cityName, {
    badgeText: getBadgeConfig.text,
    showTooltip: getBadgeConfig.showTooltip,
    isLiveBadge: getBadgeConfig.text.includes('Live Forecast')
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
