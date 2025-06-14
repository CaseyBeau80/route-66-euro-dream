
import { useState, useEffect, useRef } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UseUnifiedWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

interface UseUnifiedWeatherReturn {
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherParams): UseUnifiedWeatherReturn => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = async () => {
    if (!segmentDate) {
      console.log('🔧 useUnifiedWeather: No segment date provided for', cityName);
      setWeather(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      console.log('🔧 useUnifiedWeather: Fetching weather for:', {
        cityName,
        segmentDate: segmentDate.toISOString(),
        segmentDay
      });

      // Check if we have a valid API key
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      
      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView: false,
        segmentDay
      });

      if (abortController.signal.aborted) return;

      if (weatherData) {
        console.log('✅ useUnifiedWeather: Weather data received for', cityName, {
          temperature: weatherData.temperature,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast
        });
        setWeather(weatherData);
        setError(null);
      } else {
        console.log('⚠️ useUnifiedWeather: No weather data returned for', cityName);
        setWeather(null);
        setError('Weather data unavailable');
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error('❌ useUnifiedWeather: Error fetching weather for', cityName, err);
        setError(err instanceof Error ? err.message : 'Weather fetch failed');
        setWeather(null);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    console.log('🔄 useUnifiedWeather: Manual refetch triggered for', cityName);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    // Use cached weather if available and prioritized
    if (prioritizeCachedData && cachedWeather) {
      console.log('📦 useUnifiedWeather: Using cached weather for', cityName);
      setWeather(cachedWeather);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch fresh weather data
    fetchWeather();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cityName, segmentDate, segmentDay, refreshTrigger]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};
