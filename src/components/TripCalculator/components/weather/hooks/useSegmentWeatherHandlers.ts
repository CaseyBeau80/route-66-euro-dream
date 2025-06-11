
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFetchingService } from '../services/WeatherFetchingService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

interface UseSegmentWeatherHandlersProps {
  segmentEndCity: string;
  segmentDate: Date | null;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWeather: (weather: ForecastWeatherData | null) => void;
}

interface UseSegmentWeatherHandlersReturn {
  fetchWeatherData: () => Promise<void>;
  handleApiKeySet: () => void;
  handleTimeout: () => void;
  handleRetry: () => void;
}

export const useSegmentWeatherHandlers = ({
  segmentEndCity,
  segmentDate,
  retryCount,
  setRetryCount,
  setLoading,
  setError,
  setWeather
}: UseSegmentWeatherHandlersProps): UseSegmentWeatherHandlersReturn => {
  
  const fetchWeatherData = React.useCallback(async () => {
    if (!segmentDate) {
      console.warn(`❌ Cannot fetch weather for ${segmentEndCity}: No segment date`);
      setError('Missing trip date - please set a trip start date');
      return;
    }

    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.fetchWeatherData [${segmentEndCity}]`,
      {
        segmentDate: segmentDate.toISOString(),
        retryCount,
        hasDate: !!segmentDate
      }
    );

    try {
      await WeatherFetchingService.fetchWeatherForSegment(
        segmentEndCity,
        segmentDate,
        setLoading,
        setError,
        setWeather
      );
    } catch (error) {
      console.error(`❌ Weather fetch failed for ${segmentEndCity}:`, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      setLoading(false);
    }
  }, [segmentEndCity, segmentDate, retryCount, setLoading, setError, setWeather]);

  const handleApiKeySet = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleApiKeySet [${segmentEndCity}]`,
      { trigger: 'api_key_set' }
    );
    
    setError(null);
    setRetryCount(0);
    
    // Fetch weather data immediately after API key is set
    if (segmentDate) {
      setTimeout(() => {
        fetchWeatherData();
      }, 500);
    }
  }, [segmentEndCity, segmentDate, fetchWeatherData, setError, setRetryCount]);

  const handleTimeout = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleTimeout [${segmentEndCity}]`,
      { retryCount }
    );
    
    setError('Weather request timed out');
    setLoading(false);
  }, [segmentEndCity, retryCount, setError, setLoading]);

  const handleRetry = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleRetry [${segmentEndCity}]`,
      { retryCount, newRetryCount: retryCount + 1 }
    );
    
    setRetryCount(prev => prev + 1);
    setError(null);
    setWeather(null);
    
    // Retry fetch immediately
    setTimeout(() => {
      fetchWeatherData();
    }, 100);
  }, [segmentEndCity, retryCount, setRetryCount, setError, setWeather, fetchWeatherData]);

  return {
    fetchWeatherData,
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
