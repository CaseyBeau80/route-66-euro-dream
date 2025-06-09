
import React from 'react';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';

interface WeatherApiKeyPromptProps {
  segmentEndCity: string;
  segmentDate: Date | null;
  isWithinForecastRange: boolean;
  isSharedView: boolean;
  onApiKeySet: () => void;
}

const WeatherApiKeyPrompt: React.FC<WeatherApiKeyPromptProps> = ({
  segmentEndCity,
  segmentDate,
  isWithinForecastRange,
  isSharedView,
  onApiKeySet
}) => {
  console.log(`🔑 No API key for ${segmentEndCity}, showing appropriate messaging`);
  
  if (segmentDate) {
    if (isSharedView) {
      // In shared view, show enhanced messaging without API key input
      if (isWithinForecastRange) {
        return (
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <strong className="text-yellow-800">Seasonal Weather Estimate</strong>
              </div>
              <p className="text-yellow-700 text-xs">
                Live forecast available with OpenWeatherMap API key. Showing seasonal patterns for now.
              </p>
            </div>
            <SeasonalWeatherDisplay 
              segmentDate={segmentDate} 
              cityName={segmentEndCity}
              compact={true}
            />
          </div>
        );
      } else {
        // Beyond forecast range - seasonal is the best we can do anyway
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
    } else {
      // In normal view, show seasonal weather with option to add API key
      return (
        <div className="space-y-3">
          <SeasonalWeatherDisplay 
            segmentDate={segmentDate} 
            cityName={segmentEndCity}
            compact={true}
          />
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p className="text-yellow-800 mb-2">
              <strong>Want live weather forecasts?</strong> 
              {isWithinForecastRange 
                ? ` This date is within the 5-day forecast window!`
                : ` Add your OpenWeatherMap API key:`
              }
            </p>
            <EnhancedWeatherApiKeyInput 
              onApiKeySet={onApiKeySet}
              cityName={segmentEndCity}
            />
          </div>
        </div>
      );
    }
  }
  
  if (isSharedView) {
    // In shared view without date, show simple message
    return (
      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }
  
  // No date available in normal view
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="mb-3 text-sm text-blue-800">
        <p className="font-semibold">Weather API Key Required</p>
        <p>Enter your OpenWeatherMap API key to see weather information for {segmentEndCity}</p>
      </div>
      <EnhancedWeatherApiKeyInput 
        onApiKeySet={onApiKeySet}
        cityName={segmentEndCity}
      />
    </div>
  );
};

export default WeatherApiKeyPrompt;
