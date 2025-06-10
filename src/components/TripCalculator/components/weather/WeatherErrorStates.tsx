
import React from 'react';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';
import WeatherError from './WeatherError';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';

interface WeatherErrorStatesProps {
  error: string;
  hasApiKey: boolean;
  retryCount: number;
  segmentEndCity: string;
  segmentDate: Date | null;
  isWithinForecastRange: boolean;
  isSharedView: boolean;
  onRetry: () => void;
}

const WeatherErrorStates: React.FC<WeatherErrorStatesProps> = ({
  error,
  hasApiKey,
  retryCount,
  segmentEndCity,
  segmentDate,
  isWithinForecastRange,
  isSharedView,
  onRetry
}) => {
  if (!hasApiKey) {
    return null; // Handled by parent component
  }

  // Show fallback for repeated errors - use seasonal data if date is available
  if (retryCount >= 2 || error.includes('timeout')) {
    console.log(`🔄 Showing fallback for ${segmentEndCity} after ${retryCount} retries`);
    
    if (segmentDate) {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
            <strong>Weather Service Unavailable:</strong> 
            {isWithinForecastRange 
              ? ` Live forecast temporarily unavailable. Showing seasonal estimates.`
              : ` Showing seasonal estimates instead of live forecasts.`
            }
          </div>
          <SeasonalWeatherDisplay 
            segmentDate={segmentDate} 
            cityName={segmentEndCity}
            compact={true}
          />
          {!isSharedView && (
            <div className="text-center">
              <button
                onClick={onRetry}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {isWithinForecastRange ? 'Try again for live forecast' : 'Try again'}
              </button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <FallbackWeatherDisplay 
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={isSharedView ? undefined : onRetry}
        error={error}
      />
    );
  }

  // Show error for first attempt
  console.log(`❌ Showing error for ${segmentEndCity}:`, error);
  return <WeatherError error={error} />;
};

export default WeatherErrorStates;
