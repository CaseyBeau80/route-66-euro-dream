
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDebugService } from '../services/WeatherDebugService';

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

export const useSegmentWeatherState = (segmentEndCity: string, day: number): SegmentWeatherState => {
  WeatherDebugService.logWeatherFlow(`useSegmentWeatherState.init [${segmentEndCity}]`, {
    day,
    timestamp: new Date().toISOString()
  });

  const [weather, setWeatherInternal] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoadingInternal] = React.useState(false);
  const [error, setErrorInternal] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    WeatherDebugService.logWeatherStateChange(segmentEndCity, 'setWeather', {
      day,
      hasNewWeather: !!newWeather,
      previousWeather: !!weather,
      newWeatherData: newWeather ? {
        temperature: newWeather.temperature,
        highTemp: newWeather.highTemp,
        lowTemp: newWeather.lowTemp,
        isActualForecast: newWeather.isActualForecast
      } : null
    });

    setWeatherInternal(newWeather);
  }, [segmentEndCity, day, weather]);

  const setLoading = React.useCallback((newLoading: boolean) => {
    WeatherDebugService.logWeatherStateChange(segmentEndCity, 'setLoading', {
      day,
      newLoading,
      previousLoading: loading
    });

    setLoadingInternal(newLoading);
  }, [segmentEndCity, day, loading]);

  const setError = React.useCallback((newError: string | null) => {
    WeatherDebugService.logWeatherStateChange(segmentEndCity, 'setError', {
      day,
      newError,
      previousError: error
    });

    setErrorInternal(newError);
  }, [segmentEndCity, day, error]);

  // Reset state when city or day changes
  React.useEffect(() => {
    WeatherDebugService.logWeatherFlow(`useSegmentWeatherState.reset [${segmentEndCity}]`, {
      day,
      previousState: {
        hadWeather: !!weather,
        wasLoading: loading,
        hadError: !!error,
        retryCount
      }
    });

    setWeatherInternal(null);
    setErrorInternal(null);
    setRetryCount(0);
    setLoadingInternal(false);
  }, [segmentEndCity, day]);

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
