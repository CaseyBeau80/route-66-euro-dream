
import React from 'react';
import { Cloud } from 'lucide-react';
import { format } from 'date-fns';

interface FallbackWeatherDisplayProps {
  cityName: string;
  segmentDate: Date | null;
  onRetry?: () => void;
  error: string;
  showRetryButton?: boolean;
}

const FallbackWeatherDisplay: React.FC<FallbackWeatherDisplayProps> = ({
  cityName,
  segmentDate,
  onRetry,
  error,
  showRetryButton = true
}) => {
  console.log('🚨 FallbackWeatherDisplay for', cityName, ':', {
    error,
    hasSegmentDate: !!segmentDate,
    showRetryButton
  });

  const dateLabel = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Date not set';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-gray-700">{cityName}</h5>
        <span className="text-xs px-2 py-1 rounded text-gray-500 bg-gray-100">
          {dateLabel}
        </span>
      </div>
      
      <div className="text-center py-4">
        <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast unavailable
        </div>
        <div className="text-xs text-gray-500 mb-3">
          {error}
        </div>
        
        {showRetryButton && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default FallbackWeatherDisplay;
