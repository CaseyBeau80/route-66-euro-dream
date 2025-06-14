
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { DateNormalizationService } from '../DateNormalizationService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🎯 FIXED: useWeatherCard for ${stateKey} - preventing infinite loops`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // CRITICAL FIX: Memoize segment date with stable dependencies
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      return DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
    } catch {
      return null;
    }
  }, [tripStartDate?.getTime(), segment.day]);

  // CRITICAL FIX: Stable fetch function with no infinite loop potential
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${hasApiKey}`;
    console.log(`🚀 FIXED: Starting weather fetch for ${fetchKey}`, { isSharedView });

    if (!segmentDate) {
      console.log(`❌ FIXED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey,
        isSharedView,
        segmentDay: segment.day
      });

      if (weather) {
        console.log(`✅ FIXED: Weather fetched for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ FIXED: No weather data for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ FIXED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), hasApiKey, weatherState, segment.endCity, segment.day]);

  // CRITICAL FIX: Use ref to track if fetch has been attempted to prevent loops
  const fetchAttempted = React.useRef(false);

  // CRITICAL FIX: Single auto-fetch effect with proper dependencies
  React.useEffect(() => {
    const shouldFetch = tripStartDate && 
                      segmentDate && 
                      !weatherState.weather && 
                      !weatherState.loading && 
                      !fetchAttempted.current;

    if (shouldFetch) {
      console.log(`🚨 FIXED: Auto-fetch triggered for ${stateKey}`, {
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weatherState.weather,
        loading: weatherState.loading
      });
      
      fetchAttempted.current = true;
      fetchWeather(false);
    }
  }, [tripStartDate?.getTime(), segmentDate?.getTime(), segment.endCity, segment.day]);

  // Reset fetch attempt when key dependencies change
  React.useEffect(() => {
    fetchAttempted.current = false;
  }, [stateKey, segmentDate?.getTime()]);

  console.log(`🎯 FIXED: useWeatherCard state for ${stateKey}:`, {
    hasApiKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate,
    fetchAttempted: fetchAttempted.current
  });

  return {
    hasApiKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
