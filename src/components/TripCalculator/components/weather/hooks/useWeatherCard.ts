
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
  console.log(`🔑 CENTRALIZED: useWeatherCard with centralized utilities for ${stateKey}`);

  const { hasApiKey } = useWeatherApiKey(segment.endCity);
  const weatherState = useSimpleWeatherState(segment.endCity, segment.day);
  
  // CENTRALIZED: Simplified API key validation without complex refs
  const enhancedApiKeyStatus = React.useMemo(() => {
    const primaryKey = localStorage.getItem('weather_api_key');
    const legacyKey = localStorage.getItem('openweathermap_api_key');
    const foundKey = primaryKey || legacyKey;
    
    const isValidKey = foundKey && 
                      foundKey.trim().length >= 20 && 
                      foundKey !== 'your_api_key_here' &&
                      /^[a-zA-Z0-9]+$/.test(foundKey);
    
    console.log(`🔑 CENTRALIZED: Simple API key validation for ${stateKey}`, {
      hasValidKey: !!isValidKey,
      keySource: primaryKey ? 'primary' : legacyKey ? 'legacy' : 'none'
    });
    
    return { 
      hasValidKey: !!isValidKey, 
      keyValue: foundKey,
      keySource: primaryKey ? 'primary' : legacyKey ? 'legacy' : 'none'
    };
  }, []); // Empty dependency array - only check once per mount

  // CENTRALIZED: Use WeatherUtilityService for segment date calculation
  const segmentDate = React.useMemo(() => {
    const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    console.log(`📅 CENTRALIZED: Segment date for ${stateKey}:`, {
      tripStart: tripStartDate?.toISOString(),
      day: segment.day,
      calculated: calculatedDate?.toISOString()
    });
    return calculatedDate;
  }, [tripStartDate?.getTime(), segment.day, stateKey]);

  // CENTRALIZED: Weather fetch with simplified logic
  const fetchWeather = React.useCallback(async (isSharedView: boolean = false) => {
    const fetchKey = `${stateKey}-${segmentDate?.getTime()}-${Date.now()}`;
    console.log(`🚀 CENTRALIZED: Weather fetch for ${fetchKey}`, { 
      isSharedView,
      hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
      segmentDate: segmentDate?.toISOString()
    });

    if (!segmentDate) {
      console.log(`❌ CENTRALIZED: No segment date for ${stateKey}`);
      weatherState.setError('Missing trip date');
      return;
    }

    try {
      weatherState.setLoading(true);
      weatherState.setError(null);

      console.log(`🌤️ CENTRALIZED: Calling SimpleWeatherFetcher for ${stateKey}`);

      const weather = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: enhancedApiKeyStatus.hasValidKey,
        isSharedView,
        segmentDay: segment.day
      });

      console.log(`📊 CENTRALIZED: Weather fetch result for ${stateKey}:`, {
        hasWeather: !!weather,
        source: weather?.source,
        isActualForecast: weather?.isActualForecast,
        temperature: weather?.temperature
      });

      weatherState.setWeather(weather);
    } catch (error) {
      console.error(`❌ CENTRALIZED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError(error instanceof Error ? error.message : 'Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [segmentDate, segment.endCity, segment.day, enhancedApiKeyStatus.hasValidKey, stateKey, weatherState]);

  // CENTRALIZED: Auto-fetch when component mounts or dependencies change
  React.useEffect(() => {
    if (segmentDate && !weatherState.weather && !weatherState.loading) {
      console.log(`🔄 CENTRALIZED: Auto-fetching weather for ${stateKey}`);
      fetchWeather(false);
    }
  }, [segmentDate, weatherState.weather, weatherState.loading, fetchWeather, stateKey]);

  console.log(`🔑 CENTRALIZED: useWeatherCard final state for ${stateKey}:`, {
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
