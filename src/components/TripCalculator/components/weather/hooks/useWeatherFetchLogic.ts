
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { getWeatherDataForTripDate } from '../getWeatherDataForTripDate';
import { DateNormalizationService } from '../DateNormalizationService';
import { WeatherDataNormalizer } from '../services/WeatherDataNormalizer';
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
      actions.setLoading(true);
      actions.setError(null);

      const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      
      if (!segmentDate) {
        throw new Error('Could not calculate segment date');
      }

      ForecastSourceAuditor.startAudit(segmentEndCity, segmentDay, segmentDate);

      const weatherDisplayData = await getWeatherDataForTripDate(
        segmentEndCity,
        segmentDate
      );

      // Check if this fetch is still current
      if (fetchId !== currentFetchIdRef.current) {
        console.log(`🚨 Ignoring stale fetch ${fetchId} for ${segmentEndCity}`);
        return;
      }

      if (weatherDisplayData) {
        const isLiveForecast = weatherDisplayData.isActualForecast === true || 
          weatherDisplayData.source === 'live_forecast';
        
        if (isLiveForecast) {
          ForecastSourceAuditor.recordLiveForecastResult(segmentEndCity, segmentDay, true, undefined);
        } else {
          ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, `source_${weatherDisplayData.source}`);
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
          source: weatherDisplayData.source,
          dateMatchInfo: {
            requestedDate: DateNormalizationService.toDateString(segmentDate),
            matchedDate: DateNormalizationService.toDateString(segmentDate),
            matchType: isLiveForecast ? 'exact' : 'seasonal-estimate',
            daysOffset: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            source: isLiveForecast ? 'api-forecast' : 'seasonal-estimate',
            confidence: isLiveForecast ? 'high' : 'low'
          }
        };

        ForecastSourceAuditor.recordFinalWeatherSet(segmentEndCity, segmentDay, forecastData);
        actions.setWeather(forecastData);
      } else {
        ForecastSourceAuditor.recordFallbackUsed(segmentEndCity, segmentDay, 'no_weather_data');
        throw new Error('No weather data available');
      }
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
    } finally {
      if (fetchId === currentFetchIdRef.current) {
        actions.setLoading(false);
      }
    }
  }, []);

  return { fetchWeatherData };
};
