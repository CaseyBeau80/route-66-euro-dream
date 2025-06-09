
import React from 'react';
import EnhancedWeatherLoading from './EnhancedWeatherLoading';
import WeatherDataDisplay from './WeatherDataDisplay';
import WeatherErrorStates from './WeatherErrorStates';
import WeatherApiKeyPrompt from './WeatherApiKeyPrompt';
import WeatherLoadingStates from './WeatherLoadingStates';

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

  // PRIORITY 1: Show centralized weather display if we have weather data
  // This will handle validation and display logic internally
  if (weather) {
    console.log(`✨ Using centralized weather display for ${segmentEndCity}`);
    return (
      <WeatherDataDisplay 
        weather={weather}
        segmentDate={segmentDate}
        segmentEndCity={segmentEndCity}
        isSharedView={isSharedView}
        error={error}
        retryCount={retryCount}
      />
    );
  }

  // PRIORITY 2: Handle error states with API key available
  if (error && hasApiKey) {
    return (
      <WeatherErrorStates
        error={error}
        hasApiKey={hasApiKey}
        retryCount={retryCount}
        segmentEndCity={segmentEndCity}
        segmentDate={segmentDate}
        isWithinForecastRange={isWithinForecastRange}
        isSharedView={isSharedView}
        onRetry={onRetry}
      />
    );
  }

  // PRIORITY 3: Handle no API key scenarios
  if (!hasApiKey) {
    return (
      <WeatherApiKeyPrompt
        segmentEndCity={segmentEndCity}
        segmentDate={segmentDate}
        isWithinForecastRange={isWithinForecastRange}
        isSharedView={isSharedView}
        onApiKeySet={onApiKeySet}
      />
    );
  }

  // PRIORITY 4 & 5: Loading states and fallbacks
  return (
    <WeatherLoadingStates
      hasApiKey={hasApiKey}
      segmentDate={segmentDate}
      isWithinForecastRange={isWithinForecastRange}
      segmentEndCity={segmentEndCity}
    />
  );
};

export default SegmentWeatherContent;
