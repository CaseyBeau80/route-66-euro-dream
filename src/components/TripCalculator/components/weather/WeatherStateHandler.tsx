
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
  console.log('🔍 WeatherStateHandler CRITICAL CHECK for', segmentEndCity, ':', {
    loading,
    retryCount,
    hasError: !!error,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    decision: 'Will determine...'
  });

  // Handle missing segment date - this is the KEY issue
  if (!segmentDate) {
    console.error(`❌ CRITICAL: Missing segment date for ${segmentEndCity} - this causes "unavailable" message`);
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={null}
        onRetry={onRetry}
        error="Missing trip start date - please set a trip start date to see weather forecasts"
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // Show loading state
  if (loading) {
    console.log(`⏳ Loading weather for ${segmentEndCity}`);
    return (
      <div className="bg-blue-50 rounded border border-blue-200 p-3 text-center">
        <div className="text-sm text-blue-600 mb-2">
          🌤️ Getting weather for {segmentEndCity}...
        </div>
        <div className="text-xs text-blue-500">
          Checking forecast for {DateNormalizationService.toDateString(segmentDate)}
        </div>
      </div>
    );
  }

  // Handle service unavailable state - only after multiple retries
  if (retryCount > 2 && error) {
    console.log(`❌ Service unavailable for ${segmentEndCity} after ${retryCount} retries`);
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

  console.log(`✅ WeatherStateHandler: Proceeding to weather display for ${segmentEndCity}`);
  return <>{children}</>;
};

export default WeatherStateHandler;
