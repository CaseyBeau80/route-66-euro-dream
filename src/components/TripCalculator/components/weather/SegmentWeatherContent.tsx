
import React from 'react';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';
import EnhancedWeatherLoading from './EnhancedWeatherLoading';
import CurrentWeatherDisplay from './CurrentWeatherDisplay';
import WeatherFallback from './WeatherFallback';
import WeatherError from './WeatherError';
import SeasonalWeatherDisplay from './SeasonalWeatherDisplay';

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
  console.log(`🎨 Rendering content for ${segmentEndCity}:`, {
    hasApiKey,
    loading,
    error,
    hasWeather: !!weather,
    retryCount
  });

  // No API key - show input
  if (!hasApiKey) {
    return (
      <EnhancedWeatherApiKeyInput 
        onApiKeySet={onApiKeySet}
        cityName={segmentEndCity}
      />
    );
  }

  // Loading state
  if (loading) {
    return <EnhancedWeatherLoading onTimeout={onTimeout} />;
  }

  // Show weather data if available
  if (weather) {
    console.log(`✨ Displaying weather for ${segmentEndCity}:`, weather);
    return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
  }

  // Show fallback for repeated errors
  if (error && (retryCount >= 2 || error.includes('timeout'))) {
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
    return <WeatherError error={error} />;
  }

  // Show seasonal fallback
  if (segmentDate) {
    return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segmentEndCity} />;
  }

  // Default message
  return (
    <div className="text-sm text-gray-500 italic">
      Set a trip start date to see weather information
    </div>
  );
};

export default SegmentWeatherContent;
