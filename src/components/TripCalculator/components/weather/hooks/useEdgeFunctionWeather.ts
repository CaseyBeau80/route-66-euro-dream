
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { EdgeFunctionWeatherService } from '../services/EdgeFunctionWeatherService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

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

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 EDGE WEATHER: Starting fetch for', cityName);
      
      const edgeWeather = await EdgeFunctionWeatherService.fetchWeatherFromEdgeFunction({
        cityName,
        targetDate: segmentDate,
        segmentDay
      });

      if (edgeWeather) {
        console.log('✅ EDGE WEATHER: Successfully received weather:', {
          cityName,
          temperature: edgeWeather.temperature,
          highTemp: edgeWeather.highTemp,
          lowTemp: edgeWeather.lowTemp,
          source: edgeWeather.source
        });
        setWeather(edgeWeather);
      } else {
        console.log('🔄 EDGE WEATHER: Edge Function failed, using fallback for', cityName);
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          cityName,
          segmentDate,
          segmentDate.toISOString().split('T')[0],
          Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        );
        setWeather(fallbackWeather);
      }
    } catch (err) {
      console.error('❌ EDGE WEATHER: Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
      
      // Use fallback on error
      if (segmentDate) {
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          cityName,
          segmentDate,
          segmentDate.toISOString().split('T')[0],
          Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        );
        setWeather(fallbackWeather);
      }
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate, segmentDay]);

  const refetch = React.useCallback(() => {
    console.log('🔄 EDGE WEATHER: Manual refetch requested for', cityName);
    setRefreshTrigger(prev => prev + 1);
  }, [cityName]);

  React.useEffect(() => {
    fetchWeather();
  }, [fetchWeather, refreshTrigger]);

  return { weather, loading, error, refetch };
};
