
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

  // Validate weather data with enhanced debugging
  const validation = React.useMemo(() => {
    if (!weather) {
      console.log(`❌ SegmentWeatherContent: No weather data for ${segmentEndCity}`);
      return null;
    }
    
    const result = validateWeatherData(weather, segmentEndCity, segmentDate);
    console.log(`🎯 SegmentWeatherContent validation for ${segmentEndCity}:`, result);
    return result;
  }, [weather, segmentEndCity, segmentDate]);

  const displayType = React.useMemo(() => {
    if (!validation) {
      console.log(`❌ SegmentWeatherContent: No validation for ${segmentEndCity}, showing loading`);
      return 'loading';
    }
    
    const type = getWeatherDisplayType(validation, error, retryCount, weather);
    console.log(`🎯 SegmentWeatherContent display type for ${segmentEndCity}:`, type);
    return type;
  }, [validation, error, retryCount, weather, segmentEndCity]);

  // Log segment date information
  React.useEffect(() => {
    if (segmentDate) {
      const segmentDateString = DateNormalizationService.toDateString(segmentDate);
      console.log(`🎯 CRITICAL SEGMENT DATE for ${segmentEndCity}:`, {
        segmentDate: segmentDate.toISOString(),
        segmentDateString,
        daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        validation,
        displayType
      });
    }
  }, [segmentDate, segmentEndCity, validation, displayType]);

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
  if (displayType === 'service-unavailable' || retryCount > 2) {
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

  // CRITICAL: Show weather data if we have ANY data, regardless of validation
  if (weather) {
    const hasBasicData = !!(weather.temperature || weather.highTemp || weather.lowTemp) && !!weather.description;
    
    console.log(`🎯 CRITICAL WEATHER DISPLAY DECISION for ${segmentEndCity}:`, {
      hasWeather: true,
      hasBasicData,
      validationPassed: validation?.isValid,
      displayType,
      forceDisplay: hasBasicData
    });

    if (hasBasicData || validation?.isValid) {
      console.log(`✅ DISPLAYING WEATHER for ${segmentEndCity}`);
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
  }

  // Show fallback display for errors or invalid data
  console.log(`❌ SegmentWeatherContent: Fallback display for ${segmentEndCity}`);
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
