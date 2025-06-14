
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate: Date | null;
  segmentDay: number;
}

export const useUnifiedWeather = ({ cityName, segmentDate, segmentDay }: UseUnifiedWeatherProps) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚫 STANDARDIZED: No segment date, skipping fetch for', cityName);
      return;
    }

    console.log('🚀 STANDARDIZED: Starting weather fetch with unified logic:', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      standardizedApiKeyDetection: true
    });

    setLoading(true);
    setError(null);

    try {
      // STEP 1: STANDARDIZED API key detection using WeatherApiKeyManager
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      const apiKey = hasApiKey ? WeatherApiKeyManager.getApiKey() : null;

      console.log('🔑 STANDARDIZED: API key detection result:', {
        cityName,
        hasApiKey,
        keyLength: apiKey?.length || 0,
        keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'none',
        usingStandardizedDetection: true
      });

      // STEP 2: Calculate days from today for live forecast range
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 7;
      
      console.log('📅 STANDARDIZED: Date analysis:', {
        cityName,
        daysFromNow,
        isWithinForecastRange,
        shouldAttemptLive: hasApiKey && isWithinForecastRange,
        simplifiedLogic: true
      });

      // STEP 3: SIMPLIFIED weather fetching - direct live forecast attempt
      if (hasApiKey && apiKey && isWithinForecastRange) {
        console.log('✅ STANDARDIZED: Attempting live forecast with direct call:', cityName);
        
        const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('🎯 STANDARDIZED: Live forecast SUCCESS:', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            description: liveWeather.description,
            highTemp: liveWeather.highTemp,
            lowTemp: liveWeather.lowTemp,
            standardizedFlow: true
          });
          setWeather(liveWeather);
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ STANDARDIZED: Live weather failed, using fallback for', cityName);
        }
      } else {
        console.log('📝 STANDARDIZED: Skipping live weather attempt for', cityName, {
          reason: !hasApiKey ? 'no_api_key' : 'outside_forecast_range',
          hasApiKey,
          isWithinForecastRange,
          daysFromNow
        });
      }

      // STEP 4: Create fallback weather
      console.log('🔄 STANDARDIZED: Creating fallback weather for', cityName);
      const fallbackWeather = createStandardizedFallback(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ STANDARDIZED: Weather fetch error for', cityName, err);
      const fallbackWeather = createStandardizedFallback(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate) {
      console.log('🔄 STANDARDIZED: Auto-triggering weather fetch for', cityName);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), fetchWeather]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather
  };
};

// STANDARDIZED live weather fetching with proper source and isActualForecast values
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌤️ STANDARDIZED: Starting live weather fetch:', cityName);

    // Get coordinates
    const coords = await getCoordinatesStandardized(cityName, apiKey);
    if (!coords) {
      console.log('❌ STANDARDIZED: Failed to get coordinates for', cityName);
      return null;
    }

    console.log('✅ STANDARDIZED: Got coordinates for', cityName, coords);

    // Fetch weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ STANDARDIZED: Weather API failed for', cityName, {
        status: response.status,
        statusText: response.statusText
      });
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ STANDARDIZED: No forecast data for', cityName);
      return null;
    }

    console.log('✅ STANDARDIZED: Got forecast data for', cityName, {
      forecastItems: data.list.length,
      firstItemDate: data.list[0]?.dt_txt,
      lastItemDate: data.list[data.list.length - 1]?.dt_txt
    });

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = null;

    // Try exact date match first
    bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    // Use closest match if no exact date
    if (!bestMatch) {
      const targetTime = targetDate.getTime();
      bestMatch = data.list.reduce((closest: any, current: any) => {
        const currentTime = new Date(current.dt * 1000).getTime();
        const closestTime = new Date(closest.dt * 1000).getTime();
        return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) 
          ? current : closest;
      });
    }

    if (!bestMatch) {
      console.log('❌ STANDARDIZED: No suitable forecast match for', cityName);
      return null;
    }

    const matchedDate = new Date(bestMatch.dt * 1000).toISOString().split('T')[0];
    console.log('✅ STANDARDIZED: Weather match found:', {
      cityName,
      targetDate: targetDateString,
      matchedDate,
      matchType: matchedDate === targetDateString ? 'exact' : 'closest',
      temperature: Math.round(bestMatch.main.temp),
      description: bestMatch.weather[0]?.description
    });

    // CRITICAL: Create live forecast with correct source and isActualForecast values
    const liveWeatherResult: ForecastWeatherData = {
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
      isActualForecast: true, // CRITICAL: Must be true for live forecasts
      source: 'live_forecast' as const // CRITICAL: Must be 'live_forecast'
    };

    console.log('🎯 STANDARDIZED: Live forecast created with verified properties:', {
      cityName,
      temperature: liveWeatherResult.temperature,
      highTemp: liveWeatherResult.highTemp,
      lowTemp: liveWeatherResult.lowTemp,
      isActualForecast: liveWeatherResult.isActualForecast,
      source: liveWeatherResult.source,
      description: liveWeatherResult.description,
      verifiedProperties: true
    });

    return liveWeatherResult;
  } catch (error) {
    console.error('❌ STANDARDIZED: Live weather fetch error:', error);
    return null;
  }
};

// Standardized geocoding
const getCoordinatesStandardized = async (cityName: string, apiKey: string) => {
  try {
    let cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    cleanCityName = cleanCityName.replace(/\s*(Route 66|Historic Route 66)/gi, '');
    
    console.log('🔍 STANDARDIZED: Geocoding for:', cityName, '→', cleanCityName);

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
        const coords = { lat: usResult.lat, lng: usResult.lon };
        
        console.log('✅ STANDARDIZED: Coordinates found with strategy:', searchTerm, coords);
        return coords;
      } catch (err) {
        console.warn('⚠️ STANDARDIZED: Geocoding strategy failed:', searchTerm, err);
        continue;
      }
    }
    
    console.log('❌ STANDARDIZED: All geocoding strategies failed for', cityName);
    return null;
  } catch (error) {
    console.error('❌ STANDARDIZED: Geocoding error:', error);
    return null;
  }
};

// Standardized fallback weather creation
const createStandardizedFallback = (cityName: string, targetDate: Date, segmentDay: number): ForecastWeatherData => {
  const targetDateString = targetDate.toISOString().split('T')[0];
  const daysFromToday = Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  
  console.log('🔄 STANDARDIZED: Creating fallback weather:', {
    cityName,
    targetDateString,
    daysFromToday,
    segmentDay
  });

  const fallbackWeather = WeatherFallbackService.createFallbackForecast(
    cityName,
    targetDate,
    targetDateString,
    daysFromToday
  );

  console.log('✅ STANDARDIZED: Fallback weather created:', {
    cityName,
    temperature: fallbackWeather.temperature,
    description: fallbackWeather.description,
    source: fallbackWeather.source,
    isActualForecast: fallbackWeather.isActualForecast
  });

  return fallbackWeather;
};
