
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
      if (isSharedView) {
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + (segment.day - 1));
        return fallbackDate;
      }
      return null;
    }
    const date = new Date(tripStartDate);
    date.setDate(date.getDate() + (segment.day - 1));
    return date;
  }, [tripStartDate, segment.day, isSharedView]);

  // FIXED: Always check for API key, even in shared views
  const hasApiKey = React.useMemo(() => {
    const apiKey = localStorage.getItem('weather_api_key');
    const hasKey = !!(apiKey && apiKey.trim().length > 0);
    
    console.log('🔑 SimpleWeatherWidget API key check:', {
      cityName: segment.endCity,
      isSharedView,
      hasKey,
      keyLength: apiKey?.length || 0
    });
    
    return hasKey;
  }, [segment.endCity, isSharedView]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate) return;

      console.log('🌤️ SimpleWeatherWidget: Starting enhanced fetch', {
        cityName: segment.endCity,
        day: segment.day,
        segmentDate: segmentDate.toISOString(),
        hasApiKey,
        isSharedView,
        enableLiveForecastInSharedView: true
      });

      setLoading(true);
      setError(null);

      try {
        const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
          cityName: segment.endCity,
          targetDate: segmentDate,
          hasApiKey,
          isSharedView
        });

        console.log('✅ SimpleWeatherWidget: Weather fetched', {
          cityName: segment.endCity,
          hasWeather: !!weatherData,
          isActualForecast: weatherData?.isActualForecast,
          source: weatherData?.source,
          temperature: weatherData?.temperature,
          description: weatherData?.description,
          icon: weatherData?.icon
        });

        setWeather(weatherData);
      } catch (err) {
        console.error('❌ SimpleWeatherWidget: Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [segment.endCity, segmentDate, hasApiKey, isSharedView, segment.day]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // If we have actual weather data, show it
  if (weather) {
    const isLiveForecast = weather.isActualForecast === true && weather.source === 'live_forecast';
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              🌤️ Weather for {segment.endCity}
            </h4>
            <p className="text-sm text-gray-600 mb-2 capitalize">{weather.description}</p>
            <SimpleTemperatureDisplay weather={weather} isSharedView={isSharedView} />
            <p className="text-xs text-gray-500 mt-1">
              Source: {isLiveForecast ? 'Live Forecast' : 'Historical Average'}
              {isLiveForecast && ' ✅'}
            </p>
          </div>
          <div className="text-4xl">
            {weather.icon ? (
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="w-16 h-16"
                onError={(e) => {
                  console.warn('Weather icon failed to load:', weather.icon);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span>🌤️</span>
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

  // For shared views OR when we have a valid segment date, show seasonal fallback
  if (segmentDate) {
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segment.endCity}
        compact={true}
      />
    );
  }

  // Only show error in non-shared views
  if (error && !isSharedView) {
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

  // Absolute final fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available for {segment.endCity}</p>
    </div>
  );
};

export default SimpleWeatherWidget;
