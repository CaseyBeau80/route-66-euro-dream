
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
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Reset state when city or day changes
  React.useEffect(() => {
    console.log(`🔄 Resetting weather state for ${segmentEndCity} Day ${day}`);
    setWeather(null);
    setError(null);
    setRetryCount(0);
    setLoading(false);
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
