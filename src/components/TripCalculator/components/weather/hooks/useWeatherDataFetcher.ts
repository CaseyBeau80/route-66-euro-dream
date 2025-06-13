
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { useWeatherFetchLogic } from './useWeatherFetchLogic';
import { useLiveForecastGuard } from './useLiveForecastGuard';

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: {
    setWeather: (weather: ForecastWeatherData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    retryCount: number;
    incrementRetry: () => void;
    reset: () => void;
  };
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  
  console.log(`🎯 useWeatherDataFetcher initialized for ${segmentEndCity} Day ${segmentDay}`);

  const { fetchWeatherData } = useWeatherFetchLogic();
  const {
    shouldBlockFetch,
    shouldBlockDowngrade,
    updateLiveForecastState,
    resetOldLiveForecastState
  } = useLiveForecastGuard(segmentEndCity, segmentDay);

  const fetchWeather = React.useCallback(async () => {
    if (!tripStartDate || !hasApiKey) {
      return;
    }

    const now = Date.now();

    // Check if we should block this fetch
    if (shouldBlockFetch(now)) {
      return;
    }

    const enhancedActions = {
      ...actions,
      setWeather: (weather: ForecastWeatherData | null) => {
        if (weather) {
          const isLiveForecast = weather.isActualForecast === true || weather.source === 'live_forecast';
          
          // Check if we should block this update
          if (shouldBlockDowngrade(isLiveForecast, now)) {
            return;
          }

          // Update live forecast state before setting weather
          updateLiveForecastState(isLiveForecast, now);
        }
        
        actions.setWeather(weather);
      }
    };

    await fetchWeatherData(
      { segmentEndCity, segmentDay, tripStartDate, hasApiKey },
      enhancedActions
    );
  }, [
    segmentEndCity,
    segmentDay,
    tripStartDate,
    hasApiKey,
    actions,
    fetchWeatherData,
    shouldBlockFetch,
    shouldBlockDowngrade,
    updateLiveForecastState
  ]);

  // Auto-fetch effect
  React.useEffect(() => {
    const shouldFetch = hasApiKey && tripStartDate;
    
    console.log(`🚨 Auto-fetch effect for ${segmentEndCity} Day ${segmentDay}:`, {
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      retryCount: actions.retryCount,
      shouldFetch
    });

    if (shouldFetch) {
      const timeoutId = setTimeout(() => {
        console.log(`🚨 TRIGGERING AUTO FETCH for ${segmentEndCity} Day ${segmentDay}`);
        fetchWeather();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [fetchWeather, hasApiKey, tripStartDate, actions.retryCount]);

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      console.log(`🚨 handleApiKeySet for ${segmentEndCity} Day ${segmentDay}`);
      if (tripStartDate) {
        fetchWeather();
      }
    }, [fetchWeather, tripStartDate, segmentEndCity, segmentDay]),
    handleTimeout: React.useCallback(() => {
      console.log(`🚨 handleTimeout for ${segmentEndCity} Day ${segmentDay}`);
      actions.setError('Weather request timed out');
      actions.setLoading(false);
    }, [actions, segmentEndCity, segmentDay]),
    handleRetry: React.useCallback(() => {
      console.log(`🚨 handleRetry for ${segmentEndCity} Day ${segmentDay}`);
      resetOldLiveForecastState();
      actions.incrementRetry();
      fetchWeather();
    }, [fetchWeather, actions, resetOldLiveForecastState, segmentEndCity, segmentDay])
  };
};
