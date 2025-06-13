
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
    console.log('🏷️ WeatherBadge: FIXED logic for', cityName, {
      source,
      isActualForecast,
      dateMatchSource,
      timestamp: new Date().toISOString()
    });

    // FIXED LOGIC: Check for live forecast first (most restrictive)
    if (dateMatchSource === 'live_forecast' && isActualForecast === true) {
      console.log('🏷️ WeatherBadge: LIVE FORECAST badge (strict validation passed)', { 
        cityName, 
        dateMatchSource,
        isActualForecast,
        reason: 'live_forecast_confirmed'
      });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // FIXED LOGIC: Check for historical/seasonal data
    if (dateMatchSource === 'historical_fallback' || source === 'seasonal') {
      console.log('🏷️ WeatherBadge: SEASONAL AVERAGE badge (historical data detected)', { 
        cityName, 
        dateMatchSource,
        source,
        reason: 'historical_or_seasonal_data'
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

    // FIXED LOGIC: Default to forecast unavailable for any other cases
    console.log('🏷️ WeatherBadge: FORECAST UNAVAILABLE badge (no valid source detected)', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource,
      reason: 'no_valid_source_detected'
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
