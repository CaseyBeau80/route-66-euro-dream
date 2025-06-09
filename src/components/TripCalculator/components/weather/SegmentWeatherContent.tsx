
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
    isSharedView,
    daysFromNow: segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null
  });

  // Calculate days from now for forecast eligibility
  const daysFromNow = segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  const isWithinForecastRange = daysFromNow !== null && daysFromNow >= 0 && daysFromNow <= 5;

  // Loading state
  if (loading) {
    console.log(`⏳ Loading weather for ${segmentEndCity}`);
    return <EnhancedWeatherLoading onTimeout={onTimeout} />;
  }

  // PRIORITY 1: Show live weather data if available (regardless of API key status display)
  if (weather) {
    console.log(`✨ Displaying weather for ${segmentEndCity}:`, weather);
    
    // Check if this is actual forecast data with real weather information
    if (weather.isActualForecast !== undefined) {
      const forecastWeather = weather as ForecastWeatherData;
      
      // Show live forecast data if we have actual forecast with valid temperatures
      if (forecastWeather.isActualForecast && 
          forecastWeather.highTemp !== undefined && 
          forecastWeather.lowTemp !== undefined &&
          forecastWeather.highTemp > 0 && 
          forecastWeather.lowTemp > 0) {
        
        console.log(`🔮 Showing live forecast for ${segmentEndCity}:`, {
          high: forecastWeather.highTemp,
          low: forecastWeather.lowTemp,
          description: forecastWeather.description
        });
        
        return (
          <div className="space-y-2">
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
              <strong>🔮 Live Forecast:</strong> Powered by OpenWeatherMap for {segmentDate?.toLocaleDateString()}
            </div>
            <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
          </div>
        );
      }
      
      // If forecast data exists but is marked as not actual forecast, show seasonal with note
      if (!forecastWeather.isActualForecast) {
        console.log(`📊 Forecast service returned seasonal data for ${segmentEndCity}`);
        return (
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>📊 Seasonal Estimate:</strong> Based on historical weather patterns
            </div>
            <ForecastWeatherDisplay weather={forecastWeather} segmentDate={segmentDate} />
          </div>
        );
      }
    } else {
      // Regular weather data (current weather)
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
    }
  }

  // PRIORITY 2: Handle error states with API key available
  if (error && hasApiKey) {
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
        <WeatherFallback 
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
  }

  // PRIORITY 3: Handle no API key scenarios
  if (!hasApiKey) {
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
  }

  // PRIORITY 4: API key available but no weather data yet - show loading state while fetching
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

  // PRIORITY 5: Show seasonal fallback when API key is available but date is beyond forecast range
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

export default SegmentWeatherContent;
