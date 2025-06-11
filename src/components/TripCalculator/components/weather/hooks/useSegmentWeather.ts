
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';
import { useSegmentWeatherHandlers } from './useSegmentWeatherHandlers';

interface UseSegmentWeatherProps {
  segmentEndCity: string;
  hasApiKey: boolean;
  segmentDate: Date | null;
  weather: ForecastWeatherData | null;
  setWeather: (weather: ForecastWeatherData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
}

interface UseSegmentWeatherReturn {
  handleApiKeySet: () => void;
  handleTimeout: () => void;
  handleRetry: () => void;
}

export const useSegmentWeather = ({
  segmentEndCity,
  hasApiKey,
  segmentDate,
  weather,
  setWeather,
  loading,
  setLoading,
  error,
  setError,
  retryCount,
  setRetryCount
}: UseSegmentWeatherProps): UseSegmentWeatherReturn => {
  const {
    fetchWeatherData,
    handleApiKeySet,
    handleTimeout,
    handleRetry
  } = useSegmentWeatherHandlers({
    segmentEndCity,
    segmentDate,
    retryCount,
    setRetryCount,
    setLoading,
    setError,
    setWeather
  });

  // Auto-fetch when dependencies change with debouncing
  React.useEffect(() => {
    if (hasApiKey && segmentDate && !weather && !loading) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeather.autoFetch [${segmentEndCity}]`,
        { trigger: 'dependency_change', hasApiKey, hasDate: !!segmentDate, hasWeather: !!weather, loading }
      );

      // Debounce to prevent rapid-fire requests
      const timeoutId = setTimeout(() => {
        fetchWeatherData();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [hasApiKey, segmentDate, segmentEndCity, weather, loading, fetchWeatherData]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
