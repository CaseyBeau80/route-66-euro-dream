
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SeasonalWeatherFallback from './components/SeasonalWeatherFallback';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate?: Date | null;
  cityName: string;
  error: string | null;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  // PLAN: Enhanced debugging for weather data display
  const debugKey = `display-${cityName}-${segmentDate?.toISOString().split('T')[0] || 'no-date'}`;
  
  console.log('🔍 PLAN: WeatherDataDisplay ENHANCED DEBUGGING:', {
    debugKey,
    inputState: {
      hasWeather: !!weather,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      hasSegmentDate: !!segmentDate,
      cityName,
      hasError: !!error
    },
    displayContext: {
      isSharedView,
      isPDFExport
    },
    planImplementation: true
  });

  // PLAN: Always prioritize actual weather data if available
  if (weather && segmentDate) {
    console.log(`✅ PLAN: WeatherDataDisplay - Using actual weather data for ${cityName}:`, {
      debugKey,
      weatherDetails: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        temperature: weather.temperature,
        highTemp: weather.highTemp,
        lowTemp: weather.lowTemp,
        description: weather.description
      },
      verificationStatus: {
        isLiveForecast: weather.source === 'live_forecast' && weather.isActualForecast === true,
        willShowCorrectLabel: true
      },
      planImplementation: true
    });

    return (
      <SimpleWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={cityName}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Enhanced fallback logic for shared views
  if ((isSharedView || isPDFExport) && segmentDate && !weather) {
    console.log(`🌱 PLAN: WeatherDataDisplay - Using seasonal fallback for ${cityName} in shared view:`, {
      debugKey,
      fallbackReason: 'no_weather_data_available',
      planImplementation: true
    });
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={cityName}
        compact={true}
      />
    );
  }

  // Show "not available" only as absolute last resort in shared views
  if (isSharedView || isPDFExport) {
    console.log(`🚫 PLAN: WeatherDataDisplay - Last resort fallback for ${cityName}:`, {
      debugKey,
      fallbackReason: 'no_weather_or_date_available',
      planImplementation: true
    });
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }

  // Regular view - show error state with retry option
  console.log(`⚠️ PLAN: WeatherDataDisplay - Showing error state for ${cityName}:`, {
    debugKey,
    error,
    planImplementation: true
  });
  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3">
      <div className="text-amber-800 text-sm">
        Weather information temporarily unavailable
      </div>
      {error && (
        <div className="text-xs text-amber-600 mt-1">{error}</div>
      )}
      <div className="mt-2 text-center">
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default WeatherDataDisplay;
