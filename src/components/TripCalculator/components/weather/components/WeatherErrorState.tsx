
import React from 'react';

interface WeatherErrorStateProps {
  cityName: string;
  error: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const WeatherErrorState: React.FC<WeatherErrorStateProps> = ({
  cityName,
  error,
  onRetry,
  showRetryButton = true
}) => {
  // Only show for true configuration errors, not forecast failures
  const isConfigurationError = error.includes('configuration') || error.includes('unavailable');
  
  if (!isConfigurationError) {
    // Don't show red error for forecast failures - fallback weather should be shown instead
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-700">
      <div className="flex items-center justify-between">
        <span className="text-sm">⚠️ {error}</span>
        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherErrorState;
