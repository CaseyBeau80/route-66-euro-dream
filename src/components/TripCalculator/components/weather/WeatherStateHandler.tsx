
import React from 'react';
import WeatherLoadingState from './components/WeatherLoadingState';
import WeatherErrorState from './components/WeatherErrorState';
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
    return (
      <WeatherLoadingState
        cityName={segmentEndCity}
        segmentDate={segmentDate}
      />
    );
  }

  // Handle service unavailable state
  if (retryCount > 2) {
    return (
      <WeatherErrorState
        cityName={segmentEndCity}
        error={error || 'Weather service unavailable after multiple attempts'}
        onRetry={onRetry}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  return <>{children}</>;
};

export default WeatherStateHandler;
