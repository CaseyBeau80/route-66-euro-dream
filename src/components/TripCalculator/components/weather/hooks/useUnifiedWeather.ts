
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseUnifiedWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useUnifiedWeather = ({ cityName, segmentDate, segmentDay }: UseUnifiedWeatherParams) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('❌ UNIFIED: No segment date for', cityName);
      setError('Missing trip date');
      return;
    }

    console.log('🚀 UNIFIED: Starting weather fetch for', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay
    });

    try {
      setLoading(true);
      setError(null);

      // CRITICAL FIX: Always check API key directly
      const hasApiKey = WeatherApiKeyManager.hasApiKey();

      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView: false, // This hook doesn't distinguish view types
        segmentDay
      });

      if (weatherData) {
        console.log('✅ UNIFIED: Weather fetched successfully for', cityName, {
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast,
          temperature: weatherData.temperature
        });
        setWeather(weatherData);
      } else {
        console.log('❌ UNIFIED: No weather data returned for', cityName);
        setError('Weather data unavailable');
      }
    } catch (err) {
      console.error('❌ UNIFIED: Weather fetch error for', cityName, err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay]);

  const refetch = React.useCallback(() => {
    console.log('🔄 UNIFIED: Refetching weather for', cityName);
    fetchWeather();
  }, [fetchWeather]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate && cityName && !weather && !loading) {
      console.log('🔄 UNIFIED: Auto-fetching weather for', cityName);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), cityName, weather, loading, fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};
