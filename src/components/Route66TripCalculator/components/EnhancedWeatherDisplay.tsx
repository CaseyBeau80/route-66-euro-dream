
import React from 'react';
import { WeatherData, WeatherFetchResult } from '@/services/CentralizedWeatherService';

interface EnhancedWeatherDisplayProps {
  weatherResult: WeatherFetchResult;
  segmentDate: Date;
  cityName: string;
  onRetry?: () => void;
}

const EnhancedWeatherDisplay: React.FC<EnhancedWeatherDisplayProps> = ({
  weatherResult,
  segmentDate,
  cityName,
  onRetry
}) => {
  const { weather, source, debugInfo, fetchTime } = weatherResult;

  if (!weather) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
        <div className="text-red-600 text-2xl mb-1">⚠️</div>
        <p className="text-xs text-red-700 font-medium">Weather data unavailable</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-red-600 hover:text-red-800 underline mt-1"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isLive = source === 'live_api' && weather.isActualForecast;
  const containerClass = isLive
    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";

  const getSourceLabel = () => {
    if (isLive) {
      return '🟢 Live Weather Forecast';
    } else {
      return '📊 Seasonal Weather Average';
    }
  };

  const getSourceBadge = () => {
    if (isLive) {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white font-medium">
          ✨ Live Forecast
        </span>
      );
    } else {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-600 text-white font-medium">
          📊 Seasonal Average
        </span>
      );
    }
  };

  return (
    <div className={`${containerClass} border rounded-lg p-4 space-y-3`}>
      {/* Header with date and source */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {formatDate(segmentDate)}
        </div>
        <div className="flex items-center gap-1">
          {getSourceBadge()}
        </div>
      </div>

      {/* Weather content */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{weather.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-800">
              {weather.temperature}°F
            </span>
            {weather.highTemp && weather.lowTemp && (
              <span className="text-sm text-gray-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </span>
            )}
          </div>
          <div className="text-sm text-gray-700 capitalize mb-1">
            {weather.description}
          </div>
          <div className="text-xs font-medium text-gray-600">
            {getSourceLabel()}
          </div>
        </div>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="text-center">
          <div className="font-medium">Humidity</div>
          <div>{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Wind</div>
          <div>{weather.windSpeed} mph</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Rain</div>
          <div>{weather.precipitationChance}%</div>
        </div>
      </div>

      {/* Debug info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
            <div>API Key Available: {debugInfo.apiKeyAvailable ? '✅' : '❌'}</div>
            <div>Days from Today: {debugInfo.daysFromToday}</div>
            <div>Within Forecast Range: {debugInfo.withinForecastRange ? '✅' : '❌'}</div>
            <div>Fetch Time: {fetchTime}ms</div>
            {debugInfo.geoSuccess !== undefined && (
              <div>Geocoding: {debugInfo.geoSuccess ? '✅' : '❌'}</div>
            )}
            {debugInfo.apiCallSuccess !== undefined && (
              <div>API Call: {debugInfo.apiCallSuccess ? '✅' : '❌'}</div>
            )}
            {debugInfo.fallbackReason && (
              <div>Fallback Reason: {debugInfo.fallbackReason}</div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default EnhancedWeatherDisplay;
