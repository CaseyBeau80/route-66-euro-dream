
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataNormalizer } from '../services/WeatherDataNormalizer';

interface UseWeatherDataFetcherProps {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date | null;
  hasApiKey: boolean;
  actions: {
    setWeather: (weather: ForecastWeatherData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    retryCount: number;
    incrementRetry: () => void;
    reset: () => void;
  };
}

export const useWeatherDataFetcher = ({
  segmentEndCity,
  segmentDay,
  tripStartDate,
  hasApiKey,
  actions
}: UseWeatherDataFetcherProps) => {
  
  console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher initialized:`, {
    component: 'useWeatherDataFetcher',
    segmentEndCity,
    segmentDay,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    hasApiKey
  });

  // Persistent live forecast tracking - only reset when absolutely necessary
  const liveForecastStateRef = React.useRef<{
    hasLiveForecast: boolean;
    lastLiveForecastTime: number | null;
    cityDay: string;
  }>({
    hasLiveForecast: false,
    lastLiveForecastTime: null,
    cityDay: `${segmentEndCity}-${segmentDay}`
  });

  const lastSuccessfulFetchRef = React.useRef<{
    cityDay: string;
    timestamp: number;
    isLive: boolean;
  } | null>(null);

  const currentFetchIdRef = React.useRef(0);

  // Only reset live forecast state if city/day combination actually changes
  React.useEffect(() => {
    const newCityDay = `${segmentEndCity}-${segmentDay}`;
    if (liveForecastStateRef.current.cityDay !== newCityDay) {
      console.log(`🚨 LIVE FORECAST RESET: City/day changed from ${liveForecastStateRef.current.cityDay} to ${newCityDay}`);
      liveForecastStateRef.current = {
        hasLiveForecast: false,
        lastLiveForecastTime: null,
        cityDay: newCityDay
      };
      lastSuccessfulFetchRef.current = null;
    }
  }, [segmentEndCity, segmentDay]);

  const fetchWeather = React.useCallback(async () => {
    if (!tripStartDate || !hasApiKey) {
      console.log(`🎯 [WEATHER DEBUG] useWeatherDataFetcher fetchWeather skipped:`, {
        component: 'useWeatherDataFetcher -> fetchWeather-skipped',
        segmentEndCity,
        reason: !tripStartDate ? 'no tripStartDate' : 'no apiKey',
        hasTripStartDate: !!tripStartDate,
        hasApiKey
      });
      return;
    }

    // Generate unique fetch ID to prevent race conditions
    const fetchId = ++currentFetchIdRef.current;
    const now = Date.now();
    
    console.log(`🚨 FIXED: fetchWeather STARTING for ${segmentEndCity}`, {
      fetchId,
      segmentDay,
      tripStartDate: tripStartDate.toISOString(),
      hasApiKey,
      liveForecastState: liveForecastStateRef.current,
      timestamp: new Date().toISOString()
    });

    // CRITICAL: Check if we already have a recent live forecast
    if (liveForecastStateRef.current.hasLiveForecast && 
        liveForecastStateRef.current.lastLiveForecastTime &&
        (now - liveForecastStateRef.current.lastLiveForecastTime) < 300000) { // 5 minutes
      console.log(`🚨 GUARD: Skipping fetch - recent live forecast exists for ${segmentEndCity}`, {
        fetchId,
        lastLiveForecastAge: now - liveForecastStateRef.current.lastLiveForecastTime,
        maxAge: 300000
      });
      return;
    }

    try {
      actions.setLoading(true);
      actions.setError(null);

      // Calculate the exact segment date
      const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      
      if (!segmentDate) {
        throw new Error('Could not calculate segment date');
      }

      console.log(`🚨 FIXED: Calling getWeatherDataForTripDate for ${segmentEndCity}`, {
        fetchId,
        segmentDate: segmentDate.toISOString(),
        daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      });

      const weatherDisplayData = await getWeatherDataForTripDate(
        segmentEndCity,
        segmentDate
      );

      // Check if this fetch is still current
      if (fetchId !== currentFetchIdRef.current) {
        console.log(`🚨 STALE FETCH: Ignoring stale fetch ${fetchId} for ${segmentEndCity} (current: ${currentFetchIdRef.current})`);
        return;
      }

      console.log(`🚨 FIXED: Weather data received for ${segmentEndCity}:`, {
        fetchId,
        hasData: !!weatherDisplayData,
        source: weatherDisplayData?.source,
        isActualForecast: weatherDisplayData?.isActualForecast,
        liveForecastState: liveForecastStateRef.current
      });

      if (weatherDisplayData) {
        const isLiveForecast = weatherDisplayData.isActualForecast === true || weatherDisplayData.source === 'forecast';
        
        // ENHANCED GUARD: Multiple protection layers
        if (liveForecastStateRef.current.hasLiveForecast && !isLiveForecast) {
          console.log(`🚨 ENHANCED GUARD: Blocking fallback data from overwriting live forecast for ${segmentEndCity}`, {
            fetchId,
            currentHasLive: liveForecastStateRef.current.hasLiveForecast,
            incomingIsLive: isLiveForecast,
            incomingSource: weatherDisplayData.source,
            lastLiveForecastTime: liveForecastStateRef.current.lastLiveForecastTime,
            action: 'BLOCKED'
          });
          return;
        }

        // Check against last successful fetch to prevent downgrades
        if (lastSuccessfulFetchRef.current?.isLive && !isLiveForecast) {
          const timeSinceLastSuccess = now - lastSuccessfulFetchRef.current.timestamp;
          if (timeSinceLastSuccess < 600000) { // 10 minutes
            console.log(`🚨 RECENT SUCCESS GUARD: Blocking downgrade from live to fallback for ${segmentEndCity}`, {
              fetchId,
              timeSinceLastSuccess,
              lastFetchWasLive: lastSuccessfulFetchRef.current.isLive,
              incomingIsLive: isLiveForecast
            });
            return;
          }
        }

        // Update live forecast state BEFORE setting weather
        if (isLiveForecast) {
          liveForecastStateRef.current = {
            hasLiveForecast: true,
            lastLiveForecastTime: now,
            cityDay: `${segmentEndCity}-${segmentDay}`
          };
          console.log(`🚨 LIVE FORECAST LOCKED: ${segmentEndCity} now has live forecast protection`, {
            fetchId,
            source: weatherDisplayData.source,
            timestamp: now
          });
        }

        // Update last successful fetch tracking
        lastSuccessfulFetchRef.current = {
          cityDay: `${segmentEndCity}-${segmentDay}`,
          timestamp: now,
          isLive: isLiveForecast
        };

        // Convert to ForecastWeatherData format
        const forecastData: ForecastWeatherData = {
          temperature: Math.round((weatherDisplayData.highTemp + weatherDisplayData.lowTemp) / 2),
          highTemp: weatherDisplayData.highTemp,
          lowTemp: weatherDisplayData.lowTemp,
          description: weatherDisplayData.description,
          icon: weatherDisplayData.icon,
          humidity: weatherDisplayData.humidity,
          windSpeed: weatherDisplayData.windSpeed,
          precipitationChance: weatherDisplayData.precipitationChance,
          cityName: weatherDisplayData.cityName,
          forecast: [],
          forecastDate: segmentDate,
          isActualForecast: isLiveForecast,
          dateMatchInfo: {
            requestedDate: DateNormalizationService.toDateString(segmentDate),
            matchedDate: DateNormalizationService.toDateString(segmentDate),
            matchType: isLiveForecast ? 'exact' : 'seasonal-estimate',
            daysOffset: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            source: isLiveForecast ? 'api-forecast' : 'seasonal-estimate',
            confidence: isLiveForecast ? 'high' : 'low'
          }
        };

        console.log(`🚨 FIXED: Setting weather data for ${segmentEndCity}:`, {
          fetchId,
          temperature: forecastData.temperature,
          isActualForecast: forecastData.isActualForecast,
          source: forecastData.dateMatchInfo?.source,
          liveForecastState: liveForecastStateRef.current
        });

        actions.setWeather(forecastData);
      } else {
        throw new Error('No weather data available');
      }
    } catch (error) {
      // Only set error if this is still the current fetch
      if (fetchId === currentFetchIdRef.current) {
        console.error(`🚨 FIXED: Weather fetch error for ${segmentEndCity}:`, error);
        actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      }
    } finally {
      // Only clear loading if this is still the current fetch
      if (fetchId === currentFetchIdRef.current) {
        actions.setLoading(false);
      }
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // ENHANCED: Auto-fetch effect with better conditions
  React.useEffect(() => {
    const shouldFetch = hasApiKey && tripStartDate;
    
    console.log(`🚨 FIXED: useWeatherDataFetcher auto-fetch effect for ${segmentEndCity}:`, {
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      retryCount: actions.retryCount,
      liveForecastState: liveForecastStateRef.current,
      shouldFetch,
      lastSuccessfulFetch: lastSuccessfulFetchRef.current
    });

    if (shouldFetch) {
      // Debounce rapid successive calls
      const timeoutId = setTimeout(() => {
        console.log(`🚨 FIXED: TRIGGERING AUTO FETCH for ${segmentEndCity}`);
        fetchWeather();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [fetchWeather, hasApiKey, tripStartDate, actions.retryCount]);

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      console.log(`🚨 FIXED: handleApiKeySet for ${segmentEndCity} - preserving live forecast state`);
      // DON'T reset live forecast state on API key changes
      if (tripStartDate) {
        fetchWeather();
      }
    }, [fetchWeather, tripStartDate]),
    handleTimeout: React.useCallback(() => {
      console.log(`🚨 FIXED: handleTimeout for ${segmentEndCity}`);
      actions.setError('Weather request timed out');
      actions.setLoading(false);
    }, [actions]),
    handleRetry: React.useCallback(() => {
      console.log(`🚨 FIXED: handleRetry for ${segmentEndCity} - preserving live forecast state if recent`);
      // Only reset live forecast state if it's old
      const now = Date.now();
      if (liveForecastStateRef.current.lastLiveForecastTime &&
          (now - liveForecastStateRef.current.lastLiveForecastTime) > 600000) { // 10 minutes
        console.log(`🚨 RETRY: Resetting old live forecast state for ${segmentEndCity}`);
        liveForecastStateRef.current.hasLiveForecast = false;
        liveForecastStateRef.current.lastLiveForecastTime = null;
      }
      
      actions.incrementRetry();
      fetchWeather();
    }, [fetchWeather, actions, segmentEndCity])
  };
};
