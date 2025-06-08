
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
  onRetry
}) => {
  console.log(`🎨 SegmentWeatherContent for ${segmentEndCity}:`, {
    hasApiKey,
    loading,
    error,
    hasWeather: !!weather,
    retryCount,
    weatherType: weather?.isActualForecast !== undefined ? 'forecast' : 'regular',
    segmentDate: segmentDate?.toISOString()
  });

  // No API key - show input prominently
  if (!hasApiKey) {
    console.log(`🔑 No API key for ${segmentEndCity}, showing input`);
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

  // Show fallback for repeated errors
  if (error && (retryCount >= 2 || error.includes('timeout'))) {
    console.log(`🔄 Showing fallback for ${segmentEndCity} after ${retryCount} retries`);
    return (
      <WeatherFallback 
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error}
      />
    );
  }

  // Show error
  if (error) {
    console.log(`❌ Showing error for ${segmentEndCity}:`, error);
    return <WeatherError error={error} />;
  }

  // Show seasonal fallback when date is available but no API key or data
  if (segmentDate) {
    console.log(`🌱 Showing seasonal weather for ${segmentEndCity}`);
    return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segmentEndCity} />;
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
