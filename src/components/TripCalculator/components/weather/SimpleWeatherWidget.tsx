
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

  // PLAN IMPLEMENTATION: Comprehensive debugging logs as requested
  console.log("🚨 PLAN IMPLEMENTATION: SimpleWeatherWidget comprehensive debug", {
    cityName: segment.endCity,
    segmentDay: segment.day,
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    isSharedView,
    hasWeather: !!weather,
    weatherObject: weather,
    forecastLength: weather?.forecast?.length,
    matchedForecastDay: weather?.matchedForecastDay,
    weatherTemperature: weather?.temperature,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    phase: 'PLAN IMPLEMENTATION - Comprehensive Debug'
  });

  // User requested specific console logs
  console.log("City:", segment?.endCity);
  console.log("Date:", segmentDate);
  console.log("Weather object:", weather);
  console.log("Forecast length:", weather?.forecast?.length);
  console.log("Matched forecast:", weather?.matchedForecastDay);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate) {
        console.log('🚨 PLAN: No segmentDate available for', segment.endCity);
        return;
      }

      console.log('🚨 PLAN: Starting weather fetch', {
        endCity: segment.endCity,
        segmentDate: segmentDate.toISOString(),
        segmentDay: segment.day,
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

        console.log('🚨 PLAN: Weather fetch result', {
          endCity: segment.endCity,
          hasWeather: !!weatherData,
          weatherData,
          isActualForecast: weatherData?.isActualForecast,
          source: weatherData?.source,
          temperature: weatherData?.temperature
        });

        setWeather(weatherData);
      } catch (err) {
        console.error('❌ PLAN: Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [segment.endCity, segmentDate, hasApiKey, isSharedView, segment.day]);

  // PLAN: Loading state
  if (loading) {
    console.log('🚨 PLAN: Showing loading state for', segment.endCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // PLAN IMPLEMENTATION: PRIORITY 1 - If weather exists, ALWAYS show it
  if (weather) {
    console.log('🎯 PLAN: PRIORITY 1 - Weather data exists, displaying it for', segment.endCity, {
      temperature: weather.temperature,
      isActualForecast: weather.isActualForecast,
      source: weather.source,
      hasMatchedForecastDay: !!weather.matchedForecastDay
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

  // PLAN IMPLEMENTATION: PRIORITY 2 - For shared views, ALWAYS show seasonal fallback if date exists
  if (isSharedView && segmentDate) {
    console.log('🌱 PLAN: PRIORITY 2 - No weather but have segmentDate in shared view, using seasonal fallback for', segment.endCity, {
      segmentDate: segmentDate.toISOString(),
      hasWeather: !!weather,
      isSharedView
    });

    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segment.endCity}
        compact={true}
      />
    );
  }

  // PLAN IMPLEMENTATION: PRIORITY 3 - Non-shared view with error
  if (error && !isSharedView) {
    console.log('⚠️ PLAN: PRIORITY 3 - Error state in non-shared view for', segment.endCity);
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

  // PLAN IMPLEMENTATION: PRIORITY 4 - Final fallback (should rarely be reached in shared views)
  console.log('🚫 PLAN: PRIORITY 4 - Final fallback for', segment.endCity, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    error
  });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available for {segment.endCity}</p>
    </div>
  );
};

export default SimpleWeatherWidget;
