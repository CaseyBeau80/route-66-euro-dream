
import React from 'react';
import { addDays } from 'date-fns';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { useWeatherDataFetcher } from './useWeatherDataFetcher';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  console.log(`🎯 [WEATHER DEBUG] useWeatherCard hook for Day ${segment.day}:`, {
    component: 'useWeatherCard',
    segmentDay: segment.day,
    segmentEndCity: segment.endCity,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  console.log(`🎯 [WEATHER DEBUG] useWeatherCard hooks initialized for ${segment.endCity}:`, {
    component: 'useWeatherCard -> hooks',
    hasApiKey,
    weatherState: {
      hasWeather: !!weatherState.weather,
      loading: weatherState.loading,
      error: weatherState.error,
      retryCount: weatherState.retryCount
    }
  });

  const { fetchWeather } = useWeatherDataFetcher({
    segmentEndCity: segment.endCity,
    segmentDay: segment.day,
    tripStartDate,
    hasApiKey,
    actions: weatherState
  });

  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    try {
      return addDays(tripStartDate, segment.day - 1);
    } catch {
      return null;
    }
  }, [tripStartDate, segment.day]);

  console.log(`🎯 [WEATHER DEBUG] useWeatherCard segment date calculated for ${segment.endCity}:`, {
    component: 'useWeatherCard -> segmentDate',
    calculatedDate: segmentDate?.toISOString(),
    dayOffset: segment.day - 1
  });

  return {
    hasApiKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
