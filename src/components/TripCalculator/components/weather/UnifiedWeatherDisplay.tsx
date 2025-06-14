
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
  // SIMPLIFIED: Direct check for live weather - no complicated logic
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;

  console.log('🔥 SIMPLIFIED: UnifiedWeatherDisplay - DIRECT CHECK:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    temperature: weather.temperature,
    isSharedView,
    simplifiedCheck: true
  });

  // FORCED STYLING: Use simple inline styles to override any CSS conflicts
  const containerStyle = isLiveForecast ? {
    backgroundColor: '#dcfce7', // green-100
    borderColor: '#bbf7d0', // green-200
    color: '#166534' // green-800
  } : {
    backgroundColor: '#fef3c7', // amber-100
    borderColor: '#fde68a', // amber-200
    color: '#92400e' // amber-800
  };

  const badgeStyle = isLiveForecast ? {
    backgroundColor: '#dcfce7', // green-100
    color: '#166534', // green-800
    borderColor: '#bbf7d0' // green-200
  } : {
    backgroundColor: '#fef3c7', // amber-100
    color: '#92400e', // amber-800
    borderColor: '#fde68a' // amber-200
  };

  const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
  const badgeText = isLiveForecast ? '✨ Current live forecast' : '📊 Based on historical patterns';
  const sourceColor = isLiveForecast ? '#059669' : '#d97706';

  console.log('🔥 SIMPLIFIED: Applying forced styling:', {
    cityName,
    isLiveForecast,
    containerBg: containerStyle.backgroundColor,
    sourceLabel,
    forcedStyling: true
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

  return (
    <div 
      className="rounded-lg p-4 border relative"
      style={containerStyle}
    >
      {/* Debug Overlay */}
      <div className="absolute top-0 right-0 bg-black bg-opacity-95 text-white p-2 text-xs rounded-bl z-50 max-w-xs">
        <div className="font-bold mb-1">🔥 SIMPLIFIED: {cityName}</div>
        <div className={`mb-1 font-bold ${isLiveForecast ? 'text-green-400' : 'text-yellow-400'}`}>
          {isLiveForecast ? '🟢 SIMPLIFIED: LIVE' : '🟡 SIMPLIFIED: HISTORICAL'}
        </div>
        <div>Source: {weather.source}</div>
        <div>ActualForecast: {String(weather.isActualForecast)}</div>
        <div>Direct Check: {String(isLiveForecast)}</div>
        <div className={isLiveForecast ? 'text-green-400' : 'text-yellow-400'}>
          Forced Style: {isLiveForecast ? 'GREEN' : 'AMBER'}
        </div>
        <div>View: {isSharedView ? 'SHARED' : 'PREVIEW'}</div>
        <div>Temp: {weather.temperature}°F</div>
      </div>

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className="text-xs font-medium"
          style={{ color: sourceColor }}
        >
          {sourceLabel}
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

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span 
          className="inline-block text-xs px-2 py-1 rounded-full font-medium border"
          style={badgeStyle}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};

export default UnifiedWeatherDisplay;
