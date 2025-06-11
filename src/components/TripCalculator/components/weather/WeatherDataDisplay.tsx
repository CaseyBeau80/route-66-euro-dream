
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
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
  console.log('🌤️ ENHANCED WeatherDataDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    hasWeather: !!weather,
    isActualForecast: weather?.isActualForecast,
    hasError: !!error,
    isSharedView,
    isPDFExport,
    weatherSource: weather?.dateMatchInfo?.source,
    weatherMatchType: weather?.dateMatchInfo?.matchType
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

  // ENHANCED: Use strict validation to determine display type
  const validation = validateWeatherData(weather, cityName, segmentDate);
  const displayType = getWeatherDisplayType(validation, error, 0, weather);
  
  console.log(`🎯 ENHANCED Display decision for ${cityName}:`, {
    displayType,
    validation,
    canShowLiveForecast: validation.canShowLiveForecast,
    hasCompleteData: validation.hasCompleteData
  });

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

  // ENHANCED: Determine styling based on validated display type
  const isLiveForecast = displayType === 'live-forecast';
  const isSeasonalEstimate = displayType === 'seasonal-estimate';
  const isServiceUnavailable = displayType === 'service-unavailable';
  
  // Apply styling based on validated weather type
  const bgClass = isLiveForecast ? 'bg-blue-50 border-blue-200' : 
                 isSeasonalEstimate ? 'bg-yellow-50 border-yellow-200' :
                 'bg-red-50 border-red-200';
  const textClass = isLiveForecast ? 'text-blue-800' : 
                   isSeasonalEstimate ? 'text-yellow-800' :
                   'text-red-800';
  const labelClass = isLiveForecast ? 'text-blue-600 bg-blue-100' : 
                    isSeasonalEstimate ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100';

  // ENHANCED: Get temperature values with better fallback logic and validation
  const highTemp = weather.highTemp && weather.highTemp > 0 ? weather.highTemp : 
                  (weather.temperature && weather.temperature > 0 ? weather.temperature : 0);
  const lowTemp = weather.lowTemp && weather.lowTemp > 0 ? weather.lowTemp : 
                 (weather.temperature && weather.temperature > 0 ? weather.temperature : 0);

  // If no valid temperatures, show fallback
  if (highTemp === 0 && lowTemp === 0) {
    console.warn(`❌ No valid temperatures for ${cityName}, showing fallback`);
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error="Invalid temperature data"
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>
      
      {/* ENHANCED: Temperature display with validation */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round(lowTemp)}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : isSeasonalEstimate ? 'text-yellow-600' : 'text-red-600'}`}>
            {isLiveForecast ? 'Low' : 'Avg Low'}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${textClass}`}>
            {Math.round(highTemp)}°F
          </div>
          <div className={`text-xs ${isLiveForecast ? 'text-blue-600' : isSeasonalEstimate ? 'text-yellow-600' : 'text-red-600'}`}>
            {isLiveForecast ? 'High' : 'Avg High'}
          </div>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${isLiveForecast ? 'border-blue-200' : isSeasonalEstimate ? 'border-yellow-200' : 'border-red-200'}`}>
        <div className={`text-sm mb-2 capitalize ${isLiveForecast ? 'text-blue-700' : isSeasonalEstimate ? 'text-yellow-700' : 'text-red-700'}`}>
          {weather.description || 'Weather information'}
        </div>
        <div className={`flex justify-between text-xs ${isLiveForecast ? 'text-blue-600' : isSeasonalEstimate ? 'text-yellow-600' : 'text-red-600'}`}>
          <span>💧 {weather.precipitationChance || 0}%</span>
          <span>💨 {Math.round(weather.windSpeed || 0)} mph</span>
          <span>💦 {weather.humidity || 0}%</span>
        </div>
      </div>

      {/* ENHANCED STATUS INDICATOR: Shows the EXACT segment date and validated weather type */}
      <div className={`mt-2 text-xs rounded p-2 ${isLiveForecast ? 'text-blue-500 bg-blue-100' : isSeasonalEstimate ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100'}`}>
        {isLiveForecast ? (
          <>✅ Live forecast for {forecastLabel} 
          {validation.dataQuality === 'excellent' ? ' (exact match)' : 
           validation.dataQuality === 'good' ? ' (close match)' : ' (forecast data)'}
          </>
        ) : isSeasonalEstimate ? (
          `📊 Historical averages for ${forecastLabel}`
        ) : (
          `❌ Weather service error for ${forecastLabel}`
        )}
      </div>

      {/* ENHANCED: Show validation warnings if any */}
      {validation.warnings.length > 0 && !isSharedView && !isPDFExport && (
        <div className="mt-2 text-xs text-gray-600">
          {validation.warnings.map((warning, index) => (
            <div key={index}>⚠️ {warning}</div>
          ))}
        </div>
      )}

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
