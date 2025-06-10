
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
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
  console.log('🌤️ SegmentWeatherContent render:', {
    segmentEndCity,
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    isSharedView,
    isPDFExport
  });

  // CRITICAL: Enhanced validation that segment date is being used consistently across all components
  React.useEffect(() => {
    if (segmentDate) {
      const segmentDateString = DateNormalizationService.toDateString(segmentDate);
      console.log(`🎯 SEGMENT DATE ABSOLUTE LOCK for ${segmentEndCity}:`, {
        segmentDate: segmentDate.toISOString(),
        segmentDateString,
        mustMatchExactly: true,
        noOffsets: true,
        allComponentsMustAlign: true
      });

      // Validate weather data alignment if present
      if (weather && weather.dateMatchInfo) {
        const isAligned = DateNormalizationService.validateDateAlignment(
          new Date(weather.dateMatchInfo.requestedDate),
          segmentDate,
          `WeatherContent-${segmentEndCity}`
        );
        
        if (!isAligned && weather.dateMatchInfo.source !== 'seasonal-estimate') {
          console.warn(`⚠️ Weather data misalignment detected for ${segmentEndCity}, but using segment date for display:`, {
            weatherRequestedDate: weather.dateMatchInfo.requestedDate,
            segmentDateString,
            overridingWithSegmentDate: true
          });
        }
      }
    }
  }, [segmentDate, segmentEndCity, weather]);

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

  // Show weather data or fallback - both components now use exact segment date
  if (weather) {
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

  // Show fallback display for errors or no data - uses exact segment date
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || undefined}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default SegmentWeatherContent;
