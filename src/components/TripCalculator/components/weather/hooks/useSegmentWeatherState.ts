
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataDebugger } from '../WeatherDataDebugger';

interface SegmentWeatherState {
  weather: ForecastWeatherData | null;
  setWeather: (weather: ForecastWeatherData | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
}

export const useSegmentWeatherState = (segmentEndCity: string, segmentDay: number): SegmentWeatherState => {
  const [weather, setWeatherInternal] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoadingInternal] = React.useState(false);
  const [error, setErrorInternal] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Enhanced setter with debugging
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    WeatherDataDebugger.debugWeatherFlow(
      `useSegmentWeatherState.setWeather [${segmentEndCity}] [Day ${segmentDay}]`,
      {
        hasNewWeather: !!newWeather,
        isActualForecast: newWeather?.isActualForecast,
        temperature: newWeather?.temperature,
        description: newWeather?.description,
        dateMatchInfo: newWeather?.dateMatchInfo
      }
    );
    setWeatherInternal(newWeather);
  }, [segmentEndCity, segmentDay]);

  const setLoading = React.useCallback((newLoading: boolean) => {
    if (newLoading !== loading) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeatherState.setLoading [${segmentEndCity}] [Day ${segmentDay}]`,
        { loading: newLoading }
      );
    }
    setLoadingInternal(newLoading);
  }, [loading, segmentEndCity, segmentDay]);

  const setError = React.useCallback((newError: string | null) => {
    if (newError !== error) {
      WeatherDataDebugger.debugWeatherFlow(
        `useSegmentWeatherState.setError [${segmentEndCity}] [Day ${segmentDay}]`,
        { error: newError }
      );
    }
    setErrorInternal(newError);
  }, [error, segmentEndCity, segmentDay]);

  // Debug state changes
  React.useEffect(() => {
    WeatherDataDebugger.debugComponentState(
      'useSegmentWeatherState',
      segmentEndCity,
      { weather, loading, error, retryCount }
    );
  }, [weather, loading, error, retryCount, segmentEndCity]);

  return {
    weather,
    setWeather,
    loading,
    setLoading,
    error,
    setError,
    retryCount,
    setRetryCount
  };
};
