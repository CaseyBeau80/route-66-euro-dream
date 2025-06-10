
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
    isPDFExport,
    weatherType: weather?.isActualForecast ? 'live-forecast' : 'historical-average'
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

  // CRITICAL FIX: ALWAYS use segmentDate for the forecast label to prevent date drift
  // This ensures the header shows the EXACT segment date regardless of weather data source
  const forecastLabel = segmentDate 
    ? `${format(segmentDate, 'EEEE, MMM d')}`
    : 'Weather Information';

  // ABSOLUTE validation for date alignment - force segment date display
  React.useEffect(() => {
    if (segmentDate) {
      const expectedDateString = DateNormalizationService.toDateString(segmentDate);
      
      console.log(`🎯 FORCING SEGMENT DATE DISPLAY for ${cityName}:`, {
        segmentDate: expectedDateString,
        displayLabel: forecastLabel,
        weatherSource: weather.isActualForecast ? 'live-forecast' : 'historical-average',
        absoluteDateLock: true,
        isPDFExport,
        isSharedView
      });

      // Log any date mismatches but always display the segment date
      if (weather.dateMatchInfo) {
        const { requestedDate, matchedDate, matchType, source } = weather.dateMatchInfo;
        if (requestedDate !== expectedDateString && source !== 'seasonal-estimate') {
          console.warn(`⚠️ Weather data internal mismatch for ${cityName} - BUT DISPLAYING SEGMENT DATE:`, {
            segmentDate: expectedDateString,
            requestedDate,
            matchedDate,
            matchType,
            source,
            displayingCorrectDate: forecastLabel,
            isPDFExport,
            isSharedView
          });
        }
      }
    }
  }, [segmentDate, weather.dateMatchInfo, cityName, forecastLabel, weather.isActualForecast, isPDFExport, isSharedView]);

  // PRIORITY: Live forecast takes absolute precedence over historical data
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

      {/* Status indicator shows ABSOLUTE segment date alignment */}
      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isLiveForecast ? (
          weather.dateMatchInfo?.matchType === 'exact' ? `✅ Live forecast for ${forecastLabel}` :
          weather.dateMatchInfo?.matchType === 'closest' ? `✅ Live forecast (${weather.dateMatchInfo.hoursOffset?.toFixed(0) || '0'}h offset)` :
          `✅ Live forecast for ${forecastLabel}`
        ) : (
          // CRITICAL FIX: Show historical data for the exact same date (no offset)
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
