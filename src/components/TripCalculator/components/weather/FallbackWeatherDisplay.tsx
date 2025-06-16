
import React from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { SeasonalWeatherGenerator } from './SeasonalWeatherGenerator';
import { UnifiedDateService } from '../../services/UnifiedDateService';

interface FallbackWeatherDisplayProps {
  cityName: string;
  segmentDate?: Date | null;
  onRetry?: () => void;
  error?: string;
  showRetryButton?: boolean;
}

const FallbackWeatherDisplay: React.FC<FallbackWeatherDisplayProps> = ({
  cityName,
  segmentDate,
  onRetry,
  error,
  showRetryButton = true
}) => {
  console.log('🔄 ENHANCED FallbackWeatherDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    error,
    showRetryButton
  });

  // Use exact segment date for display
  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`🎯 FALLBACK LABEL ABSOLUTE LOCK for ${cityName}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: UnifiedDateService.formatForApi(segmentDate),
      formattedDisplay: formattedDate,
      absoluteMatch: true
    });
    
    return formattedDate;
  }, [segmentDate, cityName]);

  // ENHANCED: Generate seasonal estimates for fallback
  const seasonalWeather = React.useMemo(() => {
    if (!segmentDate) return null;
    
    const month = segmentDate.getMonth();
    return {
      temperature: SeasonalWeatherGenerator.getSeasonalTemperature(month),
      description: SeasonalWeatherGenerator.getSeasonalDescription(month),
      humidity: SeasonalWeatherGenerator.getSeasonalHumidity(month),
      precipitation: SeasonalWeatherGenerator.getSeasonalPrecipitation(month)
    };
  }, [segmentDate]);

  // Determine if this is a weather service error or just using seasonal data
  const isServiceError = error && error.includes('error') || error && error.includes('failed');
  const isSeasonalFallback = !isServiceError && seasonalWeather;

  const bgClass = isServiceError ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
  const textClass = isServiceError ? 'text-red-800' : 'text-yellow-800';
  const labelClass = isServiceError ? 'text-red-600 bg-red-100' : 'text-yellow-700 bg-yellow-100';

  return (
    <div className={`rounded border p-3 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`font-semibold ${textClass}`}>{cityName}</h5>
        <span className={`text-xs px-2 py-1 rounded ${labelClass}`}>
          {forecastLabel}
        </span>
      </div>

      {/* Show seasonal weather if available and not a service error */}
      {isSeasonalFallback && seasonalWeather && (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="text-center">
              <div className={`text-lg font-bold ${textClass}`}>
                {Math.round(seasonalWeather.temperature - 10)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg Low</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${textClass}`}>
                {Math.round(seasonalWeather.temperature + 10)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg High</div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-yellow-200">
            <div className="text-sm mb-2 capitalize text-yellow-700">
              {seasonalWeather.description}
            </div>
            <div className="flex justify-between text-xs text-yellow-600">
              <span>💧 {seasonalWeather.precipitation}%</span>
              <span>💨 8 mph</span>
              <span>💦 {seasonalWeather.humidity}%</span>
            </div>
          </div>
        </>
      )}

      {/* Error message for service errors */}
      {isServiceError && (
        <div className="text-center py-4">
          <div className="text-sm text-red-600 mb-2">
            ⚠️ Weather service unavailable
          </div>
          <div className="text-xs text-red-500">
            {error}
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className={`mt-2 text-xs rounded p-2 ${isServiceError ? 'text-red-500 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
        {isServiceError ? (
          `❌ Weather service error for ${forecastLabel}`
        ) : (
          `📊 Historical averages for ${forecastLabel}`
        )}
      </div>

      {/* Retry button */}
      {showRetryButton && onRetry && (
        <div className="mt-3 text-center">
          <button
            onClick={onRetry}
            className={`inline-flex items-center gap-2 px-3 py-1 text-xs rounded ${
              isServiceError 
                ? 'text-red-600 bg-red-100 hover:bg-red-200 border border-red-200' 
                : 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default FallbackWeatherDisplay;
