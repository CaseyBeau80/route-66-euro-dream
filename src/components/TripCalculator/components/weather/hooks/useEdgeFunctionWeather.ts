
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from '../services/WeatherUtilityService';

const supabase = createClient(
  'https://xbwaphzntaxmdfzfsmvt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo'
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
      console.log('🎯 EDGE WEATHER: No segment date provided for', cityName, { segmentDay });
      return;
    }

    // Create a unique key for this request to prevent conflicts
    const requestKey = `${cityName}-${segmentDay}-${segmentDate.toISOString()}`;
    
    setLoading(true);
    setError(null);

    try {
      const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);
      const isWithinRange = WeatherUtilityService.isWithinLiveForecastRange(segmentDate);
      
      console.log('🎯 EDGE WEATHER: Starting fetch for', cityName, {
        requestKey,
        segmentDay,
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        daysFromToday,
        isWithinRange,
        shouldAttemptLive: isWithinRange
      });

      // Always try Edge Function for dates within range
      if (isWithinRange) {
        console.log('🎯 EDGE WEATHER: Calling Edge Function for', cityName, {
          requestKey,
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
          console.error('🎯 EDGE WEATHER: Edge Function error for', cityName, {
            requestKey,
            error: edgeError
          });
          throw new Error(`Edge Function error: ${edgeError.message}`);
        }

        console.log('🎯 EDGE WEATHER: Raw response from Edge Function:', {
          requestKey,
          cityName,
          segmentDay,
          data: edgeResponse,
          hasTemperature: !!(edgeResponse?.temperature),
          source: edgeResponse?.source,
          isActualForecast: edgeResponse?.isActualForecast,
          responseStructure: Object.keys(edgeResponse || {})
        });

        if (edgeResponse && edgeResponse.temperature !== undefined) {
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
            // CRITICAL: Use exact values from Edge Function response
            isActualForecast: edgeResponse.isActualForecast === true,
            source: edgeResponse.source === 'live_forecast' ? 'live_forecast' : 'historical_fallback'
          };

          console.log('🎯 EDGE WEATHER: Created weather data:', {
            requestKey,
            cityName,
            segmentDay,
            temperature: weatherData.temperature,
            source: weatherData.source,
            isActualForecast: weatherData.isActualForecast,
            shouldShowAsLive: weatherData.source === 'live_forecast' && weatherData.isActualForecast === true,
            edgeResponseSource: edgeResponse.source,
            edgeResponseIsActual: edgeResponse.isActualForecast
          });

          setWeather(weatherData);
          return;
        } else {
          console.warn('🎯 EDGE WEATHER: Edge Function returned invalid data for', cityName, {
            requestKey,
            response: edgeResponse
          });
        }
      }

      // Fallback to historical weather for dates outside range or on error
      console.log('🎯 EDGE WEATHER: Using historical fallback for', cityName, {
        requestKey,
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
      console.error('🎯 EDGE WEATHER: Error fetching weather for', cityName, {
        requestKey,
        error: error instanceof Error ? error.message : String(error)
      });
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
  }, [cityName, segmentDate, segmentDay, refreshTrigger]);

  const refetch = React.useCallback(() => {
    console.log('🎯 EDGE WEATHER: Manual refetch for', cityName, { segmentDay });
    setRefreshTrigger(prev => prev + 1);
  }, [cityName, segmentDay]);

  React.useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { weather, loading, error, refetch };
};
