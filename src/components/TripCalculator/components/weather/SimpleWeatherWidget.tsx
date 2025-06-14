
import React, { useState, useEffect } from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { SimpleWeatherFetcher } from './SimpleWeatherFetcher';
import SimpleTemperatureDisplay from './SimpleTemperatureDisplay';
import SeasonalWeatherFallback from './components/SeasonalWeatherFallback';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false
}) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    const date = new Date(tripStartDate);
    date.setDate(date.getDate() + (segment.day - 1));
    return date;
  }, [tripStartDate, segment.day]);

  const hasApiKey = React.useMemo(() => {
    return !!localStorage.getItem('weather_api_key');
  }, []);

  console.log("🔧 FIXED: SimpleWeatherWidget render analysis", {
    cityName: segment.endCity,
    segmentDay: segment.day,
    hasApiKey,
    isSharedView,
    hasSegmentDate: !!segmentDate,
    hasWeather: !!weather,
    loading,
    error,
    logicPath: 'fixed_shared_view_logic'
  });

  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate) {
        console.log('🔧 FIXED: No segmentDate, skipping fetch for', segment.endCity);
        return;
      }

      console.log('🔧 FIXED: Starting weather fetch', {
        endCity: segment.endCity,
        segmentDate: segmentDate.toISOString(),
        hasApiKey,
        isSharedView
      });

      setLoading(true);
      setError(null);

      try {
        const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
          cityName: segment.endCity,
          targetDate: segmentDate,
          hasApiKey
        });

        console.log('🔧 FIXED: Weather fetch completed', {
          endCity: segment.endCity,
          hasWeather: !!weatherData,
          weatherData: weatherData ? {
            temperature: weatherData.temperature,
            isActualForecast: weatherData.isActualForecast,
            source: weatherData.source
          } : null
        });

        setWeather(weatherData);
      } catch (err) {
        console.error('🔧 FIXED: Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if not in shared view, or if in shared view with API key
    if (!isSharedView || hasApiKey) {
      fetchWeather();
    } else {
      console.log('🔧 FIXED: Shared view without API key, skipping fetch for', segment.endCity);
    }
  }, [segment.endCity, segmentDate, hasApiKey, isSharedView, segment.day]);

  // Loading state
  if (loading) {
    console.log('🔧 FIXED: Showing loading state for', segment.endCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // FIXED LOGIC: If we have actual weather data, show it
  if (weather) {
    console.log('🔧 FIXED: Displaying actual weather data for', segment.endCity, {
      temperature: weather.temperature,
      source: weather.source
    });

    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              🌤️ Weather for {segment.endCity}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{weather.description}</p>
            <SimpleTemperatureDisplay weather={weather} isSharedView={isSharedView} />
            {weather.source && (
              <p className="text-xs text-gray-500 mt-1">
                Source: {weather.source === 'live_forecast' ? 'Live Forecast' : 'Historical Average'}
              </p>
            )}
          </div>
          <div className="text-4xl">
            {weather.icon ? (
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="w-16 h-16"
              />
            ) : (
              '🌤️'
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div>💧 {weather.humidity}% humidity</div>
          <div>💨 {weather.windSpeed} mph wind</div>
          <div>☔ {weather.precipitationChance}% rain</div>
        </div>
      </div>
    );
  }

  // CRITICAL FIX: For shared views, ALWAYS show seasonal fallback if we have a date
  if (isSharedView && segmentDate) {
    console.log('🔧 CRITICAL FIX: Shared view with date but no weather - showing seasonal fallback for', segment.endCity);
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segment.endCity}
        compact={true}
      />
    );
  }

  // FIXED LOGIC: Non-shared view with error
  if (error && !isSharedView) {
    console.log('🔧 FIXED: Showing error state for', segment.endCity);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <div className="text-amber-800 text-sm">Weather temporarily unavailable for {segment.endCity}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Retry
        </button>
      </div>
    );
  }

  // FIXED LOGIC: For regular views with date but no weather, also show seasonal fallback
  if (!isSharedView && segmentDate) {
    console.log('🔧 FIXED: Regular view with date but no weather - showing seasonal fallback for', segment.endCity);
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segment.endCity}
        compact={true}
      />
    );
  }

  // FIXED LOGIC: Absolute final fallback only if no date at all
  console.log('🔧 FIXED: Absolute final fallback for', segment.endCity, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    error,
    reason: 'no_date_available'
  });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available for {segment.endCity}</p>
    </div>
  );
};

export default SimpleWeatherWidget;
