
import { useState, useRef } from 'react';

export const useSegmentWeatherState = (segmentEndCity: string, segmentDay: number) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const mountedRef = useRef(true);
  const subscriberId = useRef(`widget-${segmentEndCity}-${segmentDay}-${Math.random()}`);

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
