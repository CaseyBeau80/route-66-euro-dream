
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { LiveWeatherService } from '../LiveWeatherService';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

interface UseUnifiedWeatherReturn {
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherProps): UseUnifiedWeatherReturn => {
  const [weather, setWeather] = useState<ForecastWeatherData | null>(cachedWeather);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate) {
        console.log('❌ useUnifiedWeather: No segment date provided for', cityName);
        setLoading(false);
        return;
      }

      console.log('🌤️ useUnifiedWeather: Starting weather fetch for', cityName, {
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        refetchTrigger
      });

      setLoading(true);
      setError(null);

      try {
        // Try to get live weather first
        console.log('🚀 useUnifiedWeather: Attempting live weather for', cityName);
        const liveWeather = await LiveWeatherService.fetchLiveWeather(cityName, segmentDate);
        
        if (liveWeather) {
          console.log('✅ useUnifiedWeather: Live weather SUCCESS for', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            GUARANTEED_LIVE: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
          });
          setWeather(liveWeather);
          setLoading(false);
          return;
        }

        // Fallback to historical weather
        console.log('📊 useUnifiedWeather: Using historical fallback for', cityName);
        const historicalWeather = LiveWeatherService.createHistoricalWeather(cityName, segmentDate);
        setWeather(historicalWeather);

      } catch (err) {
        console.error('❌ useUnifiedWeather: Weather fetch error for', cityName, ':', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Still provide fallback weather on error
        if (segmentDate) {
          const fallbackWeather = LiveWeatherService.createHistoricalWeather(cityName, segmentDate);
          setWeather(fallbackWeather);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName, segmentDate, segmentDay, refetchTrigger]);

  return { weather, loading, error, refetch };
};
