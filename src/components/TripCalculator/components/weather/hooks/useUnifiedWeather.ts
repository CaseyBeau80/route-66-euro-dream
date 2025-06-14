import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { useSharedViewWeather } from './useSharedViewWeather';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
  isSharedView?: boolean;
}

export const useUnifiedWeather = ({ 
  cityName, 
  segmentDate, 
  segmentDay, 
  isSharedView = false 
}: UseUnifiedWeatherProps) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Use shared view weather hook for shared views
  const {
    weather: sharedWeather,
    loading: sharedLoading,
    error: sharedError,
    refetch: refetchShared
  } = useSharedViewWeather({
    cityName,
    segmentDate,
    segmentDay,
    isSharedView
  });

  const fetchRegularWeather = React.useCallback(async () => {
    if (!segmentDate || isSharedView) {
      console.log('🚫 UNIFIED: Skipping regular weather - no date or is shared view');
      return;
    }

    console.log('🚀 UNIFIED: Starting regular weather fetch for:', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      isSharedView: false
    });

    setLoading(true);
    setError(null);

    try {
      // Check for API key in regular views
      const possibleKeys = [
        localStorage.getItem('weather_api_key'),
        localStorage.getItem('openweathermap_api_key'),
        localStorage.getItem('OPENWEATHERMAP_API_KEY'),
        localStorage.getItem('WEATHER_API_KEY')
      ].filter(Boolean);

      const validApiKey = possibleKeys.find(key => 
        key && 
        key.length > 20 && 
        !key.includes('your_api_key') && 
        !key.includes('placeholder') &&
        !key.includes('REPLACE')
      );

      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= -2 && daysFromNow <= 7;
      
      // Try live forecast if API key available and within range
      if (validApiKey && isWithinForecastRange) {
        console.log('✅ UNIFIED: Attempting live weather with API key');
        
        const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, validApiKey);
        
        if (liveWeather) {
          console.log('🎯 UNIFIED: Live weather success:', {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast
          });
          setWeather(liveWeather);
          setLoading(false);
          return;
        }
      }

      // Create fallback weather
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ UNIFIED: Weather fetch error:', err);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay, isSharedView]);

  // Use appropriate weather source based on view type
  React.useEffect(() => {
    if (isSharedView) {
      // Shared view weather is handled by useSharedViewWeather hook
      console.log('🌍 UNIFIED: Using shared view weather hook');
      setWeather(sharedWeather);
      setLoading(sharedLoading);
      setError(sharedError);
    } else if (segmentDate) {
      // Regular view weather
      console.log('🔄 UNIFIED: Using regular weather fetch');
      fetchRegularWeather();
    }
  }, [isSharedView, sharedWeather, sharedLoading, sharedError, fetchRegularWeather]);

  const refetch = React.useCallback(() => {
    if (isSharedView) {
      refetchShared();
    } else {
      fetchRegularWeather();
    }
  }, [isSharedView, refetchShared, fetchRegularWeather]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};

// Enhanced live weather fetching function (unchanged)
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    const coords = await getCoordinatesEnhanced(cityName, apiKey);
    if (!coords) return null;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.list || data.list.length === 0) return null;

    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    if (!bestMatch) {
      const targetTime = targetDate.getTime();
      bestMatch = data.list.reduce((closest: any, current: any) => {
        const currentTime = new Date(current.dt * 1000).getTime();
        const closestTime = new Date(closest.dt * 1000).getTime();
        return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) 
          ? current : closest;
      });
    }

    if (!bestMatch) return null;

    return {
      temperature: Math.round(bestMatch.main.temp),
      highTemp: Math.round(bestMatch.main.temp_max),
      lowTemp: Math.round(bestMatch.main.temp_min),
      description: bestMatch.weather[0]?.description || 'Partly Cloudy',
      icon: bestMatch.weather[0]?.icon || '02d',
      humidity: bestMatch.main.humidity || 50,
      windSpeed: Math.round(bestMatch.wind?.speed || 0),
      precipitationChance: Math.round((bestMatch.pop || 0) * 100),
      cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: true,
      source: 'live_forecast' as const
    };
  } catch (error) {
    console.error('❌ UNIFIED: Live weather fetch error:', error);
    return null;
  }
};

const getCoordinatesEnhanced = async (cityName: string, apiKey: string) => {
  try {
    let cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    cleanCityName = cleanCityName.replace(/\s*(Route 66|Historic Route 66)/gi, '');

    const strategies = [
      `${cleanCityName},US`,
      `${cleanCityName}, United States`,
      cleanCityName
    ];

    for (const searchTerm of strategies) {
      try {
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=5&appid=${apiKey}`;
        
        const response = await fetch(geocodingUrl);
        if (!response.ok) continue;

        const data = await response.json();
        if (!data || data.length === 0) continue;

        const usResult = data.find((r: any) => r.country === 'US') || data[0];
        return { lat: usResult.lat, lng: usResult.lon };
      } catch (err) {
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ UNIFIED: Geocoding error:', error);
    return null;
  }
};

const createFallbackWeather = (cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData => {
  const targetDateString = targetDate.toISOString().split('T')[0];
  const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  return WeatherFallbackService.createFallbackForecast(
    cityName,
    targetDate,
    targetDateString,
    daysFromToday
  );
};
