
import React from 'react';
import WeatherDataDisplay from './WeatherDataDisplay';
import WeatherApiKeyInput from './WeatherApiKeyInput';
import WeatherLoadingPlaceholder from './WeatherLoadingPlaceholder';
import WeatherErrorDisplay from './WeatherErrorDisplay';

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
  isPDFExport?: boolean;
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
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log(`🌤️ SegmentWeatherContent: Rendering for ${segmentEndCity}`, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    isSharedView,
    isPDFExport,
    segmentDate: segmentDate?.toISOString()
  });

  // **PDF EXPORT**: Enhanced logging for PDF weather rendering
  if (isPDFExport) {
    console.log(`📄 PDF WEATHER: Rendering weather content for ${segmentEndCity}`, {
      hasApiKey,
      hasWeather: !!weather,
      isActualForecast: weather?.isActualForecast,
      hasDateMatchInfo: !!weather?.dateMatchInfo,
      loading,
      error
    });
  }

  // Show API key input if no key is available (except in shared view or PDF export)
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <WeatherApiKeyInput
        segmentEndCity={segmentEndCity}
        onApiKeySet={onApiKeySet}
      />
    );
  }

  // Show loading state
  if (loading && !weather) {
    return (
      <WeatherLoadingPlaceholder
        segmentEndCity={segmentEndCity}
        onTimeout={onTimeout}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Show error state
  if (error && retryCount <= 3) {
    return (
      <WeatherErrorDisplay
        error={error}
        retryCount={retryCount}
        segmentEndCity={segmentEndCity}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Show weather data if available
  if (weather) {
    return (
      <WeatherDataDisplay
        weather={weather}
        segmentDate={segmentDate}
        segmentEndCity={segmentEndCity}
        isSharedView={isSharedView}
        error={error}
        retryCount={retryCount}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Fallback state
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-400 text-2xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">
        {isPDFExport ? 'Weather information processing for PDF...' : 'Weather information not available'}
      </p>
      {isPDFExport && (
        <div className="text-xs text-gray-500 mt-2">
          Please check the live version for current weather conditions
        </div>
      )}
    </div>
  );
};

export default SegmentWeatherContent;
