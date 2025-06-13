
import React from 'react';

interface LiveForecastState {
  hasLiveForecast: boolean;
  lastLiveForecastTime: number | null;
  cityDay: string;
}

interface LastSuccessfulFetch {
  cityDay: string;
  timestamp: number;
  isLive: boolean;
}

export const useLiveForecastGuard = (segmentEndCity: string, segmentDay: number) => {
  const liveForecastStateRef = React.useRef<LiveForecastState>({
    hasLiveForecast: false,
    lastLiveForecastTime: null,
    cityDay: `${segmentEndCity}-${segmentDay}`
  });

  const lastSuccessfulFetchRef = React.useRef<LastSuccessfulFetch | null>(null);

  // Reset state when city/day changes
  React.useEffect(() => {
    const newCityDay = `${segmentEndCity}-${segmentDay}`;
    if (liveForecastStateRef.current.cityDay !== newCityDay) {
      console.log(`🚨 LIVE FORECAST RESET: City/day changed to ${newCityDay}`);
      liveForecastStateRef.current = {
        hasLiveForecast: false,
        lastLiveForecastTime: null,
        cityDay: newCityDay
      };
      lastSuccessfulFetchRef.current = null;
    }
  }, [segmentEndCity, segmentDay]);

  const shouldBlockFetch = React.useCallback((now: number): boolean => {
    // Check if we already have a recent live forecast
    if (liveForecastStateRef.current.hasLiveForecast && 
        liveForecastStateRef.current.lastLiveForecastTime &&
        (now - liveForecastStateRef.current.lastLiveForecastTime) < 300000) { // 5 minutes
      console.log(`🚨 GUARD: Skipping fetch - recent live forecast exists for ${segmentEndCity}`);
      return true;
    }
    return false;
  }, [segmentEndCity]);

  const shouldBlockDowngrade = React.useCallback((isLiveForecast: boolean, now: number): boolean => {
    // Block fallback data from overwriting live forecast
    if (liveForecastStateRef.current.hasLiveForecast && !isLiveForecast) {
      console.log(`🚨 ENHANCED GUARD: Blocking fallback from overwriting live forecast for ${segmentEndCity}`);
      return true;
    }

    // Check against last successful fetch to prevent downgrades
    if (lastSuccessfulFetchRef.current?.isLive && !isLiveForecast) {
      const timeSinceLastSuccess = now - lastSuccessfulFetchRef.current.timestamp;
      if (timeSinceLastSuccess < 600000) { // 10 minutes
        console.log(`🚨 RECENT SUCCESS GUARD: Blocking downgrade from live to fallback for ${segmentEndCity}`);
        return true;
      }
    }

    return false;
  }, [segmentEndCity]);

  const updateLiveForecastState = React.useCallback((isLiveForecast: boolean, now: number) => {
    if (isLiveForecast) {
      liveForecastStateRef.current = {
        hasLiveForecast: true,
        lastLiveForecastTime: now,
        cityDay: `${segmentEndCity}-${segmentDay}`
      };
      console.log(`🚨 LIVE FORECAST LOCKED: ${segmentEndCity} Day ${segmentDay} now has live forecast protection`);
    }

    // Update last successful fetch tracking
    lastSuccessfulFetchRef.current = {
      cityDay: `${segmentEndCity}-${segmentDay}`,
      timestamp: now,
      isLive: isLiveForecast
    };
  }, [segmentEndCity, segmentDay]);

  const resetOldLiveForecastState = React.useCallback(() => {
    const now = Date.now();
    if (liveForecastStateRef.current.lastLiveForecastTime &&
        (now - liveForecastStateRef.current.lastLiveForecastTime) > 600000) { // 10 minutes
      console.log(`🚨 RETRY: Resetting old live forecast state for ${segmentEndCity}`);
      liveForecastStateRef.current.hasLiveForecast = false;
      liveForecastStateRef.current.lastLiveForecastTime = null;
    }
  }, [segmentEndCity]);

  return {
    shouldBlockFetch,
    shouldBlockDowngrade,
    updateLiveForecastState,
    resetOldLiveForecastState,
    getLiveForecastState: () => liveForecastStateRef.current
  };
};
