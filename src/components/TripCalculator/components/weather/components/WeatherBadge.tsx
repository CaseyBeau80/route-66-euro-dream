
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
    console.log('🏷️ WeatherBadge: ENHANCED source detection for', cityName, {
      source,
      isActualForecast,
      dateMatchSource,
      timestamp: new Date().toISOString()
    });

    // ENHANCED STEP 1: Primary validation - Use dateMatchSource as definitive truth
    if (dateMatchSource === 'seasonal-estimate' || dateMatchSource === 'historical_fallback') {
      console.log('🏷️ WeatherBadge: HISTORICAL badge (dateMatchSource)', { cityName, dateMatchSource });
      return {
        text: '📊 Historical Average',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using historical weather patterns for this date'
      };
    }

    if (dateMatchSource === 'api-forecast' || dateMatchSource === 'enhanced-fallback') {
      console.log('🏷️ WeatherBadge: LIVE FORECAST badge (dateMatchSource)', { cityName, dateMatchSource });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // ENHANCED STEP 2: Secondary validation - Cross-check with explicit source and isActualForecast
    const isHistoricalBySource = source === 'historical_fallback';
    const isHistoricalByFlag = isActualForecast === false;
    const isLiveBySource = source === 'live_forecast';
    const isLiveByFlag = isActualForecast === true;

    // ENHANCED STEP 3: Use strict validation for live forecasts
    if (isLiveBySource && isLiveByFlag && !isHistoricalBySource && !isHistoricalByFlag) {
      console.log('🏷️ WeatherBadge: LIVE FORECAST badge (explicit validation)', { 
        cityName, 
        source, 
        isActualForecast,
        validation: 'strict_live_forecast' 
      });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    }

    // ENHANCED STEP 4: Default to historical for any ambiguous or historical indicators
    if (isHistoricalBySource || isHistoricalByFlag || !isLiveByFlag) {
      console.log('🏷️ WeatherBadge: HISTORICAL badge (fallback validation)', { 
        cityName, 
        source, 
        isActualForecast,
        reason: isHistoricalBySource ? 'historical_source' : isHistoricalByFlag ? 'historical_flag' : 'no_live_confirmation'
      });
      return {
        text: '📊 Historical Average',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        explanation: 'Based on historical weather patterns',
        showTooltip: true,
        tooltipMessage: 'Live forecast unavailable - using historical weather patterns'
      };
    }

    // ENHANCED STEP 5: Final fallback with warning
    console.warn('🏷️ WeatherBadge: UNCERTAIN source detected, defaulting to historical with warning', {
      cityName,
      source,
      isActualForecast,
      dateMatchSource,
      warning: 'unclear_weather_source'
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
