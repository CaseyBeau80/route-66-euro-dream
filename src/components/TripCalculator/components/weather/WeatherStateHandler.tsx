
import React from 'react';
import { DateNormalizationService } from './DateNormalizationService';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherStateHandlerProps {
  loading: boolean;
  retryCount: number;
  error: string | null;
  segmentEndCity: string;
  segmentDate: Date | null;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  children: React.ReactNode;
}

const WeatherStateHandler: React.FC<WeatherStateHandlerProps> = ({
  loading,
  retryCount,
  error,
  segmentEndCity,
  segmentDate,
  onRetry,
  isSharedView = false,
  isPDFExport = false,
  children
}) => {
  console.log('🔍 WeatherStateHandler ENHANCED CHECK for', segmentEndCity, ':', {
    loading,
    retryCount,
    hasError: !!error,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    willProceedToChildren: !loading && retryCount <= 2 && !!segmentDate,
    decision: 'Enhanced logic - will not block on missing date'
  });

  // Show loading state
  if (loading) {
    console.log(`⏳ Loading weather for ${segmentEndCity}`);
    return (
      <div className="bg-blue-50 rounded border border-blue-200 p-3 text-center">
        <div className="text-sm text-blue-600 mb-2">
          🌤️ Getting weather for {segmentEndCity}...
        </div>
        {segmentDate && (
          <div className="text-xs text-blue-500">
            Checking forecast for {DateNormalizationService.toDateString(segmentDate)}
          </div>
        )}
      </div>
    );
  }

  // Handle service unavailable state - only after multiple retries AND with significant errors
  if (retryCount > 2 && error && error.includes('failed') || error && error.includes('timeout')) {
    console.log(`❌ Service unavailable for ${segmentEndCity} after ${retryCount} retries with error: ${error}`);
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'Weather service unavailable after multiple attempts'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // CRITICAL FIX: Don't block rendering just because segmentDate is missing
  // Let the children components handle missing dates appropriately
  if (!segmentDate) {
    console.warn(`⚠️ Missing segment date for ${segmentEndCity} - passing to children to handle gracefully`);
    // Still pass to children - they can show appropriate fallbacks
  }

  console.log(`✅ WeatherStateHandler: Proceeding to weather display for ${segmentEndCity}`, {
    hasSegmentDate: !!segmentDate,
    allowedToProceed: true
  });
  
  return <>{children}</>;
};

export default WeatherStateHandler;
