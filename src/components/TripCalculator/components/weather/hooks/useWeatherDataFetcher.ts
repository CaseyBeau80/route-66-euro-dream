
import React from 'react';

// CRITICAL FIX: This component is completely removed to eliminate conflicts
// All weather fetching is now handled directly in useWeatherCard using SimpleWeatherFetcher

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: any;
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay
}: UseWeatherDataFetcherProps) => {
  console.log(`🚨 DEPRECATED: useWeatherDataFetcher for ${segmentEndCity} Day ${segmentDay} - this hook is now disabled`);

  // Return a no-op function to prevent crashes
  const fetchWeather = React.useCallback(async () => {
    console.log(`🚨 DEPRECATED: fetchWeather called but disabled for ${segmentEndCity}`);
  }, [segmentEndCity]);

  return { fetchWeather };
};
