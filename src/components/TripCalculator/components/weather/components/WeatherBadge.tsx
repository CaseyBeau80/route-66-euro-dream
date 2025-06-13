
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
    source: source === 'seasonal' ? 'historical_fallback' : source, // Convert seasonal to historical_fallback for the interface
    isActualForecast,
    dateMatchInfo: { 
      source: (dateMatchSource as "live_forecast" | "historical_fallback" | "api-forecast" | "enhanced-fallback" | "seasonal-estimate" | "fallback_historical_due_to_location_error") || 'historical_fallback',
      requestedDate: '',
      matchedDate: '',
      matchType: 'none',
      daysOffset: 0
    },
    temperature: 0,
    description: '',
    icon: '',
    humidity: 0,
    windSpeed: 0,
    precipitationChance: 0,
    highTemp: 0,
    lowTemp: 0,
    forecast: [],
    forecastDate: new Date(),
    cityName: cityName
  };

  // FIXED: Use centralized WeatherTypeDetector for consistent badge logic
  const weatherType = WeatherTypeDetector.detectWeatherType(weatherData);

  console.log('🎯 FIXED: WeatherBadge decision for', cityName, {
    inputData: { source, isActualForecast, dateMatchSource },
    weatherType: {
      isLiveForecast: weatherType.isLiveForecast,
      isHistoricalData: weatherType.isHistoricalData,
      displayLabel: weatherType.displayLabel,
      badgeType: weatherType.badgeType
    },
    finalDecision: weatherType.isLiveForecast ? 'LIVE_FORECAST_BADGE' : 'HISTORICAL_DATA_BADGE'
  });

  // Only show live forecast badge if WeatherTypeDetector confirms it's actually live
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
