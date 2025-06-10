
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from './DateNormalizationService';
import { format } from 'date-fns';

interface LiveWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
  daysFromNow?: number | null;
}

const LiveWeatherDisplay: React.FC<LiveWeatherDisplayProps> = ({ 
  weather, 
  segmentDate
}) => {
  console.log('🌤️ LiveWeatherDisplay render:', {
    cityName: weather.cityName,
    segmentDate: segmentDate?.toISOString(),
    isActualForecast: weather.isActualForecast,
    hasValidTemps: !!(weather.highTemp && weather.lowTemp)
  });

  // Generate forecast label based on actual segment date
  const forecastLabel = segmentDate 
    ? `Forecast for ${format(segmentDate, 'EEEE, MMM d')}`
    : 'Current Weather';

  return (
    <div className="bg-blue-50 rounded border border-blue-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-blue-800">{weather.cityName}</h5>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-700">
            {Math.round((weather.highTemp || weather.temperature || 0))}°F
          </div>
          <div className="text-xs text-blue-600">High</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-700">
            {Math.round((weather.lowTemp || weather.temperature || 0))}°F
          </div>
          <div className="text-xs text-blue-600">Low</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="text-sm text-blue-700 mb-2 capitalize">
          {weather.description}
        </div>
        <div className="flex justify-between text-xs text-blue-600">
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      {weather.isActualForecast && (
        <div className="mt-2 text-xs text-blue-500 bg-blue-100 rounded p-2">
          ✅ Live forecast data
        </div>
      )}
    </div>
  );
};

export default LiveWeatherDisplay;
