
import React from 'react';
import { RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHistoricalWeatherData } from './SeasonalWeatherService';
import { format } from 'date-fns';
import { DateNormalizationService } from './DateNormalizationService';

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
  console.log('📊 FallbackWeatherDisplay render:', {
    cityName,
    segmentDate: segmentDate?.toISOString(),
    hasError: !!error,
    showRetryButton
  });

  const isNetworkError = error?.includes('Failed to fetch') || error?.includes('timeout');

  // CRITICAL FIX: ALWAYS use the EXACT segmentDate for the forecast label
  const forecastLabel = segmentDate 
    ? `${format(segmentDate, 'EEEE, MMM d')}`
    : 'Weather Information';

  // Get historical data ONLY if segmentDate is available - pass EXACT normalized date with -1 day offset
  const historicalData = React.useMemo(() => {
    if (!segmentDate) return null;
    
    const normalizedDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    // CRITICAL FIX: Use -1 day offset for historical data (day before segment date)
    return getHistoricalWeatherData(cityName, normalizedDate, -1);
  }, [cityName, segmentDate]);

  // Calculate the historical date for validation (segment date - 1 day)
  const expectedHistoricalDate = React.useMemo(() => {
    if (!segmentDate) return null;
    const normalizedDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    return new Date(normalizedDate.getTime() - (24 * 60 * 60 * 1000)); // -1 day
  }, [segmentDate]);

  // STRICT validation that historical data aligns with EXACT historical date (segment date - 1)
  React.useEffect(() => {
    if (historicalData && expectedHistoricalDate) {
      const expectedHistoricalDateString = DateNormalizationService.toDateString(expectedHistoricalDate);
      const actualDateString = historicalData.alignedDate;
      
      if (expectedHistoricalDateString !== actualDateString) {
        console.error(`❌ CRITICAL: Historical data date mismatch for ${cityName}`, {
          expectedSegmentDate: segmentDate?.toISOString(),
          expectedHistoricalDate: expectedHistoricalDateString,
          historicalAlignedDate: actualDateString,
          strictValidationFailed: true
        });
      } else {
        console.log(`✅ Historical data EXACTLY aligned for ${cityName} on historical date ${expectedHistoricalDateString} (day before segment)`);
      }
    }
  }, [historicalData, expectedHistoricalDate, cityName, segmentDate]);

  return (
    <div className="space-y-3">
      {/* Error notice with retry option */}
      {error && showRetryButton && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded border border-orange-200">
          <Wifi className="h-5 w-5 text-orange-600" />
          <div className="flex-1 text-sm text-orange-800">
            <p className="font-semibold">
              {isNetworkError ? 'Connection issue' : 'Weather service unavailable'}
            </p>
            <p className="text-xs">Showing historical averages for {forecastLabel}</p>
          </div>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              size="sm" 
              variant="outline"
              className="text-xs h-7"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}
      
      {/* Historical weather display - only if segment date is available */}
      {historicalData && segmentDate && expectedHistoricalDate && (
        <div className="bg-yellow-50 rounded border border-yellow-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-yellow-800">{cityName}</h5>
            <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
              {forecastLabel}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-800">
                {Math.round(historicalData.high)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg High</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-800">
                {Math.round(historicalData.low)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg Low</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <div className="text-sm text-yellow-700 mb-2 capitalize">
              {historicalData.condition}
            </div>
            <div className="flex justify-between text-xs text-yellow-600">
              <span>💧 {historicalData.precipitationChance}%</span>
              <span>💨 {Math.round(historicalData.windSpeed)} mph</span>
              <span>💦 {historicalData.humidity}%</span>
            </div>
          </div>

          {/* CRITICAL FIX: Show historical data disclaimer with offset info */}
          <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded p-2">
            📊 Historical averages for {format(expectedHistoricalDate, 'EEEE, MMM d')} (day before arrival)
          </div>
        </div>
      )}

      {/* Fallback when no segment date available */}
      {!segmentDate && (
        <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-500 mb-2">
            📊 No date specified
          </div>
          <div className="text-xs text-gray-400">
            Set a trip date for weather information
          </div>
        </div>
      )}

      {/* Fallback when segment date exists but no historical data */}
      {segmentDate && !historicalData && (
        <div className="bg-gray-50 rounded border border-gray-200 p-3 text-center">
          <div className="text-sm text-gray-500 mb-2">
            📊 No historical data for {forecastLabel}
          </div>
          <div className="text-xs text-gray-400">
            Historical weather patterns unavailable for this date
          </div>
        </div>
      )}
    </div>
  );
};

export default FallbackWeatherDisplay;
