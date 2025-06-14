
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { SecureWeatherService } from '@/services/SecureWeatherService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import UnifiedWeatherDisplay from './UnifiedWeatherDisplay';

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

  // Calculate segment date using the same logic everywhere
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }

    // For shared views, try URL parameters
    if (isSharedView) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start', 'tripStartDate'];
        
        for (const paramName of possibleParams) {
          const tripStartParam = urlParams.get(paramName);
          if (tripStartParam) {
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              return WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse trip start date from URL:', error);
      }
    }

    // Fallback: use today
    const today = new Date();
    return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
  }, [tripStartDate, segment.day, isSharedView]);

  // Fetch weather using secure service
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ UNIFIED SECURE: Fetching via Edge Function for', segment.endCity, segmentDate.toISOString());
      
      const weatherData = await SecureWeatherService.fetchWeatherForecast(
        segment.endCity,
        segmentDate
      );

      if (weatherData) {
        setWeather(weatherData);
        console.log('✅ UNIFIED SECURE: Data received from Edge Function for', segment.endCity, {
          temperature: weatherData.temperature,
          source: weatherData.source,
          isLive: weatherData.source === 'live_forecast' && weatherData.isActualForecast
        });
      } else {
        setError('Weather data unavailable');
      }
    } catch (err) {
      console.error('❌ UNIFIED SECURE: Edge Function fetch failed for', segment.endCity, err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

  // Fetch weather when ready
  React.useEffect(() => {
    if (segmentDate) {
      fetchWeather();
    }
  }, [fetchWeather, segmentDate]);

  console.log('🔥 UNIFIED SECURE: Widget render:', {
    cityName: segment.endCity,
    day: segment.day,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    isSharedView,
    isPDFExport,
    isLiveWeather: weather?.source === 'live_forecast' && weather?.isActualForecast
  });

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Fetching live weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available
  if (weather && segmentDate) {
    return (
      <UnifiedWeatherDisplay
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
    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
      <div className="text-blue-600 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-blue-700 font-medium">Connecting to weather service...</p>
      <p className="text-xs text-blue-600 mt-1">Using secure API connection</p>
      {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
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

export default UnifiedWeatherWidget;
