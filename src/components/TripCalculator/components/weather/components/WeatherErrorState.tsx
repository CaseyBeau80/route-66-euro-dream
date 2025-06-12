
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
  return (
    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">
      <div className="flex items-center justify-between">
        <span>❌ {error}</span>
        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherErrorState;
