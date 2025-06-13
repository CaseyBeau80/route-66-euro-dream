
import React from 'react';

interface BadgeConfig {
  text: string;
  bgColor: string;
  textColor: string;
  explanation: string;
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
    console.log('🏷️ WeatherBadge: Badge logic for', cityName, {
      source,
      isActualForecast,
      dateMatchSource
    });

    // Use explicit source for accurate badge display
    if (source === 'live_forecast') {
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else if (source === 'historical_fallback') {
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }

    // Fallback logic for legacy data without explicit source
    if (isActualForecast === true && 
        (dateMatchSource === 'api-forecast' || dateMatchSource === 'enhanced-fallback')) {
      console.log('🏷️ Legacy fallback: Live forecast detected', { cityName, source: dateMatchSource });
      return {
        text: '📡 Live Forecast',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        explanation: 'Real-time weather data from API'
      };
    } else {
      console.log('🏷️ Legacy fallback: Historical data detected', { cityName, isActualForecast });
      return {
        text: '📊 Seasonal Average',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        explanation: 'Based on historical weather patterns'
      };
    }
  }, [source, isActualForecast, dateMatchSource, cityName]);

  return (
    <div className={`text-xs px-2 py-1 rounded ${getBadgeConfig.bgColor} ${getBadgeConfig.textColor}`}>
      {getBadgeConfig.text}
    </div>
  );
};

export default WeatherBadge;
