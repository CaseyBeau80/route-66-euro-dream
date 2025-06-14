
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { SimpleWeatherFetcher } from './SimpleWeatherFetcher';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface UnifiedWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherWidget: React.FC<UnifiedWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      console.log('🔧 UnifiedWeatherWidget: Calculated segment date:', {
        cityName: segment.endCity,
        tripStartDate: tripStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString()
      });
      return calculatedDate;
    }
    return null;
  }, [tripStartDate, segment.day]);

  // Check API key availability
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log('🔧 UnifiedWeatherWidget: API key check:', {
      cityName: segment.endCity,
      hasApiKey: keyExists
    });
    return keyExists;
  }, [refreshKey]);

  // Fetch weather data
  React.useEffect(() => {
    if (!segmentDate) {
      console.log('🔧 UnifiedWeatherWidget: No segment date, skipping fetch');
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('🔧 UnifiedWeatherWidget: Fetching weather for:', {
          cityName: segment.endCity,
          segmentDate: segmentDate.toISOString(),
          hasApiKey
        });

        const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
          cityName: segment.endCity,
          targetDate: segmentDate,
          hasApiKey,
          isSharedView,
          segmentDay: segment.day
        });

        if (weatherData) {
          console.log('✅ UnifiedWeatherWidget: Weather data received:', {
            cityName: segment.endCity,
            temperature: weatherData.temperature,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast
          });
          setWeather(weatherData);
        } else {
          setError('Weather data unavailable');
        }
      } catch (err) {
        console.error('❌ UnifiedWeatherWidget: Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [segment.endCity, segmentDate, hasApiKey, refreshKey]);

  const handleRetry = () => {
    console.log('🔄 UnifiedWeatherWidget: Retrying weather fetch for', segment.endCity);
    setRefreshKey(prev => prev + 1);
  };

  const handleApiKeySet = () => {
    console.log('🔑 UnifiedWeatherWidget: API key set, refreshing for', segment.endCity);
    setRefreshKey(prev => prev + 1);
  };

  // Show API key input for regular views without API key
  if (!isSharedView && !isPDFExport && !hasApiKey) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          🌤️ Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={handleApiKeySet}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available and we have a valid date
  if (weather && segmentDate) {
    return (
      <SimpleWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Fallback for shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-center">
        <div className="text-yellow-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-yellow-700 font-medium">Weather forecast temporarily unavailable</p>
        <p className="text-xs text-yellow-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-yellow-500 mt-1">{error}</p>}
      </div>
    );
  }

  // Fallback for views without valid date
  if (!segmentDate) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Set a trip start date for accurate forecast</p>
      </div>
    );
  }

  // Final fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={handleRetry}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default UnifiedWeatherWidget;
