
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
  if (!isVisible || !weather?.dateMatchInfo) {
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

  return (
    <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-xs space-y-1">
      <div className="font-semibold text-gray-700 mb-1">
        🔍 Date Match Debug - {segmentEndCity}
      </div>
      
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
      
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getMatchTypeColor(dateMatchInfo.matchType)}`}>
        <span>{getMatchTypeIcon(dateMatchInfo.matchType)}</span>
        <span className="font-semibold capitalize">{dateMatchInfo.matchType} Match</span>
      </div>
      
      {weather.isActualForecast && (
        <div className="text-green-600 text-xs">
          ✅ Live forecast data from OpenWeatherMap
        </div>
      )}
      
      {!weather.isActualForecast && (
        <div className="text-orange-600 text-xs">
          📊 Seasonal/historical data fallback
        </div>
      )}
    </div>
  );
};

export default WeatherDateMatchDebug;
