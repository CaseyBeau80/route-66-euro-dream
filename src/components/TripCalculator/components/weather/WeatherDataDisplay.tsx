
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';
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
    isPDFExport
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

  // CRITICAL FIX: ALWAYS use the EXACT segmentDate for ALL labels and displays
  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    
    // Use the EXACT segmentDate for display - no offset, no drift
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`🎯 WEATHER LABEL ABSOLUTE LOCK for ${cityName}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(segmentDate),
      formattedDisplay: formattedDate,
      absoluteMatch: true,
      noOffsetApplied: true
    });
    
    return formattedDate;
  }, [segmentDate, cityName]);

  // Determine weather type for styling
  const isLiveForecast = weather.isActualForecast === true;
  const weatherType = isLiveForecast ? 'live-forecast' : 'historical-average';
  
  // Apply styling based on weather type
  const bgClass = isLiveForecast ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';
  const textClass = isLiveForecast ? 'text-blue-800' : 'text-yellow-800';
  const labelClass = isLiveForecast ? 'text-blue-600 bg-blue-100' : 'text-yellow-700 bg-yellow-100';

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
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            {isLiveForecast ? 'High' : 'Avg High'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round((weather.lowTemp || weather.temperature || 0))}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
            {isLiveForecast ? 'Low' : 'Avg Low'}
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${isLiveForecast ? 'border-blue-200' : 'border-yellow-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isLiveForecast ? 'text-blue-700' : 'text-yellow-700'}`}>
          {weather.description}
        </div>
        <div className={`flex justify-between text-xs ${isLiveForecast ? 'text-blue-600' : 'text-yellow-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      {/* CRITICAL FIX: Status indicator ALWAYS shows the EXACT segment date */}
      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          `✅ Live forecast for ${forecastLabel}`
        ) : (
          `📊 Historical averages for ${forecastLabel}`
        )}
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
