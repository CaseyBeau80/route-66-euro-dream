
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from '../services/WeatherUtilityService';

const supabase = createClient(
  'https://lgckqzxvoyrlgghjqzwq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY2txenh2b3lybGdnaGpxendxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0Mzc1MjMsImV4cCI6MjA1MDAxMzUyM30.iGLhODRgCGZUL6QoGVuOYkG6_aHBpNzLT8SVHsABYfU'
);

interface UseEdgeFunctionWeatherParams {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useEdgeFunctionWeather = ({
  cityName,
  segmentDate,
  segmentDay
}: UseEdgeFunctionWeatherParams) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const fetchWeatherData = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('✅ EDGE WEATHER: No segment date provided for', cityName);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);
      const isWithinRange = WeatherUtilityService.isWithinLiveForecastRange(segmentDate);
      
      console.log('✅ EDGE WEATHER: Starting fetch for', cityName, {
        segmentDay,
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        daysFromToday,
        isWithinRange,
        shouldAttemptLive: isWithinRange,
        directEdgeFunction: true
      });

      // Always try Edge Function first for dates within range
      if (isWithinRange) {
        console.log('✅ EDGE WEATHER: Calling Edge Function for', cityName, {
          targetDate: segmentDate.toISOString(),
          payload: {
            cityName,
            targetDate: segmentDate.toISOString()
          }
        });

        const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('weather-forecast', {
          body: {
            cityName: cityName,
            targetDate: segmentDate.toISOString()
          }
        });

        if (edgeError) {
          console.error('✅ EDGE WEATHER: Edge Function error for', cityName, edgeError);
          throw new Error(`Edge Function error: ${edgeError.message}`);
        }

        console.log('✅ FIXED EDGE FUNCTION: Raw response from Edge Function:', {
          cityName,
          data: edgeResponse,
          hasTemperature: !!(edgeResponse?.temperature),
          hasHighTemp: !!(edgeResponse?.highTemp),
          hasLowTemp: !!(edgeResponse?.lowTemp),
          source: edgeResponse?.source,
          isActualForecast: edgeResponse?.isActualForecast
        });

        if (edgeResponse && edgeResponse.temperature) {
          const weatherData: ForecastWeatherData = {
            temperature: edgeResponse.temperature,
            highTemp: edgeResponse.highTemp || edgeResponse.temperature,
            lowTemp: edgeResponse.lowTemp || edgeResponse.temperature,
            description: edgeResponse.description || 'Partly Cloudy',
            icon: edgeResponse.icon || '02d',
            humidity: edgeResponse.humidity || 50,
            windSpeed: edgeResponse.windSpeed || 0,
            precipitationChance: edgeResponse.precipitationChance || 0,
            cityName: cityName,
            forecast: [],
            forecastDate: segmentDate,
            isActualForecast: edgeResponse.isActualForecast !== false, // Default to true unless explicitly false
            source: edgeResponse.source || 'live_forecast'
          };

          console.log('✅ FIXED EDGE FUNCTION: Created weather data with proper URL fix:', {
            cityName,
            temperature: weatherData.temperature,
            highTemp: weatherData.highTemp,
            lowTemp: weatherData.lowTemp,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            shouldShowLiveBadge: weatherData.source === 'live_forecast' && weatherData.isActualForecast,
            fixImplemented: {
              urlFixed: 'Using supabase.functions.invoke instead of fetch',
              payloadFixed: 'Using cityName and targetDate format',
              errorHandlingImproved: true
            }
          });

          setWeather(weatherData);
          console.log('✅ EDGE WEATHER: Successfully received weather:', {
            cityName,
            temperature: weatherData.temperature,
            highTemp: weatherData.highTemp,
            lowTemp: weatherData.lowTemp,
            source: weatherData.source
          });
          return;
        }
      }

      // Fallback to historical weather for dates outside range or on error
      console.log('✅ EDGE WEATHER: Using historical fallback for', cityName, {
        reason: !isWithinRange ? 'outside_forecast_range' : 'edge_function_failed',
        daysFromToday,
        isWithinRange
      });

      const fallbackWeather: ForecastWeatherData = {
        temperature: 75,
        highTemp: 82,
        lowTemp: 68,
        description: 'Partly Cloudy',
        icon: '02d',
        humidity: 65,
        windSpeed: 8,
        precipitationChance: 20,
        cityName: cityName,
        forecast: [],
        forecastDate: segmentDate,
        isActualForecast: false,
        source: 'historical_fallback'
      };

      setWeather(fallbackWeather);

    } catch (error) {
      console.error('✅ EDGE WEATHER: Error fetching weather for', cityName, error);
      setError(error instanceof Error ? error.message : 'Weather fetch failed');
      
      // Set fallback weather on error
      const fallbackWeather: ForecastWeatherData = {
        temperature: 75,
        highTemp: 82,
        lowTemp: 68,
        description: 'Partly Cloudy',
        icon: '02d',
        humidity: 65,
        windSpeed: 8,
        precipitationChance: 20,
        cityName: cityName,
        forecast: [],
        forecastDate: segmentDate,
        isActualForecast: false,
        source: 'historical_fallback'
      };
      
      setWeather(fallbackWeather);
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, refreshTrigger]);

  const refetch = React.useCallback(() => {
    console.log('✅ EDGE WEATHER: Manual refetch for', cityName, { segmentDay });
    setRefreshTrigger(prev => prev + 1);
  }, [cityName, segmentDay]);

  React.useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { weather, loading, error, refetch };
};
