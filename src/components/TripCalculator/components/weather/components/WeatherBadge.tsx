
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

  // FIXED: Enhanced badge logic with stricter live forecast validation
  const getBadgeConfig = React.useMemo((): BadgeConfig => {
    // CRITICAL FIX: More restrictive live forecast detection
    // Only show live forecast if ALL conditions are met:
    // 1. isActualForecast is explicitly true
    // 2. AND source indicates live forecast
    // 3. AND dateMatchSource confirms live forecast
    
    const isExplicitlyLive = isActualForecast === true;
    const hasLiveSource = source === 'live_forecast';
    const hasLiveDateMatch = dateMatchSource === 'live_forecast' || dateMatchSource === 'api-forecast';
    
    // STRICT VALIDATION: All three conditions must be true for live forecast
    const isValidLiveForecast = isExplicitlyLive && hasLiveSource && hasLiveDateMatch;
    
    console.log('🔧 FIXED: WeatherBadge STRICT VALIDATION for', cityName, {
      isExplicitlyLive,
      hasLiveSource,
      hasLiveDateMatch,
      isValidLiveForecast,
      finalDecision: isValidLiveForecast ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK'
    });

    if (isValidLiveForecast) {
      console.log('✅ FIXED: WeatherBadge LIVE FORECAST badge (all conditions met) for', cityName);
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // ENHANCED: Check for specific historical/seasonal sources
    if (source === 'seasonal' || dateMatchSource === 'seasonal-estimate') {
      console.log('📊 FIXED: WeatherBadge SEASONAL badge for', cityName);
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on seasonal weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using seasonal weather patterns for this date'
      };
    }

    // Default: Historical/Fallback
    console.log('📊 FIXED: WeatherBadge HISTORICAL FALLBACK badge for', cityName, {
      decision: 'historical_fallback_default',
      source,
      dateMatchSource,
      isActualForecast
    });

    return {
      text: '📊 Historical Average',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
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
    strictValidation: {
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
