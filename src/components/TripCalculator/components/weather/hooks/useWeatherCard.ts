
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

      if (weather) {
        console.log(`✅ CENTRALIZED: Weather fetched for ${stateKey}:`, {
          temperature: weather.temperature,
          source: weather.source,
          isActualForecast: weather.isActualForecast
        });
        weatherState.setWeather(weather);
      } else {
        console.log(`⚠️ CENTRALIZED: No weather data returned for ${stateKey}`);
        weatherState.setError('Unable to fetch weather data');
      }
    } catch (error) {
      console.error(`❌ CENTRALIZED: Weather fetch error for ${stateKey}:`, error);
      weatherState.setError('Weather fetch failed');
    } finally {
      weatherState.setLoading(false);
    }
  }, [stateKey, segmentDate?.getTime(), enhancedApiKeyStatus.hasValidKey, weatherState, segment.endCity, segment.day]);

  // CENTRALIZED: Auto-fetch trigger with proper conditions
  React.useEffect(() => {
    console.log(`🚨 CENTRALIZED: Auto-fetch check for ${stateKey}`, {
      conditions: {
        hasTripStartDate: !!tripStartDate,
        hasSegmentDate: !!segmentDate,
        hasNoWeather: !weatherState.weather,
        isNotLoading: !weatherState.loading,
        hasValidApiKey: enhancedApiKeyStatus.hasValidKey
      },
      decision: 'checking_all_conditions'
    });

    // CENTRALIZED: Only auto-fetch if ALL conditions are met
    const shouldAutoFetch = tripStartDate && 
                           segmentDate && 
                           !weatherState.weather && 
                           !weatherState.loading;

    if (shouldAutoFetch) {
      console.log(`🚨 CENTRALIZED: AUTO-FETCH TRIGGERED for ${stateKey}`, {
        hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
        timestamp: new Date().toISOString()
      });
      
      // Trigger fetch immediately
      fetchWeather(false);
    } else {
      console.log(`⏸️ CENTRALIZED: Auto-fetch conditions not met for ${stateKey}`, {
        hasTripStartDate: !!tripStartDate,
        hasSegmentDate: !!segmentDate,
        hasWeather: !!weatherState.weather,
        isLoading: weatherState.loading
      });
    }
  }, [
    tripStartDate?.getTime(), 
    segmentDate?.getTime(), 
    weatherState.weather, 
    weatherState.loading, 
    enhancedApiKeyStatus.hasValidKey,
    fetchWeather, 
    stateKey
  ]);

  console.log(`🔑 CENTRALIZED: useWeatherCard final state for ${stateKey}:`, {
    hasValidApiKey: enhancedApiKeyStatus.hasValidKey,
    hasWeather: Boolean(weatherState.weather),
    loading: weatherState.loading,
    hasSegmentDate: Boolean(segmentDate)
  });

  return {
    hasApiKey: enhancedApiKeyStatus.hasValidKey,
    weatherState,
    segmentDate,
    fetchWeather
  };
};
