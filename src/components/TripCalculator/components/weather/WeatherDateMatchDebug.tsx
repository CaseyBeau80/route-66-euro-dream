
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherDateMatchDebugProps {
  weather: ForecastWeatherData;
  segmentDate: Date | null;
  segmentEndCity: string;
  isVisible?: boolean;
}

const WeatherDateMatchDebug: React.FC<WeatherDateMatchDebugProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  isVisible = false
}) => {
  if (!isVisible) {
    return null;
  }

  const { dateMatchInfo } = weather;
  const daysFromNow = segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'text-green-600 bg-green-50';
      case 'closest': return 'text-orange-600 bg-orange-50';
      case 'none': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact': return '🎯';
      case 'closest': return '📍';
      case 'none': return '❌';
      default: return '❓';
    }
  };

  // Enhanced debug information
  const debugInfo = {
    hasDateMatchInfo: !!dateMatchInfo,
    isActualForecast: weather.isActualForecast,
    hasHighTemp: weather.highTemp !== undefined,
    hasLowTemp: weather.lowTemp !== undefined,
    hasTemperature: weather.temperature !== undefined,
    hasForecast: !!weather.forecast?.length,
    forecastLength: weather.forecast?.length || 0,
    daysFromNow,
    isWithin5Days: daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5
  };

  return (
    <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-xs space-y-2">
      <div className="font-semibold text-gray-700 mb-2">
        🔍 Enhanced Weather Debug - {segmentEndCity}
      </div>
      
      {/* Date Match Information */}
      {dateMatchInfo ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Requested:</span>
            <div className="font-mono">{dateMatchInfo.requestedDate}</div>
          </div>
          
          <div>
            <span className="text-gray-600">Days from now:</span>
            <div className="font-mono">{daysFromNow}</div>
          </div>
          
          <div>
            <span className="text-gray-600">Matched:</span>
            <div className="font-mono">{dateMatchInfo.matchedDate}</div>
          </div>
          
          <div>
            <span className="text-gray-600">Offset:</span>
            <div className="font-mono">{dateMatchInfo.daysOffset} days</div>
          </div>
        </div>
      ) : (
        <div className="text-orange-600 text-xs">
          ⚠️ No dateMatchInfo available (using fallback validation)
        </div>
      )}
      
      {/* Match Type Badge */}
      {dateMatchInfo && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getMatchTypeColor(dateMatchInfo.matchType)}`}>
          <span>{getMatchTypeIcon(dateMatchInfo.matchType)}</span>
          <span className="font-semibold capitalize">{dateMatchInfo.matchType} Match</span>
        </div>
      )}
      
      {/* Forecast Type */}
      <div className="flex gap-2">
        {weather.isActualForecast ? (
          <div className="text-green-600 text-xs">
            ✅ Live forecast data from OpenWeatherMap
          </div>
        ) : (
          <div className="text-orange-600 text-xs">
            📊 Seasonal/historical data fallback
          </div>
        )}
      </div>
      
      {/* Enhanced Debug Data */}
      <div className="mt-2 p-2 bg-white rounded border text-xs">
        <div className="font-semibold text-gray-700 mb-1">Enhanced Debug Data:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>Has High/Low: {debugInfo.hasHighTemp && debugInfo.hasLowTemp ? '✅' : '❌'}</div>
          <div>Has Temperature: {debugInfo.hasTemperature ? '✅' : '❌'}</div>
          <div>Has Forecast Array: {debugInfo.hasForecast ? '✅' : '❌'}</div>
          <div>Forecast Length: {debugInfo.forecastLength}</div>
          <div>Within 5 Days: {debugInfo.isWithin5Days ? '✅' : '❌'}</div>
          <div>Actual Forecast: {debugInfo.isActualForecast ? '✅' : '❌'}</div>
        </div>
      </div>
      
      {/* Temperature Data */}
      {(weather.highTemp !== undefined || weather.lowTemp !== undefined || weather.temperature !== undefined) && (
        <div className="mt-2 p-2 bg-blue-50 rounded border text-xs">
          <div className="font-semibold text-blue-700 mb-1">Temperature Data:</div>
          <div className="space-y-1">
            {weather.highTemp !== undefined && (
              <div>High: {weather.highTemp}°F</div>
            )}
            {weather.lowTemp !== undefined && (
              <div>Low: {weather.lowTemp}°F</div>
            )}
            {weather.temperature !== undefined && (
              <div>Avg: {weather.temperature}°F</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDateMatchDebug;
