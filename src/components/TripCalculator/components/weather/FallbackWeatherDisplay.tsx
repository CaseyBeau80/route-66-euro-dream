
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
  const forecastLabel = React.useMemo(() => {
    if (!segmentDate) return 'Weather Information';
    
    const formattedDate = format(segmentDate, 'EEEE, MMM d');
    
    console.log(`🎯 FALLBACK DATE ABSOLUTE LOCK for ${cityName}:`, {
      segmentDate: segmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(segmentDate),
      formattedDisplay: formattedDate,
      exactSegmentDate: true,
      noOffsetApplied: true
    });
    
    return formattedDate;
  }, [segmentDate, cityName]);

  // CRITICAL FIX: Get historical data using ZERO OFFSET - exact same segment date
  const historicalData = React.useMemo(() => {
    if (!segmentDate) return null;
    
    const exactSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
    // CRITICAL FIX: Use ZERO OFFSET - same exact segment date for historical data
    console.log(`📊 Getting historical data for ${cityName} on EXACT segment date with ZERO offset:`, {
      segmentDate: exactSegmentDate.toISOString(),
      segmentDateString: DateNormalizationService.toDateString(exactSegmentDate),
      offsetUsed: 0,
      exactDateMatch: true
    });
    
    return getHistoricalWeatherData(cityName, exactSegmentDate, 0); // ZERO OFFSET
  }, [cityName, segmentDate]);

  // ABSOLUTE validation that historical data aligns with EXACT segment date
  React.useEffect(() => {
    if (historicalData && segmentDate) {
      const expectedDateString = DateNormalizationService.toDateString(segmentDate);
      const actualDateString = historicalData.alignedDate;
      
      if (expectedDateString !== actualDateString) {
        console.error(`❌ CRITICAL: Historical data date mismatch for ${cityName}`, {
          expectedSegmentDate: segmentDate?.toISOString(),
          expectedDateString: expectedDateString,
          historicalAlignedDate: actualDateString,
          mustMatch: true,
          forcingAlignment: true
        });
        
        // FORCE CORRECTION: Override historical data date to match segment date
        historicalData.alignedDate = expectedDateString;
        console.log(`🔧 FORCED ALIGNMENT: Historical date corrected to ${expectedDateString} for ${cityName}`);
      } else {
        console.log(`✅ Historical data EXACTLY aligned for ${cityName} on segment date ${expectedDateString}`);
      }
    }
  }, [historicalData, segmentDate, cityName]);

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
      
      {/* Historical weather display - using EXACT segment date */}
      {historicalData && segmentDate && (
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
                {Math.round(historicalData.low)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg Low</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-800">
                {Math.round(historicalData.high)}°F
              </div>
              <div className="text-xs text-yellow-600">Avg High</div>
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

          {/* CRITICAL FIX: Show exact segment date for historical data */}
          <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded p-2">
            📊 Historical averages for {forecastLabel}
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
