
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
  // PLAN IMPLEMENTATION: Enhanced debugging with defensive logic
  console.log('🔧 PLAN: WeatherBadge ENHANCED DEBUG for', cityName, {
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
    hasSource: !!source,
    hasDateMatchSource: !!dateMatchSource,
    timestamp: new Date().toISOString()
  });

  // PLAN IMPLEMENTATION: Defensive logic with multiple fallback strategies
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    // Primary check: Use isActualForecast if explicitly true
    if (isActualForecast === true) {
      console.log('✅ PLAN: WeatherBadge LIVE FORECAST badge (isActualForecast=true) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Secondary check: Use source property if available
    if (source === 'live_forecast') {
      console.log('✅ PLAN: WeatherBadge LIVE FORECAST badge (source=live_forecast) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Tertiary check: Use dateMatchSource if available
    if (dateMatchSource === 'live_forecast') {
      console.log('✅ PLAN: WeatherBadge LIVE FORECAST badge (dateMatchSource=live_forecast) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // Default: Historical/Seasonal Average
    const isHistorical = source === 'historical_fallback' || dateMatchSource === 'historical_fallback';
    const isSeasonal = source === 'seasonal' || dateMatchSource === 'seasonal-estimate';
    
    console.log('📊 PLAN: WeatherBadge HISTORICAL/SEASONAL badge for', cityName, {
      decision: 'historical_average',
      source,
      dateMatchSource,
      isHistorical,
      isSeasonal
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
  console.log('🔧 PLAN: WeatherBadge FINAL CONFIG for', cityName, {
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
