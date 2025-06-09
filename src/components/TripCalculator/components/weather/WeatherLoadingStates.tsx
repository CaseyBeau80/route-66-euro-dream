
import React from 'react';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';

interface WeatherLoadingStatesProps {
  hasApiKey: boolean;
  segmentDate: Date | null;
  isWithinForecastRange: boolean;
  segmentEndCity: string;
}

const WeatherLoadingStates: React.FC<WeatherLoadingStatesProps> = ({
  hasApiKey,
  segmentDate,
  isWithinForecastRange,
  segmentEndCity
}) => {
  // API key available but no weather data yet - show loading state while fetching
  if (hasApiKey && segmentDate && isWithinForecastRange) {
    console.log(`🌱 API key available, waiting for forecast data for ${segmentEndCity}`);
    return (
      <div className="space-y-3">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>🔮 Loading Forecast:</strong> 
          Fetching live weather data from OpenWeatherMap...
        </div>
        <div className="text-center p-3">
          <div className="animate-pulse text-gray-500 text-sm">
            Getting weather forecast...
          </div>
        </div>
      </div>
    );
  }

  // Show seasonal fallback when API key is available but date is beyond forecast range
  if (hasApiKey && segmentDate && !isWithinForecastRange) {
    console.log(`📊 Date beyond forecast range for ${segmentEndCity}, showing seasonal data`);
    return (
      <div className="space-y-2">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>📊 Seasonal Estimate:</strong> Date is beyond 5-day forecast window.
        </div>
        <SeasonalWeatherDisplay 
          segmentDate={segmentDate} 
          cityName={segmentEndCity}
          compact={true}
        />
      </div>
    );
  }

  // Default message when no date is set
  console.log(`📅 No date set for ${segmentEndCity}, showing prompt message`);
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-400 text-3xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">
        Weather information will appear when a trip start date is set
      </p>
    </div>
  );
};

export default WeatherLoadingStates;
