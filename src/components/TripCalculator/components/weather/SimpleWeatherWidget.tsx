
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
    if (!tripStartDate) {
      console.log('🚨 SHARED VIEW DATE FIX: No tripStartDate provided, will use current date + segment day for shared view', {
        segment: segment.endCity,
        segmentDay: segment.day,
        isSharedView
      });
      
      // CRITICAL FIX: For shared views, create a fallback date based on current date + segment day
      if (isSharedView) {
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + (segment.day - 1));
        console.log('🚨 SHARED VIEW DATE FIX: Created fallback date', {
          fallbackDate: fallbackDate.toISOString(),
          segmentDay: segment.day
        });
        return fallbackDate;
      }
      return null;
    }
    const date = new Date(tripStartDate);
    date.setDate(date.getDate() + (segment.day - 1));
    return date;
  }, [tripStartDate, segment.day, segment.endCity, isSharedView]);

  const hasApiKey = React.useMemo(() => {
    return !!localStorage.getItem('weather_api_key');
  }, []);

  console.log("🚨 SHARED VIEW DATE FIX: SimpleWeatherWidget render analysis", {
    cityName: segment.endCity,
    segmentDay: segment.day,
    hasApiKey,
    isSharedView,
    hasTripStartDate: !!tripStartDate,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    loading,
    error,
    logicPath: 'shared_view_date_fix'
  });

  useEffect(() => {
    const fetchWeather = async () => {
      // CRITICAL FIX: For shared views, ALWAYS show seasonal fallback if no proper date calculation
      if (!segmentDate) {
        console.log('🚨 SHARED VIEW DATE FIX: No segmentDate available', {
          endCity: segment.endCity,
          isSharedView,
          hasTripStartDate: !!tripStartDate,
          willShowSeasonalFallback: isSharedView
        });

        // For shared views, immediately show seasonal fallback without loading
        if (isSharedView) {
          setLoading(false);
          setError(null);
          // Don't set weather - let the render logic handle seasonal fallback
          return;
        }
        return;
      }

      console.log('🚨 SHARED VIEW DATE FIX: Starting weather fetch', {
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

        console.log('🚨 SHARED VIEW DATE FIX: Weather fetch completed', {
          endCity: segment.endCity,
          hasWeather: !!weatherData,
          isSharedView,
          weatherData: weatherData ? {
            temperature: weatherData.temperature,
            isActualForecast: weatherData.isActualForecast,
            source: weatherData.source
          } : null
        });

        setWeather(weatherData);
      } catch (err) {
        console.error('🚨 SHARED VIEW DATE FIX: Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [segment.endCity, segmentDate, hasApiKey, isSharedView, segment.day]);

  // Loading state
  if (loading) {
    console.log('🚨 SHARED VIEW DATE FIX: Showing loading state for', segment.endCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // CRITICAL FIX: If we have actual weather data, show it
  if (weather) {
    console.log('🚨 SHARED VIEW DATE FIX: Displaying weather data for', segment.endCity, {
      temperature: weather.temperature,
      source: weather.source,
      isSharedView
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

  // CRITICAL FIX: For shared views OR when we have a valid segment date, ALWAYS show seasonal fallback
  if (segmentDate || isSharedView) {
    const fallbackDate = segmentDate || new Date(); // Use current date as absolute fallback
    
    console.log('🚨 SHARED VIEW DATE FIX: Showing seasonal fallback for', segment.endCity, {
      isSharedView,
      hasSegmentDate: !!segmentDate,
      fallbackDate: fallbackDate.toISOString(),
      reason: segmentDate ? 'no_weather_data_available' : 'shared_view_no_date'
    });
    
    return (
      <SeasonalWeatherFallback 
        segmentDate={fallbackDate}
        cityName={segment.endCity}
        compact={true}
      />
    );
  }

  // Only show error in non-shared views
  if (error && !isSharedView) {
    console.log('🚨 SHARED VIEW DATE FIX: Showing error state for non-shared view', segment.endCity);
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

  // Absolute final fallback - should never reach here in shared views
  console.log('🚨 SHARED VIEW DATE FIX: Absolute final fallback for', segment.endCity, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    error,
    reason: 'absolute_fallback'
  });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available for {segment.endCity}</p>
    </div>
  );
};

export default SimpleWeatherWidget;
