
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { PublicWeatherService, PublicWeatherData } from '../services/PublicWeatherService';

interface UseSharedViewWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  isSharedView: boolean;
}

export const useSharedViewWeather = ({ 
  cityName, 
  segmentDate, 
  segmentDay, 
  isSharedView 
}: UseSharedViewWeatherProps) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSharedWeather = React.useCallback(async () => {
    if (!segmentDate || !isSharedView) {
      console.log('🚫 SHARED-WEATHER: Skipping - no date or not shared view');
      return;
    }

    console.log('🌍 SHARED-WEATHER: Fetching weather for shared view:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      isSharedView: true
    });

    setLoading(true);
    setError(null);

    try {
      const publicWeatherData = await PublicWeatherService.getWeatherForSharedView(
        cityName,
        segmentDate,
        segmentDay
      );

      if (publicWeatherData) {
        // Convert PublicWeatherData to ForecastWeatherData format
        const forecastWeatherData: ForecastWeatherData = {
          temperature: publicWeatherData.temperature,
          highTemp: publicWeatherData.highTemp,
          lowTemp: publicWeatherData.lowTemp,
          description: publicWeatherData.description,
          icon: publicWeatherData.icon,
          humidity: publicWeatherData.humidity,
          windSpeed: publicWeatherData.windSpeed,
          precipitationChance: publicWeatherData.precipitationChance,
          cityName: publicWeatherData.cityName,
          forecast: [],
          forecastDate: new Date(publicWeatherData.forecastDate),
          isActualForecast: publicWeatherData.isActualForecast,
          source: publicWeatherData.source,
          dateMatchInfo: {
            requestedDate: segmentDate.toISOString().split('T')[0],
            matchedDate: publicWeatherData.forecastDate.split('T')[0],
            matchType: publicWeatherData.isActualForecast ? 'exact' : 'seasonal-estimate',
            daysOffset: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            source: publicWeatherData.source,
            confidence: publicWeatherData.isActualForecast ? 'high' : 'medium'
          }
        };

        console.log('✅ SHARED-WEATHER: Weather data converted for shared view:', {
          cityName,
          temperature: forecastWeatherData.temperature,
          isActualForecast: forecastWeatherData.isActualForecast,
          source: forecastWeatherData.source,
          description: forecastWeatherData.description
        });

        setWeather(forecastWeatherData);
      } else {
        console.warn('⚠️ SHARED-WEATHER: No weather data received');
        setError('Weather data not available');
      }
    } catch (err) {
      console.error('❌ SHARED-WEATHER: Error fetching weather:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay, isSharedView]);

  React.useEffect(() => {
    if (isSharedView && segmentDate) {
      fetchSharedWeather();
    }
  }, [isSharedView, fetchSharedWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchSharedWeather
  };
};
