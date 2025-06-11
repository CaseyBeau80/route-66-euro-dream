
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { validateWeatherData, getWeatherDisplayType } from './WeatherValidationService';
import { WeatherDataDebugger } from './WeatherDataDebugger';
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
  console.log('🌤️ CRITICAL SegmentWeatherContent render for', segmentEndCity, ':', {
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    isSharedView,
    isPDFExport,
    retryCount
  });

  // CRITICAL: Log raw weather data when available
  React.useEffect(() => {
    if (weather) {
      console.log(`🔍 CRITICAL RAW WEATHER DATA for ${segmentEndCity}:`, {
        fullWeatherObject: weather,
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        description: weather.description,
        isActualForecast: weather.isActualForecast,
        dateMatchInfo: weather.dateMatchInfo
      });
    }
  }, [weather, segmentEndCity]);

  // Show API key setup if no key available
  if (!hasApiKey) {
    console.log(`❌ SegmentWeatherContent: No API key for ${segmentEndCity}`);
    return (
      <ApiKeySetup 
        onApiKeySet={onApiKeySet}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Check for missing segment date
  if (!segmentDate) {
    console.warn(`❌ SegmentWeatherContent: Missing segment date for ${segmentEndCity}`);
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={null}
        onRetry={onRetry}
        error="Missing trip start date - please set a trip start date to see weather forecasts"
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // Show loading state
  if (loading) {
    console.log(`⏳ SegmentWeatherContent: Loading weather for ${segmentEndCity}`);
    return (
      <div className="bg-blue-50 rounded border border-blue-200 p-3 text-center">
        <div className="text-sm text-blue-600 mb-2">
          🌤️ Getting weather for {segmentEndCity}...
        </div>
        <div className="text-xs text-blue-500">
          Checking forecast for {DateNormalizationService.toDateString(segmentDate)}
        </div>
      </div>
    );
  }

  // Handle service unavailable state
  if (retryCount > 2) {
    console.log(`❌ SegmentWeatherContent: Service unavailable for ${segmentEndCity}`);
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

  // CRITICAL FIX: Simplified weather display logic - bypass complex validation
  if (weather) {
    // Direct check for displayable data - much simpler than validation chain
    const hasAnyTemp = !!(weather.temperature || weather.highTemp || weather.lowTemp);
    const hasDescription = !!weather.description;
    const canDisplay = hasAnyTemp && hasDescription;
    
    console.log(`🎯 SIMPLIFIED DISPLAY CHECK for ${segmentEndCity}:`, {
      hasAnyTemp,
      hasDescription,
      canDisplay,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      bypassingComplexValidation: true
    });

    // If we have basic displayable data, show it immediately
    if (canDisplay) {
      console.log(`✅ DIRECT DISPLAY: Showing weather for ${segmentEndCity} - bypassing validation`);
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
    } else {
      console.log(`❌ DIRECT DISPLAY: Cannot display weather for ${segmentEndCity} - missing basic data`, {
        hasAnyTemp,
        hasDescription,
        weatherKeys: Object.keys(weather)
      });
    }
  }

  // Show fallback display for errors or invalid data
  console.log(`❌ SegmentWeatherContent: Fallback display for ${segmentEndCity}`);
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || (weather ? 'Weather data incomplete' : 'No weather data available')}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default SegmentWeatherContent;
