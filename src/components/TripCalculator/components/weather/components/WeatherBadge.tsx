
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
    console.log('🏷️ WeatherBadge: FIXED source detection for', cityName, {
      source,
      isActualForecast,
      dateMatchSource,
      timestamp: new Date().toISOString()
    });

    // FIXED STEP 1: Check for any historical indicators first (highest priority)
    const isHistoricalBySource = source === 'historical_fallback';
    const isHistoricalByFlag = isActualForecast === false;
    const isHistoricalByDateMatch = dateMatchSource === 'historical_fallback' || 
                                    dateMatchSource === 'seasonal-estimate';

    // FIXED STEP 2: If ANY indicator points to historical, show historical badge
    if (isHistoricalBySource || isHistoricalByFlag || isHistoricalByDateMatch) {
      console.log('🏷️ WeatherBadge: HISTORICAL badge (any historical indicator found)', { 
        cityName, 
        isHistoricalBySource,
        isHistoricalByFlag,
        isHistoricalByDateMatch,
        reason: 'any_historical_indicator'
      });
      return {
        text: '📊 Historical Average',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
      };
    }

    // FIXED STEP 3: Only show live forecast if ALL indicators point to live data
    const isLiveBySource = source === 'live_forecast';
    const isLiveByFlag = isActualForecast === true;
    const isLiveByDateMatch = dateMatchSource === 'api-forecast' || 
                              dateMatchSource === 'enhanced-fallback';

    if (isLiveBySource && isLiveByFlag && isLiveByDateMatch) {
      console.log('🏷️ WeatherBadge: LIVE FORECAST badge (all indicators confirm live)', { 
        cityName, 
        isLiveBySource,
        isLiveByFlag,
        isLiveByDateMatch,
        reason: 'all_live_indicators_confirmed'
      });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // FIXED STEP 4: Default to historical for any ambiguous cases
    console.warn('🏷️ WeatherBadge: AMBIGUOUS source, defaulting to historical', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource,
      reason: 'ambiguous_or_uncertain_data'
    });

    return {
      text: '📊 Historical Average',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      explanation: 'Weather data source uncertain',
      showTooltip: true,
      tooltipMessage: 'Weather data source could not be determined - displaying historical estimates'
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
