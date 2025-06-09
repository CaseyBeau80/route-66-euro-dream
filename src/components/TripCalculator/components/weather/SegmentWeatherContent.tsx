
import React from 'react';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';
import EnhancedWeatherLoading from './EnhancedWeatherLoading';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import ForecastWeatherDisplay from './ForecastWeatherDisplay';
import WeatherFallback from './WeatherFallback';
import WeatherError from './WeatherError';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface SegmentWeatherContentProps {
  hasApiKey: boolean;
  loading: boolean;
  weather: any;
  error: string | null;
  retryCount: number;
  segmentEndCity: string;
  segmentDate: Date | null;
  onApiKeySet: () => void;
  onTimeout: () => void;
  onRetry: () => void;
  isSharedView?: boolean;
}

const SegmentWeatherContent: React.FC<SegmentWeatherContentProps> = ({
  hasApiKey,
  loading,
  weather,
  error,
  retryCount,
  segmentEndCity,
  segmentDate,
  onApiKeySet,
  onTimeout,
  onRetry,
  isSharedView = false
}) => {
  console.log(`🎨 SegmentWeatherContent for ${segmentEndCity}:`, {
    hasApiKey,
    loading,
    error,
    hasWeather: !!weather,
    retryCount,
    weatherType: weather?.isActualForecast !== undefined ? 'forecast' : 'regular',
    segmentDate: segmentDate?.toISOString(),
    isSharedView
  });

  // In shared view, always show seasonal weather as fallback when no API key
  if (!hasApiKey) {
    console.log(`🔑 No API key for ${segmentEndCity}, showing seasonal fallback`);
    
    if (segmentDate) {
      if (isSharedView) {
        // In shared view, just show seasonal weather without API key input
        return (
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>Seasonal Estimate:</strong> Weather forecast requires API key configuration.
            </div>
            <SeasonalWeatherDisplay 
              segmentDate={segmentDate} 
              cityName={segmentEndCity}
              compact={true}
            />
          </div>
        );
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
                <strong>Want live weather forecasts?</strong> Add your OpenWeatherMap API key below:
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
  }

  // Loading state
  if (loading) {
    console.log(`⏳ Loading weather for ${segmentEndCity}`);
    return <EnhancedWeatherLoading onTimeout={onTimeout} />;
  }

  // Show weather data if available
  if (weather) {
    console.log(`✨ Displaying weather for ${segmentEndCity}:`, weather);
    
    // Check if this is forecast data (has isActualForecast property)
    if (weather.isActualForecast !== undefined) {
      return <ForecastWeatherDisplay weather={weather as ForecastWeatherData} segmentDate={segmentDate} />;
    } else {
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
    }
  }

  // Show fallback for repeated errors - use seasonal data if date is available
  if (error && (retryCount >= 2 || error.includes('timeout'))) {
    console.log(`🔄 Showing fallback for ${segmentEndCity} after ${retryCount} retries`);
    
    if (segmentDate) {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
            <strong>Weather Service Unavailable:</strong> Showing seasonal estimates instead of live forecasts.
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
                Try again for live forecast
              </button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <WeatherFallback 
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={isSharedView ? undefined : onRetry}
        error={error}
      />
    );
  }

  // Show error
  if (error) {
    console.log(`❌ Showing error for ${segmentEndCity}:`, error);
    return <WeatherError error={error} />;
  }

  // Show seasonal fallback when date is available but no weather data
  if (segmentDate) {
    console.log(`🌱 Showing seasonal weather for ${segmentEndCity}`);
    return (
      <div className="space-y-3">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>Seasonal Estimate:</strong> Live forecast will appear when available.
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

export default SegmentWeatherContent;
