
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
  const [lastFetchKey, setLastFetchKey] = useState<string>('');

  // ENHANCED: Create a unique fetch key to force re-fetching when parameters change
  const fetchKey = `${cityName}-${segmentDate?.toISOString() || 'no-date'}-${segmentDay}-${Date.now()}`;

  const fetchWeatherData = useCallback(async () => {
    if (!segmentDate) {
      console.log('🔍 ENHANCED: useUnifiedWeather - No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      setLastFetchKey('');
      return;
    }

    // Prevent duplicate fetches
    if (lastFetchKey === fetchKey && weather) {
      console.log('🔍 ENHANCED: useUnifiedWeather - Skipping duplicate fetch for', cityName, fetchKey);
      return;
    }

    setLoading(true);
    setError(null);
    setLastFetchKey(fetchKey);

    try {
      console.log('🔍 ENHANCED: useUnifiedWeather - Starting fetch with key:', fetchKey, {
        cityName,
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        forceRefresh: true,
        enhancedValidation: true
      });

      const result = await UnifiedWeatherService.fetchWeatherForSegment(
        cityName,
        segmentDate,
        segmentDay,
        true // Always force refresh for accuracy
      );

      if (result.weather) {
        // ENHANCED: Comprehensive data validation
        const weatherData = result.weather;
        const isValidWeatherData = weatherData.temperature !== undefined && 
                                  weatherData.source !== undefined &&
                                  weatherData.isActualForecast !== undefined;

        if (!isValidWeatherData) {
          console.error('🔍 ENHANCED: Invalid weather data structure:', weatherData);
          setError('Invalid weather data received');
          return;
        }

        console.log('🔍 ENHANCED: useUnifiedWeather - Weather data validated and received:', {
          fetchKey,
          cityName,
          weatherValidation: {
            source: weatherData.source,
            sourceType: typeof weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            actualType: typeof weatherData.isActualForecast,
            temperature: weatherData.temperature,
            description: weatherData.description
          },
          liveWeatherCheck: {
            sourceMatch: weatherData.source === 'live_forecast',
            actualMatch: weatherData.isActualForecast === true,
            combinedCheck: weatherData.source === 'live_forecast' && weatherData.isActualForecast === true
          },
          dataTimestamp: new Date().toISOString()
        });

        setWeather(weatherData);
      } else {
        console.log('🔍 ENHANCED: useUnifiedWeather - No weather data received for', cityName, fetchKey);
        setError(result.error || 'Unable to fetch weather data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('🔍 ENHANCED: useUnifiedWeather - Error fetching weather:', {
        fetchKey,
        cityName,
        error: errorMessage,
        errorTimestamp: new Date().toISOString()
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay, fetchKey, lastFetchKey, weather]);

  const refetch = useCallback(() => {
    console.log('🔍 ENHANCED: useUnifiedWeather - Manual refetch requested for', cityName);
    setLastFetchKey(''); // Clear the last fetch key to allow re-fetching
    fetchWeatherData();
  }, [fetchWeatherData, cityName]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // ENHANCED: Add debugging for the returned state
  console.log('🔍 ENHANCED: useUnifiedWeather hook state for', cityName, {
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    temperature: weather?.temperature,
    loading,
    error,
    fetchKey,
    lastFetchKey,
    hookTimestamp: new Date().toISOString()
  });

  return {
    weather,
    loading,
    error,
    refetch
  };
};
