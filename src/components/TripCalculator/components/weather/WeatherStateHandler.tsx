
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
  // Handle missing segment date
  if (!segmentDate) {
    console.warn(`❌ Missing segment date for ${segmentEndCity}`);
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

  // Handle service unavailable state
  if (retryCount > 2) {
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

  return <>{children}</>;
};

export default WeatherStateHandler;
