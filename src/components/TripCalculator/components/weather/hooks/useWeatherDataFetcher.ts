
import React from 'react';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';
import { WeatherPersistenceService } from '../services/WeatherPersistenceService';
import { SimpleWeatherActions } from './useSimpleWeatherState';

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: SimpleWeatherActions;
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  console.log(`🎯 PLAN: useWeatherDataFetcher FIXED for ${segmentEndCity} Day ${segmentDay} - preventing fetch loops`);

  // CRITICAL FIX: Use ref to prevent multiple fetches for the same request
  const lastFetchRef = React.useRef<string>('');
  const isFetchingRef = React.useRef(false);

  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    if (!tripStartDate) {
      console.log(`❌ PLAN: No trip start date for ${segmentEndCity} Day ${segmentDay}`);
      return;
    }

    // CRITICAL FIX: Create unique request key to prevent duplicate fetches
    const requestKey = `${segmentEndCity}-${segmentDay}-${tripStartDate.getTime()}-${isSharedView}`;
    
    if (isFetchingRef.current || lastFetchRef.current === requestKey) {
      console.log(`🚫 PLAN: Skipping duplicate fetch for ${segmentEndCity} - already in progress or completed`);
      return;
    }

    isFetchingRef.current = true;
    lastFetchRef.current = requestKey;

    try {
      const segmentDate = new Date(tripStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
      
      console.log(`🚀 PLAN: Starting CONTROLLED weather fetch for ${segmentEndCity} Day ${segmentDay}`);

      actions.setLoading(true);
      actions.setError(null);

      // Check cache first for non-shared views
      if (!isSharedView) {
        const cachedWeather = WeatherPersistenceService.getWeatherData(segmentEndCity, segmentDate, segmentDay);
        if (cachedWeather) {
          console.log(`💾 PLAN: Using cached weather for ${segmentEndCity} Day ${segmentDay}`);
          actions.setWeather(cachedWeather);
          actions.setLoading(false);
          return;
        }
      }

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segmentEndCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay
      });

      if (weather) {
        console.log(`✅ PLAN: Weather fetched successfully for ${segmentEndCity} Day ${segmentDay}`);
        WeatherPersistenceService.storeWeatherData(segmentEndCity, segmentDate, weather, segmentDay);
        actions.setWeather(weather);
        actions.setLoading(false);
        actions.setError(null);
      } else {
        console.log(`⚠️ PLAN: No weather data returned for ${segmentEndCity} Day ${segmentDay}`);
        actions.setError('Unable to fetch weather data');
        actions.setLoading(false);
      }

    } catch (error) {
      console.error(`❌ PLAN: Weather fetch error for ${segmentEndCity} Day ${segmentDay}:`, error);
      actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      actions.setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // CRITICAL FIX: Only auto-fetch once, prevent multiple fetches
  React.useEffect(() => {
    if (tripStartDate && !isFetchingRef.current) {
      console.log(`🚨 PLAN: SINGLE AUTO FETCH for ${segmentEndCity} Day ${segmentDay}`);
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentEndCity, segmentDay]); // Use getTime() to prevent Date object recreation issues

  return { fetchWeather };
};
