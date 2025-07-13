
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { SimpleWeatherFetcher } from './SimpleWeatherFetcher';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }
    return null;
  }, [tripStartDate, segment.day]);

  // Fetch weather data using unified SimpleWeatherFetcher
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ UNIFIED SIMPLE WEATHER: Fetching for:', segment.endCity, segmentDate);
      
      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: true, // Let SimpleWeatherFetcher determine this
        isSharedView: isSharedView,
        segmentDay: segment.day
      });

      if (weatherData) {
        setWeather(weatherData);
        console.log('✅ UNIFIED SIMPLE WEATHER: Data received:', {
          city: segment.endCity,
          temperature: weatherData.temperature,
          source: weatherData.source,
          isLive: weatherData.source === 'live_forecast' && weatherData.isActualForecast
        });
      } else {
        setError('Weather data unavailable');
      }
    } catch (err) {
      console.error('❌ UNIFIED SIMPLE WEATHER: Fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate, isSharedView, segment.day]);

  // Fetch weather when component mounts or dependencies change
  React.useEffect(() => {
    if (segmentDate) {
      fetchWeather();
    }
  }, [fetchWeather, segmentDate]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading live weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available
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

  // Fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!isSharedView && !isPDFExport && (
        <button
          onClick={fetchWeather}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
