
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataNormalizer } from '../services/WeatherDataNormalizer';
import { ForecastSourceAuditor } from '../services/ForecastSourceAuditor';

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
    
    console.log(`🚨 [FORECAST AUDIT] fetchWeather STARTING for ${segmentEndCity} Day ${segmentDay}`, {
      fetchId,
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

      // Start forecast audit
      ForecastSourceAuditor.startAudit(segmentEndCity, segmentDay, segmentDate);

      console.log(`🚨 [FORECAST AUDIT] Calling getWeatherDataForTripDate for ${segmentEndCity} Day ${segmentDay}`, {
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

      console.log(`🚨 [FORECAST AUDIT] Weather data received for ${segmentEndCity} Day ${segmentDay}:`, {
        fetchId,
        hasData: !!weatherDisplayData,
        source: weatherDisplayData?.source,
        isActualForecast: weatherDisplayData?.isActualForecast,
        liveForecastState: liveForecastStateRef.current
      });

      if (weatherDisplayData) {
        // FIXED: Use correct source value for live forecast detection
        const isLiveForecast = weatherDisplayData.isActualForecast === true || weatherDisplayData.source === 'live_forecast';
        
        // Record forecast source result
        if (isLiveForecast) {
          ForecastSourceAuditor.recordLiveForecastResult(segmentEndCity, segmentDay, true, undefined);
        } else {
          ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, `source_${weatherDisplayData.source}`);
        }
        
        // ENHANCED GUARD: Multiple protection layers
        if (liveForecastStateRef.current.hasLiveForecast && !isLiveForecast) {
          console.log(`🚨 ENHANCED GUARD: Blocking fallback data from overwriting live forecast for ${segmentEndCity} Day ${segmentDay}`, {
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
            console.log(`🚨 RECENT SUCCESS GUARD: Blocking downgrade from live to fallback for ${segmentEndCity} Day ${segmentDay}`, {
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
          console.log(`🚨 LIVE FORECAST LOCKED: ${segmentEndCity} Day ${segmentDay} now has live forecast protection`, {
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
          source: weatherDisplayData.source, // Pass through the explicit source
          dateMatchInfo: {
            requestedDate: DateNormalizationService.toDateString(segmentDate),
            matchedDate: DateNormalizationService.toDateString(segmentDate),
            matchType: isLiveForecast ? 'exact' : 'seasonal-estimate',
            daysOffset: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            source: isLiveForecast ? 'api-forecast' : 'seasonal-estimate',
            confidence: isLiveForecast ? 'high' : 'low'
          }
        };

        // Record final weather set in audit
        ForecastSourceAuditor.recordFinalWeatherSet(segmentEndCity, segmentDay, forecastData);

        console.log(`🚨 [FORECAST AUDIT] Setting weather data for ${segmentEndCity} Day ${segmentDay}:`, {
          fetchId,
          temperature: forecastData.temperature,
          isActualForecast: forecastData.isActualForecast,
          source: forecastData.source,
          liveForecastState: liveForecastStateRef.current
        });

        actions.setWeather(forecastData);
      } else {
        ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, 'no_weather_data');
        throw new Error('No weather data available');
      }
    } catch (error) {
      // Only set error if this is still the current fetch
      if (fetchId === currentFetchIdRef.current) {
        console.error(`🚨 [FORECAST AUDIT] Weather fetch error for ${segmentEndCity} Day ${segmentDay}:`, error);
        ForecastSourceAuditor.recordLiveForecastResult(
          segmentEndCity, 
          segmentDay, 
          false, 
          undefined, 
          error instanceof Error ? error.message : 'unknown_error'
        );
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
    
    console.log(`🚨 [FORECAST AUDIT] useWeatherDataFetcher auto-fetch effect for ${segmentEndCity} Day ${segmentDay}:`, {
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
        console.log(`🚨 [FORECAST AUDIT] TRIGGERING AUTO FETCH for ${segmentEndCity} Day ${segmentDay}`);
        fetchWeather();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [fetchWeather, hasApiKey, tripStartDate, actions.retryCount]);

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      console.log(`🚨 [FORECAST AUDIT] handleApiKeySet for ${segmentEndCity} Day ${segmentDay} - preserving live forecast state`);
      // DON'T reset live forecast state on API key changes
      if (tripStartDate) {
        fetchWeather();
      }
    }, [fetchWeather, tripStartDate, segmentEndCity, segmentDay]),
    handleTimeout: React.useCallback(() => {
      console.log(`🚨 [FORECAST AUDIT] handleTimeout for ${segmentEndCity} Day ${segmentDay}`);
      actions.setError('Weather request timed out');
      actions.setLoading(false);
    }, [actions, segmentEndCity, segmentDay]),
    handleRetry: React.useCallback(() => {
      console.log(`🚨 [FORECAST AUDIT] handleRetry for ${segmentEndCity} Day ${segmentDay} - preserving live forecast state if recent`);
      // Only reset live forecast state if it's old
      const now = Date.now();
      if (liveForecastStateRef.current.lastLiveForecastTime &&
          (now - liveForecastStateRef.current.lastLiveForecastTime) > 600000) { // 10 minutes
        console.log(`🚨 RETRY: Resetting old live forecast state for ${segmentEndCity} Day ${segmentDay}`);
        liveForecastStateRef.current.hasLiveForecast = false;
        liveForecastStateRef.current.lastLiveForecastTime = null;
      }
      
      actions.incrementRetry();
      fetchWeather();
    }, [fetchWeather, actions, segmentEndCity, segmentDay])
  };
};
