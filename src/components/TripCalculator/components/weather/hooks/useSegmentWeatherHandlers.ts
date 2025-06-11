
import React from 'react';
import { WeatherDataDebugger } from '../WeatherDataDebugger';
import { WeatherFetchingService } from '../services/WeatherFetchingService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface UseSegmentWeatherHandlersProps {
  segmentEndCity: string;
  segmentDate: Date | null;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWeather: (weather: ForecastWeatherData | null) => void;
}

export const useSegmentWeatherHandlers = ({
  segmentEndCity,
  segmentDate,
  retryCount,
  setRetryCount,
  setLoading,
  setError,
  setWeather
}: UseSegmentWeatherHandlersProps) => {
  const fetchWeatherData = React.useCallback(async () => {
    if (!segmentDate) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeatherHandlers.fetchWeatherData.skip [${segmentEndCity}]`,
        { reason: 'missing_segment_date' }
      );
      return;
    }

    await WeatherFetchingService.fetchWeatherForSegment(
      segmentEndCity,
      segmentDate,
      setLoading,
      setError,
      setWeather
    );
  }, [segmentDate, segmentEndCity, setLoading, setError, setWeather]);

  const handleApiKeySet = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleApiKeySet [${segmentEndCity}]`,
      { previousRetryCount: retryCount }
    );
    
    setRetryCount(0);
    fetchWeatherData();
  }, [segmentEndCity, fetchWeatherData, setRetryCount, retryCount]);

  const handleTimeout = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleTimeout [${segmentEndCity}]`,
      { currentRetryCount: retryCount }
    );
    
    setRetryCount(prev => prev + 1);
    setError('Weather service timeout - please try again');
  }, [segmentEndCity, setRetryCount, setError, retryCount]);

  const handleRetry = React.useCallback(() => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherHandlers.handleRetry [${segmentEndCity}]`,
      { currentRetryCount: retryCount, newRetryCount: retryCount + 1 }
    );
    
    setRetryCount(prev => prev + 1);
    fetchWeatherData();
  }, [segmentEndCity, retryCount, setRetryCount, fetchWeatherData]);

  return {
    fetchWeatherData,
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
