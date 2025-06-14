
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { DateNormalizationService } from '../DateNormalizationService';
import { SimplifiedWeatherFetchingService } from '../services/SimplifiedWeatherFetchingService';
import { ForecastSourceAuditor } from '../services/ForecastSourceAuditor';

interface WeatherFetchParams {
  segmentEndCity: string;
  segmentDay: number;
  tripStartDate: Date;
  hasApiKey: boolean;
}

interface WeatherFetchActions {
  setWeather: (weather: ForecastWeatherData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWeatherFetchLogic = () => {
  const currentFetchIdRef = React.useRef(0);

  const fetchWeatherData = React.useCallback(async (
    params: WeatherFetchParams,
    actions: WeatherFetchActions
  ) => {
    const { segmentEndCity, segmentDay, tripStartDate, hasApiKey } = params;
    
    if (!tripStartDate || !hasApiKey) {
      console.log(`🎯 Weather fetch skipped for ${segmentEndCity}:`, {
        reason: !tripStartDate ? 'no tripStartDate' : 'no apiKey'
      });
      return;
    }

    const fetchId = ++currentFetchIdRef.current;
    
    console.log(`🚨 Starting weather fetch for ${segmentEndCity} Day ${segmentDay}`, {
      fetchId,
      tripStartDate: tripStartDate.toISOString()
    });

    try {
      const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      
      if (!segmentDate) {
        throw new Error('Could not calculate segment date');
      }

      ForecastSourceAuditor.startAudit(segmentEndCity, segmentDay, segmentDate);

      console.log(`🔧 Using SimplifiedWeatherFetchingService for ${segmentEndCity}`);
      
      await SimplifiedWeatherFetchingService.fetchWeatherForSegment(
        segmentEndCity,
        segmentDate,
        actions.setLoading,
        actions.setError,
        (weather: ForecastWeatherData | null) => {
          // Check if this fetch is still current
          if (fetchId !== currentFetchIdRef.current) {
            console.log(`🚨 Ignoring stale fetch ${fetchId} for ${segmentEndCity}`);
            return;
          }

          if (weather) {
            const isLiveForecast = weather.isActualForecast === true || 
              weather.source === 'live_forecast';
            
            console.log(`🔧 Weather received for ${segmentEndCity}:`, {
              isActualForecast: weather.isActualForecast,
              source: weather.source,
              isLiveForecast,
              temperature: weather.temperature
            });
            
            if (isLiveForecast) {
              ForecastSourceAuditor.recordLiveForecastResult(segmentEndCity, segmentDay, true, undefined);
            } else {
              ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, `source_${weather.source}`);
            }

            ForecastSourceAuditor.recordFinalWeatherSet(segmentEndCity, segmentDay, weather);
            actions.setWeather(weather);
          } else {
            ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, 'no_weather_data');
            throw new Error('No weather data available');
          }
        }
      );
    } catch (error) {
      if (fetchId === currentFetchIdRef.current) {
        console.error(`🚨 Weather fetch error for ${segmentEndCity}:`, error);
        ForecastSourceAuditor.recordLiveForecastResult(
          segmentEndCity, 
          segmentDay, 
          false, 
          undefined, 
          error instanceof Error ? error.message : 'unknown_error'
        );
        actions.setError(error instanceof Error ? error.message : 'Weather fetch failed');
      }
    }
  }, []);

  return { fetchWeatherData };
};
