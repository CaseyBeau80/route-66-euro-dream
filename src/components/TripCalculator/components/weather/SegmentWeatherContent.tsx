
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
import WeatherDataDisplay from './WeatherDataDisplay';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';
import ApiKeySetup from './ApiKeySetup';
import { DateNormalizationService } from './DateNormalizationService';

interface SegmentWeatherContentProps {
  hasApiKey: boolean;
  loading: boolean;
  weather: ForecastWeatherData | null;
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
  console.log('🌤️ ENHANCED SegmentWeatherContent render:', {
    segmentEndCity,
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    isSharedView,
    isPDFExport,
    retryCount
  });

  // ENHANCED: Validate weather data quality before rendering
  const validation = React.useMemo(() => {
    if (!weather) return null;
    return validateWeatherData(weather, segmentEndCity, segmentDate);
  }, [weather, segmentEndCity, segmentDate]);

  const displayType = React.useMemo(() => {
    if (!validation) return 'loading';
    return getWeatherDisplayType(validation, error, retryCount, weather);
  }, [validation, error, retryCount, weather]);

  // CRITICAL: Log the exact segment date being used
  React.useEffect(() => {
    if (segmentDate) {
      const segmentDateString = DateNormalizationService.toDateString(segmentDate);
      console.log(`🎯 ENHANCED SEGMENT DATE ABSOLUTE LOCK for ${segmentEndCity}:`, {
        segmentDate: segmentDate.toISOString(),
        segmentDateString,
        mustMatchExactly: true,
        noOffsets: true,
        allComponentsMustAlign: true,
        validation,
        displayType
      });
    }
  }, [segmentDate, segmentEndCity, validation, displayType]);

  // Show API key setup if no key available
  if (!hasApiKey) {
    return (
      <ApiKeySetup 
        onApiKeySet={onApiKeySet}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Show loading state with exact segment date
  if (loading) {
    return (
      <div className="bg-blue-50 rounded border border-blue-200 p-3 text-center">
        <div className="text-sm text-blue-600 mb-2">
          🌤️ Getting weather for {segmentEndCity}...
        </div>
        <div className="text-xs text-blue-500">
          {segmentDate && `Checking forecast for ${DateNormalizationService.toDateString(segmentDate)}`}
        </div>
      </div>
    );
  }

  // ENHANCED: Handle service unavailable state
  if (displayType === 'service-unavailable' || retryCount > 2) {
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'Weather service unavailable after multiple attempts'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // Show weather data with enhanced validation - both components now use exact segment date
  if (weather && validation?.isValid) {
    return (
      <WeatherDataDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segmentEndCity}
        error={error}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Show fallback display for errors or invalid data - uses exact segment date
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || (weather ? 'Weather data validation failed' : 'No weather data available')}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default SegmentWeatherContent;
