
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface UnifiedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherDisplay: React.FC<UnifiedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // Calculate if this is a reliable live forecast based on date range
  const today = new Date()
  const daysFromToday = Math.ceil((segmentDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  const isWithinReliableRange = daysFromToday >= 0 && daysFromToday <= 6
  
  // A forecast is only "LIVE" if it's from live_forecast source, isActualForecast is true, AND within reliable range
  const isLiveWeather = weather.source === 'live_forecast' && weather.isActualForecast === true && isWithinReliableRange
  
  console.log('🔥 UNIFIED FIXED: UnifiedWeatherDisplay with proper range validation:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    daysFromToday,
    isWithinReliableRange,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    finalIsLiveWeather: isLiveWeather,
    temperature: weather.temperature,
    description: weather.description,
    fixedLogic: true
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  // Determine styling based on forecast type
  const getDisplayConfig = () => {
    if (isLiveWeather) {
      return {
        containerClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        badgeClass: 'bg-green-100 text-green-700 border-green-200',
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: 'text-green-600',
        badgeText: '✨ Current live forecast',
        explanation: 'Updated within the last few hours'
      };
    } else if (isWithinReliableRange) {
      return {
        containerClass: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
        sourceLabel: '🟡 Estimated Forecast',
        sourceColor: 'text-amber-600',
        badgeText: '🔮 Weather pattern estimate',
        explanation: 'Based on weather trends and patterns'
      };
    } else {
      return {
        containerClass: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        sourceLabel: '📊 Seasonal Estimate',
        sourceColor: 'text-gray-600',
        badgeText: '📊 Long-range estimate',
        explanation: 'Forecasts 7+ days out are less reliable'
      };
    }
  };

  const config = getDisplayConfig();

  return (
    <div className={`${config.containerClass} rounded-lg p-4 border`}>
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${config.sourceColor}`}>
          {config.sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weatherIcon}</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(weather.temperature)}°F
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.description}
            </div>
          </div>
        </div>

        <div className="text-right">
          {weather.highTemp && weather.lowTemp && (
            <div className="text-sm text-gray-600">
              H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Weather Status Badge and Explanation */}
      <div className="mt-3 text-center">
        <div className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${config.badgeClass}`}>
          {config.badgeText}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {config.explanation}
        </div>
      </div>
    </div>
  );
};

export default UnifiedWeatherDisplay;
