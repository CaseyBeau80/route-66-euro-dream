
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';

interface UseUnifiedWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherParams) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    if (!segmentDate) {
      console.log('🌤️ FIXED: No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ FIXED: useUnifiedWeather fetching for', cityName, {
        segmentDate: segmentDate.toISOString(),
        segmentDay
      });

      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName,
        targetDate: segmentDate,
        hasApiKey: true, // Will be checked inside the fetcher
        isSharedView: false,
        segmentDay
      });

      console.log('🌤️ FIXED: useUnifiedWeather result for', cityName, {
        hasWeather: !!weatherData,
        source: weatherData?.source,
        isActualForecast: weatherData?.isActualForecast,
        temperature: weatherData?.temperature
      });

      setWeather(weatherData);
    } catch (err) {
      console.error('❌ FIXED: useUnifiedWeather error for', cityName, err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay]);

  const refetch = useCallback(() => {
    console.log('🔄 FIXED: useUnifiedWeather refetch triggered for', cityName);
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { weather, loading, error, refetch };
};
