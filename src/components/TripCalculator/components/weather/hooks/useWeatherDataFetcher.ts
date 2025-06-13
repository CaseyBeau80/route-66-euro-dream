
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

  // Track if we already have a live forecast to prevent overwrites
  const hasLiveForecastRef = React.useRef(false);
  const lastFetchIdRef = React.useRef(0);

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
    const fetchId = ++lastFetchIdRef.current;
    
    console.log(`🚨 FIXED: fetchWeather STARTING for ${segmentEndCity}`, {
      fetchId,
      segmentDay,
      tripStartDate: tripStartDate.toISOString(),
      hasApiKey,
      hasLiveForecast: hasLiveForecastRef.current,
      timestamp: new Date().toISOString()
    });

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

      // Check if this fetch is still current (not superseded by a newer fetch)
      if (fetchId !== lastFetchIdRef.current) {
        console.log(`🚨 STALE FETCH: Ignoring stale fetch ${fetchId} for ${segmentEndCity} (current: ${lastFetchIdRef.current})`);
        return;
      }

      console.log(`🚨 FIXED: Weather data received for ${segmentEndCity}:`, {
        fetchId,
        hasData: !!weatherDisplayData,
        source: weatherDisplayData?.source,
        isActualForecast: weatherDisplayData?.isActualForecast,
        hasLiveForecast: hasLiveForecastRef.current
      });

      if (weatherDisplayData) {
        const isLiveForecast = weatherDisplayData.isActualForecast || weatherDisplayData.source === 'forecast';
        
        // CRITICAL: Don't allow fallback data to overwrite live forecast
        if (hasLiveForecastRef.current && !isLiveForecast) {
          console.log(`🚨 GUARD: Preventing fallback data from overwriting live forecast for ${segmentEndCity}`, {
            fetchId,
            currentHasLive: hasLiveForecastRef.current,
            incomingIsLive: isLiveForecast,
            incomingSource: weatherDisplayData.source
          });
          return;
        }

        // Update live forecast status
        if (isLiveForecast) {
          hasLiveForecastRef.current = true;
          console.log(`🚨 LIVE FORECAST LOCKED: ${segmentEndCity} now has live forecast protection`, {
            fetchId,
            source: weatherDisplayData.source
          });
        }

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
          hasLiveForecast: hasLiveForecastRef.current
        });

        actions.setWeather(forecastData);
      } else {
        throw new Error('No weather data available');
      }
    } catch (error) {
      // Only set error if this is still the current fetch
      if (fetchId === lastFetchIdRef.current) {
        console.error(`🚨 FIXED: Weather fetch error for ${segmentEndCity}:`, error);
        actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      }
    } finally {
      // Only clear loading if this is still the current fetch
      if (fetchId === lastFetchIdRef.current) {
        actions.setLoading(false);
      }
    }
  }, [segmentEndCity, segmentDay, tripStartDate, hasApiKey, actions]);

  // Reset live forecast tracking when dependencies change
  React.useEffect(() => {
    hasLiveForecastRef.current = false;
    lastFetchIdRef.current = 0;
    console.log(`🚨 RESET: Live forecast tracking reset for ${segmentEndCity}`);
  }, [segmentEndCity, segmentDay, tripStartDate]);

  // FIXED: Auto-fetch effect that actually triggers and prevents race conditions
  React.useEffect(() => {
    console.log(`🚨 FIXED: useWeatherDataFetcher auto-fetch effect for ${segmentEndCity}:`, {
      hasApiKey,
      hasTripStartDate: !!tripStartDate,
      retryCount: actions.retryCount,
      hasLiveForecast: hasLiveForecastRef.current,
      shouldFetch: hasApiKey && tripStartDate
    });

    if (hasApiKey && tripStartDate) {
      console.log(`🚨 FIXED: TRIGGERING AUTO FETCH for ${segmentEndCity}`);
      fetchWeather();
    }
  }, [fetchWeather, hasApiKey, tripStartDate, actions.retryCount]);

  return {
    fetchWeather,
    handleApiKeySet: React.useCallback(() => {
      console.log(`🚨 FIXED: handleApiKeySet for ${segmentEndCity} - resetting live forecast tracking`);
      hasLiveForecastRef.current = false;
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
      console.log(`🚨 FIXED: handleRetry for ${segmentEndCity} - resetting live forecast tracking`);
      hasLiveForecastRef.current = false;
      actions.incrementRetry();
      fetchWeather();
    }, [fetchWeather, actions])
  };
};
