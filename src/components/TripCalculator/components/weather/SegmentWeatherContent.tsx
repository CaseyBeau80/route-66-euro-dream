
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
  console.log('🚨 CRITICAL SegmentWeatherContent DEBUG for', segmentEndCity, ':', {
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    retryCount,
    weatherData: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast
    } : null
  });

  // FORCE LOG: Complete weather data analysis
  if (weather) {
    console.log('🔍 FORCE LOG - COMPLETE WEATHER DATA ANALYSIS for', segmentEndCity, ':', {
      // Basic data existence
      hasTemperature: !!weather.temperature,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      hasDescription: !!weather.description,
      
      // Actual values
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      
      // Forecast flags
      isActualForecast: weather.isActualForecast,
      dateMatchInfo: weather.dateMatchInfo,
      dateMatchSource: weather.dateMatchInfo?.source,
      
      // Validation readiness
      hasAnyTemp: !!(weather.temperature || weather.highTemp || weather.lowTemp),
      hasDescription: !!weather.description,
      basicDisplayReady: !!(weather.temperature || weather.highTemp || weather.lowTemp) && !!weather.description
    });
  }

  // Show API key setup if no key available
  if (!hasApiKey) {
    console.log(`❌ No API key for ${segmentEndCity}`);
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
    console.warn(`❌ Missing segment date for ${segmentEndCity}`);
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
    console.log(`⏳ Loading weather for ${segmentEndCity}`);
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
    console.log(`❌ Service unavailable for ${segmentEndCity} after ${retryCount} retries`);
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

  // CRITICAL: AGGRESSIVE WEATHER RENDERING - Show ANY available data
  if (weather) {
    console.log('🔍 FORCE LOG - AGGRESSIVE RENDER CHECK for', segmentEndCity, ':', {
      hasWeather: true,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchInfo: weather.dateMatchInfo
    });

    // ULTRA-PERMISSIVE: Show weather if we have ANY data at all
    const hasAnyTemperature = !!(weather.temperature || weather.highTemp || weather.lowTemp);
    const hasAnyDescription = !!weather.description;
    const hasMinimalData = hasAnyTemperature || hasAnyDescription;

    console.log('🎯 FORCE LOG - MINIMAL DATA CHECK for', segmentEndCity, ':', {
      hasAnyTemperature,
      hasAnyDescription,
      hasMinimalData,
      shouldRenderWeather: hasMinimalData
    });

    if (hasMinimalData) {
      console.log('✅ FORCE LOG - RENDERING WEATHER DATA for', segmentEndCity);
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
      console.log('❌ FORCE LOG - NO MINIMAL DATA for', segmentEndCity, ':', {
        hasAnyTemperature,
        hasAnyDescription,
        actualTemperature: weather.temperature,
        actualHighTemp: weather.highTemp,
        actualLowTemp: weather.lowTemp,
        actualDescription: weather.description
      });
    }
  } else {
    console.log('❌ FORCE LOG - NO WEATHER OBJECT for', segmentEndCity);
  }

  // Show fallback display
  console.log(`🔄 FORCE LOG - SHOWING FALLBACK for ${segmentEndCity}`);
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
