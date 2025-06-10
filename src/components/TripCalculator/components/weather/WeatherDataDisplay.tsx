
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate?: Date | null;
  cityName: string;
  error?: string | null;
  onRetry?: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({ 
  weather, 
  segmentDate,
  cityName,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🌤️ WeatherDataDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasError: !!error,
    isSharedView,
    isPDFExport,
    requestedDate: weather?.dateMatchInfo?.requestedDate,
    matchedDate: weather?.dateMatchInfo?.matchedDate,
    matchType: weather?.dateMatchInfo?.matchType
  });

  // If there's an error or no weather data, show fallback
  if (error || !weather) {
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || undefined}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // ALWAYS use segmentDate for the forecast label - this is the key fix
  const forecastLabel = segmentDate 
    ? `${format(segmentDate, 'EEEE, MMM d')}`
    : 'Weather Information';

  // Determine if this is historical data vs live forecast
  const isHistorical = !weather.isActualForecast;
  const bgClass = isHistorical ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
  const textClass = isHistorical ? 'text-yellow-800' : 'text-blue-800';
  const labelClass = isHistorical ? 'text-yellow-700 bg-yellow-100' : 'text-blue-600 bg-blue-100';

  // Log date matching validation
  if (weather.dateMatchInfo && segmentDate) {
    const segmentDateString = segmentDate.toISOString().split('T')[0];
    const isExactMatch = weather.dateMatchInfo.requestedDate === segmentDateString;
    
    console.log(`📅 Date validation for ${cityName}:`, {
      segmentDateString,
      requestedDate: weather.dateMatchInfo.requestedDate,
      matchedDate: weather.dateMatchInfo.matchedDate,
      matchType: weather.dateMatchInfo.matchType,
      isExactMatch,
      forecastLabel
    });
  }

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round((weather.highTemp || weather.temperature || 0))}°F
          </div>
          <div className={`text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
            {isHistorical ? 'Avg High' : 'High'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round((weather.lowTemp || weather.temperature || 0))}°F
          </div>
          <div className={`text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
            {isHistorical ? 'Avg Low' : 'Low'}
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${isHistorical ? 'border-yellow-200' : 'border-blue-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isHistorical ? 'text-yellow-700' : 'text-blue-700'}`}>
          {weather.description}
        </div>
        <div className={`flex justify-between text-xs ${isHistorical ? 'text-yellow-600' : 'text-blue-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      {/* Status indicator with date match info */}
      <div className={`mt-2 text-xs rounded p-2 ${isHistorical ? 'text-yellow-600 bg-yellow-100' : 'text-blue-500 bg-blue-100'}`}>
        {isHistorical ? '📊 Historical seasonal averages' : 
         weather.dateMatchInfo?.matchType === 'exact' ? '✅ Live forecast (exact date match)' :
         weather.dateMatchInfo?.matchType === 'closest' ? `✅ Live forecast (${weather.dateMatchInfo.hoursOffset?.toFixed(0) || '0'}h offset)` :
         '✅ Live forecast data'
        }
      </div>

      {/* Retry button for errors in non-shared views */}
      {error && onRetry && !isSharedView && !isPDFExport && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
