
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🔑 FIXED: useWeatherCard for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // FIXED: Stable API key validation
  const enhancedApiKeyStatus = React.useMemo(() => {
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    const foundKey = primaryKey || legacyKey;
    
    const isValidKey = foundKey && 
                      foundKey.trim().length >= 20 && 
                      foundKey !== 'your_api_key_here' &&
                      /^[a-zA-Z0-9]+$/.test(foundKey);
    
    console.log(`🔑 FIXED: API key validation for ${stateKey}`, {
      hasValidKey: !!isValidKey,
      keyLength: foundKey?.length || 0
    });
    
    return { 
      hasValidKey: !!isValidKey, 
      keyValue: foundKey
    };
  }, [stateKey]); // Only depend on stateKey, not localStorage changes

  // FIXED: Stable segment date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    
    const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    console.log(`📅 FIXED: Segment date for ${stateKey}:`, {
      tripStart: tripStartDate?.toISOString(),
      day: segment.day,
      calculated: calculatedDate?.toISOString()
    });
    return calculatedDate;
  }, [tripStartDate?.getTime(), segment.day]); // Stable dependencies

  // FIXED: Prevent multiple fetches with ref tracking
  const fetchInProgressRef = React.useRef(false);
  const lastFetchKeyRef = React.useRef<string>('');

  // FIXED: Stable fetch function with better error handling
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const currentFetchKey = `${stateKey}-${segmentDate?.getTime()}-${enhancedApiKeyStatus.hasValidKey}`;
    
    // Prevent duplicate fetches
    if (fetchInProgressRef.current || lastFetchKeyRef.current === currentFetchKey) {
      console.log(`🚫 FIXED: Preventing duplicate fetch for ${stateKey}`);
      return;
    }
    
    if (!segmentDate) {
      console.log(`❌ FIXED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    console.log(`🚀 FIXED: Starting weather fetch for ${stateKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
      segmentDate: segmentDate?.toISOString()
    });

    fetchInProgressRef.current = true;
    lastFetchKeyRef.current = currentFetchKey;

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: enhancedApiKeyStatus.hasValidKey,
        isSharedView,
        segmentDay: segment.day
      });

      console.log(`📊 FIXED: Weather fetch result for ${stateKey}:`, {
        hasWeather: !!weather,
        source: weather?.source,
        isActualForecast: weather?.isActualForecast,
        temperature: weather?.temperature
      });

      weatherState.setWeather(weather);
    } catch (error) {
      console.error(`❌ FIXED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError(error instanceof Error ? error.message : 'Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [segmentDate?.getTime(), segment.endCity, segment.day, enhancedApiKeyStatus.hasValidKey, stateKey, weatherState]);

  // FIXED: Auto-fetch only when conditions are met and no weather exists
  React.useEffect(() => {
    const shouldAutoFetch = segmentDate && 
                           !weatherState.weather && 
                           !weatherState.loading && 
                           !fetchInProgressRef.current;
    
    if (shouldAutoFetch) {
      console.log(`🔄 FIXED: Auto-fetching weather for ${stateKey}`);
      fetchWeather(false);
    }
  }, [segmentDate?.getTime(), weatherState.weather, weatherState.loading, fetchWeather]);

  console.log(`🔑 FIXED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate
  });

  return {
    hasApiKey: enhancedApiKeyStatus.hasValidKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
