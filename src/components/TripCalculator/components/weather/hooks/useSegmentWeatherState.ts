
import { useState, useRef, useEffect } from 'react';

export const useSegmentWeatherState = (cityName: string, segmentDay: number) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);
  const subscriberId = useRef(`weather-${cityName}-${segmentDay}-${Date.now()}`);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset state when cityName or segmentDay changes
  useEffect(() => {
    setWeather(null);
    setError(null);
    setRetryCount(0);
    subscriberId.current = `weather-${cityName}-${segmentDay}-${Date.now()}`;
  }, [cityName, segmentDay]);

  console.log(`🌤️ useSegmentWeatherState for ${cityName} (Day ${segmentDay}):`, {
    hasWeather: !!weather,
    loading,
    error,
    retryCount,
    subscriberId: subscriberId.current
  });

  return {
    weather,
    setWeather,
    loading,
    setLoading,
    error,
    setError,
    retryCount,
    setRetryCount,
    mountedRef,
    subscriberId
  };
};
