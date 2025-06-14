
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { useWeatherApiKey } from './useWeatherApiKey';
import { useSimpleWeatherState } from './useSimpleWeatherState';
import { SimpleWeatherFetcher } from '../SimpleWeatherFetcher';
import { ShareWeatherConfigService } from '../../../services/weather/ShareWeatherConfigService';

interface UseWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date | null;
}

export const useWeatherCard = ({ segment, tripStartDate }: UseWeatherCardProps) => {
  const stateKey = `${segment.endCity}-day-${segment.day}`;
  console.log(`🔑 FIXED: useWeatherCard for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // FIXED: Enhanced API key validation for shared views
  const enhancedApiKeyStatus = React.useMemo(() => {
    // For shared views, use ShareWeatherConfigService
    const sharedConfig = ShareWeatherConfigService.getShareWeatherConfig();
    
    // Primary detection from localStorage
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    const foundKey = primaryKey || legacyKey;
    
    const isValidKey = foundKey && 
                      foundKey.trim().length >= 20 && 
                      foundKey !== 'your_api_key_here' &&
                      /^[a-zA-Z0-9]+$/.test(foundKey);
    
    // Use shared config for shared views
    const effectiveHasValidKey = sharedConfig.hasApiKey && sharedConfig.canFetchLiveWeather;
    
    console.log(`🔑 FIXED: Enhanced API key validation for ${stateKey}`, {
      hasValidKey: !!isValidKey,
      keyLength: foundKey?.length || 0,
      sharedConfigHasKey: sharedConfig.hasApiKey,
      effectiveHasValidKey,
      canFetchLiveWeather: sharedConfig.canFetchLiveWeather
    });
    
    return { 
      hasValidKey: effectiveHasValidKey, 
      keyValue: foundKey,
      sharedConfig
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

  // FIXED: Enhanced fetch function for shared views
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const currentFetchKey = `${stateKey}-${segmentDate?.getTime()}-${enhancedApiKeyStatus.hasValidKey}-${isSharedView}`;
    
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

    console.log(`🚀 FIXED: Starting enhanced weather fetch for ${stateKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
      segmentDate: segmentDate?.toISOString(),
      canFetchLiveWeather: enhancedApiKeyStatus.sharedConfig.canFetchLiveWeather
    });

    fetchInProgressRef.current = true;
    lastFetchKeyRef.current = currentFetchKey;

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      // FIXED: Always use enhanced API key status for shared views
      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: enhancedApiKeyStatus.hasValidKey,
        isSharedView,
        segmentDay: segment.day
      });

      console.log(`📊 FIXED: Enhanced weather fetch result for ${stateKey}:`, {
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
  }, [segmentDate?.getTime(), segment.endCity, segment.day, enhancedApiKeyStatus.hasValidKey, enhancedApiKeyStatus.sharedConfig.canFetchLiveWeather, stateKey, weatherState]);

  // FIXED: Auto-fetch with enhanced shared view support
  React.useEffect(() => {
    const shouldAutoFetch = segmentDate && 
                           !weatherState.weather && 
                           !weatherState.loading && 
                           !fetchInProgressRef.current &&
                           enhancedApiKeyStatus.hasValidKey;
    
    if (shouldAutoFetch) {
      console.log(`🔄 FIXED: Auto-fetching weather with enhanced logic for ${stateKey}`);
      // Always pass true for isSharedView since we're using enhanced detection
      fetchWeather(true);
    }
  }, [segmentDate?.getTime(), weatherState.weather, weatherState.loading, enhancedApiKeyStatus.hasValidKey, fetchWeather]);

  console.log(`🔑 FIXED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
    hasWeather: !!weatherState.weather,
    loading: weatherState.loading,
    hasSegmentDate: !!segmentDate,
    sharedConfigCanFetch: enhancedApiKeyStatus.sharedConfig.canFetchLiveWeather
  });

  return {
    hasApiKey: enhancedApiKeyStatus.hasValidKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
