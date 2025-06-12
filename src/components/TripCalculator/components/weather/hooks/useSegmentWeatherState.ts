
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
  // 🚨 DEBUG INJECTION: Hook initialization logging
  console.log('🚨 DEBUG: useSegmentWeatherState HOOK INIT', {
    segmentEndCity,
    day,
    timestamp: new Date().toISOString()
  });

  const [weather, setWeatherInternal] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoadingInternal] = React.useState(false);
  const [error, setErrorInternal] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Enhanced setWeather with debug logging
  const setWeather = React.useCallback((newWeather: ForecastWeatherData | null) => {
    // 🚨 DEBUG INJECTION: Weather state change logging
    console.log('🚨 DEBUG: useSegmentWeatherState.setWeather CALLED', {
      segmentEndCity,
      day,
      hasNewWeather: !!newWeather,
      previousWeather: !!weather,
      newWeatherData: newWeather ? {
        temperature: newWeather.temperature,
        highTemp: newWeather.highTemp,
        lowTemp: newWeather.lowTemp,
        isActualForecast: newWeather.isActualForecast,
        description: newWeather.description,
        source: newWeather.dateMatchInfo?.source
      } : null
    });

    setWeatherInternal(newWeather);
  }, [segmentEndCity, day, weather]);

  // Enhanced setLoading with debug logging
  const setLoading = React.useCallback((newLoading: boolean) => {
    // 🚨 DEBUG INJECTION: Loading state change logging
    console.log('🚨 DEBUG: useSegmentWeatherState.setLoading CALLED', {
      segmentEndCity,
      day,
      newLoading,
      previousLoading: loading
    });

    setLoadingInternal(newLoading);
  }, [segmentEndCity, day, loading]);

  // Enhanced setError with debug logging
  const setError = React.useCallback((newError: string | null) => {
    // 🚨 DEBUG INJECTION: Error state change logging
    console.log('🚨 DEBUG: useSegmentWeatherState.setError CALLED', {
      segmentEndCity,
      day,
      newError,
      previousError: error
    });

    setErrorInternal(newError);
  }, [segmentEndCity, day, error]);

  // Reset state when city or day changes
  React.useEffect(() => {
    // 🚨 DEBUG INJECTION: State reset logging
    console.log('🚨 DEBUG: useSegmentWeatherState RESETTING STATE', {
      segmentEndCity,
      day,
      previousState: {
        hadWeather: !!weather,
        wasLoading: loading,
        hadError: !!error,
        retryCount
      }
    });

    console.log(`🔄 Resetting weather state for ${segmentEndCity} Day ${day}`);
    setWeatherInternal(null);
    setErrorInternal(null);
    setRetryCount(0);
    setLoadingInternal(false);
  }, [segmentEndCity, day]);

  // 🚨 DEBUG INJECTION: Current state logging
  React.useEffect(() => {
    console.log('🚨 DEBUG: useSegmentWeatherState CURRENT STATE', {
      segmentEndCity,
      day,
      currentState: {
        hasWeather: !!weather,
        loading,
        error,
        retryCount,
        weatherValid: weather ? !!(weather.temperature || weather.highTemp || weather.lowTemp) : false
      }
    });
  }, [weather, loading, error, retryCount, segmentEndCity, day]);

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
