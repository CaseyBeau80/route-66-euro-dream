
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherApiKeyHandler from './WeatherApiKeyHandler';
import WeatherStateHandler from './WeatherStateHandler';
import WeatherDisplayDecision from './WeatherDisplayDecision';

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
  // 🚨 DEBUG INJECTION: Component render logging
  console.log('🚨 DEBUG: SegmentWeatherContent RENDER', {
    segmentEndCity,
    segmentDate: segmentDate?.toISOString(),
    componentState: {
      hasApiKey,
      loading,
      hasWeather: !!weather,
      error,
      retryCount,
      isSharedView,
      isPDFExport
    },
    weatherData: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      isActualForecast: weather.isActualForecast,
      description: weather.description,
      hasMinimalData: !!(weather.temperature || weather.highTemp) && !!weather.description,
      source: weather.dateMatchInfo?.source
    } : null,
    renderDecision: {
      willRenderWeather: !!weather && !!segmentDate,
      hasSegmentDate: !!segmentDate,
      passesWeatherCheck: !!weather
    }
  });

  console.log('🚨 SegmentWeatherContent CRITICAL DEBUG for', segmentEndCity, ':', {
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    weatherObject: weather,
    hasError: !!error,
    retryCount,
    willRenderWeather: !!weather && !!segmentDate
  });

  // CRITICAL FIX: Add detailed forecast object logging
  console.log('📦 SegmentWeatherContent forecast object for', segmentEndCity, ':', {
    fullWeatherObject: weather,
    hasTemperatureData: !!(weather?.temperature || weather?.highTemp || weather?.lowTemp),
    hasDescription: !!weather?.description,
    hasMinimalData: !!(weather?.temperature || weather?.highTemp) && !!weather?.description,
    isActualForecast: weather?.isActualForecast,
    dateMatchInfo: weather?.dateMatchInfo
  });

  // 🚨 DEBUG INJECTION: Render path decision logging
  React.useEffect(() => {
    console.log('🚨 DEBUG: SegmentWeatherContent render path analysis', {
      segmentEndCity,
      hasApiKey,
      loading,
      hasWeather: !!weather,
      hasError: !!error,
      hasSegmentDate: !!segmentDate,
      renderPaths: {
        willShowApiKeyHandler: true,
        willShowStateHandler: true,
        willShowWeatherDisplay: !!segmentDate,
        willShowMissingDate: !segmentDate
      }
    });
  }, [hasApiKey, loading, weather, error, segmentDate, segmentEndCity]);

  return (
    <WeatherApiKeyHandler
      hasApiKey={hasApiKey}
      segmentEndCity={segmentEndCity}
      onApiKeySet={onApiKeySet}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    >
      <WeatherStateHandler
        loading={loading}
        retryCount={retryCount}
        error={error}
        segmentEndCity={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      >
        {segmentDate && (
          <>
            {/* 🚨 DEBUG INJECTION: Pre-display logging */}
            {(() => {
              console.log('🚨 DEBUG: SegmentWeatherContent about to render WeatherDisplayDecision', {
                segmentEndCity,
                segmentDate: segmentDate.toISOString(),
                hasWeather: !!weather,
                weatherValid: weather ? !!(weather.temperature || weather.highTemp || weather.lowTemp) : false
              });
              return null;
            })()}
            
            <WeatherDisplayDecision
              weather={weather}
              segmentDate={segmentDate}
              segmentEndCity={segmentEndCity}
              error={error}
              onRetry={onRetry}
              isSharedView={isSharedView}
              isPDFExport={isPDFExport}
            />
          </>
        )}
        {!segmentDate && (
          <>
            {/* 🚨 DEBUG INJECTION: Missing date logging */}
            {(() => {
              console.log('🚨 DEBUG: SegmentWeatherContent rendering missing date error', {
                segmentEndCity,
                segmentDate,
                reason: 'segment_date_is_null'
              });
              return null;
            })()}
            
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">
              ❌ Missing segment date for {segmentEndCity}
            </div>
          </>
        )}
      </WeatherStateHandler>
    </WeatherApiKeyHandler>
  );
};

export default SegmentWeatherContent;
