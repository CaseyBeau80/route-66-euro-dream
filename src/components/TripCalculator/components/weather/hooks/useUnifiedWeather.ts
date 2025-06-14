
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedWeatherService } from '../services/UnifiedWeatherService';

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
      console.log('useUnifiedWeather - No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('useUnifiedWeather - Fetching weather for', cityName, segmentDate.toISOString());

      const result = await UnifiedWeatherService.fetchWeatherForSegment(
        cityName,
        segmentDate,
        segmentDay,
        false // Don't force refresh to prevent excessive API calls
      );

      if (result.weather) {
        console.log('useUnifiedWeather - Weather received:', {
          cityName,
          source: result.weather.source,
          isActualForecast: result.weather.isActualForecast,
          temperature: result.weather.temperature
        });
        setWeather(result.weather);
      } else {
        console.log('useUnifiedWeather - No weather data for', cityName);
        setError(result.error || 'Unable to fetch weather data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('useUnifiedWeather - Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay]);

  const refetch = useCallback(() => {
    console.log('useUnifiedWeather - Manual refetch for', cityName);
    fetchWeatherData();
  }, [fetchWeatherData, cityName]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};
