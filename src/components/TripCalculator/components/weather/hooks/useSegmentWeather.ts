
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { useWeatherDataFetcher } from './useWeatherDataFetcher';
import { SimpleWeatherState, SimpleWeatherActions } from './useSimpleWeatherState';

export interface UseSegmentWeatherProps extends SimpleWeatherState, SimpleWeatherActions {
  segmentEndCity: string;
  hasApiKey: boolean;
  segmentDate: Date | null;
}

export const useSegmentWeather = (props: UseSegmentWeatherProps) => {
  const {
    segmentEndCity,
    hasApiKey,
    segmentDate,
    setWeather,
    setLoading,
    setError,
    retryCount,
    incrementRetry,
    reset
  } = props;

  // Use data fetcher
  const { fetchWeather } = useWeatherDataFetcher({
    segmentEndCity,
    segmentDay: 1, // Default value - this should be passed in properly
    tripStartDate: segmentDate,
    hasApiKey,
    actions: {
      setWeather,
      setLoading,
      setError,
      retryCount,
      incrementRetry,
      reset
    }
  });

  const handleApiKeySet = React.useCallback(() => {
    console.log(`🔑 useSegmentWeather.handleApiKeySet called for ${segmentEndCity}`);
    if (hasApiKey && segmentDate) {
      fetchWeather();
    }
  }, [hasApiKey, segmentDate, fetchWeather, segmentEndCity]);

  const handleTimeout = React.useCallback(() => {
    console.log(`⏰ useSegmentWeather.handleTimeout called for ${segmentEndCity}`);
    setError('Weather request timed out');
  }, [segmentEndCity, setError]);

  const handleRetry = React.useCallback(() => {
    console.log(`🔄 useSegmentWeather.handleRetry called for ${segmentEndCity}`);
    incrementRetry();
    fetchWeather();
  }, [segmentEndCity, incrementRetry, fetchWeather]);

  return {
    handleApiKeySet,
    handleTimeout,
    handleRetry
  };
};
