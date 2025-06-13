
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WeatherTypeDetector } from '../utils/WeatherTypeDetector';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
  console.log('🎯 FIXED: WeatherBadge for', cityName, {
    source,
    isActualForecast,
    dateMatchSource
  });

  // Create a minimal weather object for the WeatherTypeDetector
  const weatherData: ForecastWeatherData = {
    source,
    isActualForecast,
    dateMatchInfo: { 
      source: (dateMatchSource as "live_forecast" | "historical_fallback" | "api-forecast" | "enhanced-fallback" | "seasonal-estimate") || 'historical_fallback'
    },
    temperature: 0, // Not used for type detection
    description: '', // Not used for type detection
    icon: '', // Not used for type detection
    humidity: null,
    windSpeed: null,
    precipitationChance: null,
    highTemp: null,
    lowTemp: null
  };

  // FIXED: Use centralized WeatherTypeDetector for consistent badge logic
  const weatherType = WeatherTypeDetector.detectWeatherType(weatherData);

  console.log('🎯 FIXED: WeatherBadge using WeatherTypeDetector result:', {
    cityName,
    weatherType,
    decision: weatherType.isLiveForecast ? 'LIVE_FORECAST' : 'HISTORICAL_DATA'
  });

  if (weatherType.isLiveForecast) {
    return (
      <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
        📡 Live Forecast
      </div>
    );
  }

  // For all other cases (historical, seasonal, fallback), show historical data badge
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
            📊 Historical Data
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Live forecast unavailable - using historical weather patterns</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WeatherBadge;
