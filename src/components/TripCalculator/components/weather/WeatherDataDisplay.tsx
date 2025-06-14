import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SeasonalWeatherFallback from './components/SeasonalWeatherFallback';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';

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
  // CRITICAL FIX: State to force re-renders when weather data changes
  const [displayRenderCount, setDisplayRenderCount] = React.useState(0);

  // CRITICAL FIX: Dynamic key that changes when weather source/forecast status changes
  const displayKey = `${cityName}-${weather?.source || 'no-weather'}-${weather?.isActualForecast || false}-${displayRenderCount}`;

  // CRITICAL FIX: Force re-render when weather data changes
  React.useEffect(() => {
    console.log('🔄 CRITICAL FIX: WeatherDataDisplay - Weather data effect:', {
      cityName,
      hasWeather: !!weather,
      weatherSource: weather?.source,
      isActualForecast: weather?.isActualForecast,
      displayRenderCount,
      displayKey,
      criticalFix: true
    });
    
    setDisplayRenderCount(prev => prev + 1);
  }, [weather?.source, weather?.isActualForecast, weather?.temperature, cityName]);

  console.log('🎯 CRITICAL FIX: WeatherDataDisplay implementation for', cityName, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    isPDFExport,
    weatherType: weather ? WeatherTypeDetector.detectWeatherType(weather) : null,
    displayKey,
    displayRenderCount,
    criticalFix: true
  });

  // CRITICAL FIX: ALWAYS prioritize actual weather data if available
  if (weather && segmentDate) {
    const weatherType = WeatherTypeDetector.detectWeatherType(weather);
    
    console.log(`🎯 CRITICAL FIX: Using actual weather data for ${cityName}`, {
      isActualForecast: weather.isActualForecast,
      source: weather.source,
      weatherType,
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      displayKey,
      criticalFix: true
    });

    return (
      <div key={displayKey}>
        <SimpleWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={cityName}
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
          key={`simple-${displayKey}`}
        />
      </div>
    );
  }

  // PLAN: Enhanced fallback logic for shared views
  if ((isSharedView || isPDFExport) && segmentDate && !weather) {
    console.log(`🌱 PLAN: No actual weather available, using seasonal fallback for ${cityName} in shared view`);
    return (
      <div key={`seasonal-${displayKey}`}>
        <SeasonalWeatherFallback 
          segmentDate={segmentDate}
          cityName={cityName}
          compact={true}
          key={`fallback-${displayKey}`}
        />
      </div>
    );
  }

  // PLAN: Show "not available" only as absolute last resort in shared views
  if (isSharedView || isPDFExport) {
    console.log(`🚫 PLAN: Last resort - no weather or date available for ${cityName} in shared view`);
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center" key={`not-available-${displayKey}`}>
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }

  // Regular view - show error state with retry option
  console.log(`⚠️ PLAN: Showing error state for ${cityName} in regular view`);
  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3" key={`error-${displayKey}`}>
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
