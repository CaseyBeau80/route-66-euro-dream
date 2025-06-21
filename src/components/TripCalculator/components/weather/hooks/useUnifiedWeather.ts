
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { SecureWeatherService } from '@/services/SecureWeatherService';
import { WeatherService } from '@/components/Route66Map/services/WeatherService';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate?: Date | null;
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
}: UseUnifiedWeatherProps) => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(cachedWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check API key availability
  useEffect(() => {
    const weatherService = WeatherService.getInstance();
    setHasApiKey(weatherService.hasApiKey());
  }, [retryCount]);

  // FIXED: Enhanced weather fetching logic
  const fetchWeather = useCallback(async () => {
    if (!segmentDate) {
      console.log('🌤️ FIXED: No segment date provided for', cityName);
      return;
    }

    console.log('🌤️ FIXED: Starting weather fetch for', cityName, {
      segmentDate: segmentDate.toISOString(),
      day: segmentDay,
      hasApiKey,
      prioritizeCachedData,
      retryCount
    });

    setLoading(true);
    setError(null);

    try {
      // Try secure weather service first (uses Supabase Edge Function)
      const weatherData = await SecureWeatherService.fetchWeatherForecast(
        cityName,
        segmentDate
      );

      if (weatherData) {
        console.log('✅ FIXED: Weather data received for', cityName, {
          source: weatherData.source,
          temperature: weatherData.temperature,
          isActualForecast: weatherData.isActualForecast
        });
        setWeather(weatherData);
        setError(null);
      } else {
        console.warn('⚠️ FIXED: No weather data returned for', cityName);
        setError('Weather data unavailable');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Weather fetch failed';
      console.error('❌ FIXED: Weather fetch error for', cityName, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay, hasApiKey, prioritizeCachedData, retryCount]);

  // Fetch weather when dependencies change
  useEffect(() => {
    if (segmentDate && cityName) {
      fetchWeather();
    }
  }, [fetchWeather]);

  const refetch = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    weather,
    loading,
    error,
    hasApiKey,
    retryCount,
    refetch
  };
};
