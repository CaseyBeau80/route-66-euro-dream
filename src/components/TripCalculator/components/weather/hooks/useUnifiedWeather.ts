
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
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
  const [fetchKey, setFetchKey] = React.useState(0);

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚫 STANDARDIZED: Skipping fetch - no date:', { 
        cityName, 
        hasSegmentDate: !!segmentDate
      });
      return;
    }

    console.log('🚀 STANDARDIZED: Starting weather fetch with unified logic:', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      fetchKey,
      standardizedApiKeyDetection: true
    });

    setLoading(true);
    setError(null);
    // Clear existing weather to ensure fresh state
    setWeather(null);

    try {
      // STEP 1: ENHANCED API key detection - check all possible locations
      const apiKey = getApiKeyFromAllSources();
      const hasValidApiKey = !!(apiKey && apiKey.length >= 20 && !isPlaceholderKey(apiKey));

      console.log('🔑 STANDARDIZED: Enhanced API key detection result:', {
        cityName,
        hasValidApiKey,
        keyLength: apiKey?.length || 0,
        keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'none',
        enhancedDetection: true
      });

      // STEP 2: Calculate days from today for live forecast range
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= 0 && daysFromNow <= 7;
      
      console.log('📅 STANDARDIZED: Date analysis:', {
        cityName,
        daysFromNow,
        isWithinForecastRange,
        shouldAttemptLive: hasValidApiKey && isWithinForecastRange,
        enhancedLogic: true
      });

      // STEP 3: ATTEMPT LIVE FORECAST if conditions are met
      if (hasValidApiKey && apiKey && isWithinForecastRange) {
        console.log('✅ STANDARDIZED: Attempting live forecast with enhanced API key detection:', cityName);
        
        const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, apiKey);
        
        if (liveWeather) {
          console.log('🎯 STANDARDIZED: Live forecast SUCCESS - FORCING STATE UPDATE:', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            description: liveWeather.description,
            highTemp: liveWeather.highTemp,
            lowTemp: liveWeather.lowTemp,
            enhancedFlow: true,
            forcingStateUpdate: true
          });
          
          // CRITICAL: Force state update with explicit live forecast properties
          setWeather({
            ...liveWeather,
            source: 'live_forecast',
            isActualForecast: true
          });
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ STANDARDIZED: Live weather failed, using fallback for', cityName);
        }
      } else {
        console.log('📝 STANDARDIZED: Skipping live weather attempt for', cityName, {
          reason: !hasValidApiKey ? 'no_valid_api_key' : 'outside_forecast_range',
          hasValidApiKey,
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
  }, [cityName, segmentDate?.getTime(), segmentDay, fetchKey]);

  // CRITICAL: Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate) {
      console.log('🔄 STANDARDIZED: Auto-triggering weather fetch for', cityName, {
        hasSegmentDate: !!segmentDate,
        fetchKey,
        triggerCondition: 'dependency_change'
      });
      fetchWeather();
    }
  }, [segmentDate?.getTime(), fetchKey, fetchWeather]);

  // Manual refetch - increment fetchKey to force new fetch
  const refetch = React.useCallback(() => {
    console.log('🔄 STANDARDIZED: Manual refetch triggered for', cityName);
    setFetchKey(prev => prev + 1);
    setWeather(null);
    setError(null);
    setLoading(false);
  }, [cityName]);

  return {
    weather,
    loading,
    error,
    refetch
  };
};

// ENHANCED: Get API key from all possible sources
const getApiKeyFromAllSources = (): string | null => {
  // Check primary storage location
  const primaryKey = localStorage.getItem('weather_api_key');
  if (primaryKey && primaryKey.trim()) {
    console.log('🔑 Found API key in primary storage');
    return primaryKey.trim();
  }

  // Check legacy storage location
  const legacyKey = localStorage.getItem('openweathermap_api_key');
  if (legacyKey && legacyKey.trim()) {
    console.log('🔑 Found API key in legacy storage');
    return legacyKey.trim();
  }

  // Check other possible storage keys
  const alternativeKeys = [
    'openweather_api_key',
    'weather-api-key',
    'weatherApiKey',
    'owm_api_key'
  ];

  for (const keyName of alternativeKeys) {
    const key = localStorage.getItem(keyName);
    if (key && key.trim()) {
      console.log('🔑 Found API key in alternative storage:', keyName);
      return key.trim();
    }
  }

  console.log('🔑 No API key found in any storage location');
  return null;
};

// Check if API key is a placeholder
const isPlaceholderKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  return lowerKey.includes('your_api_key') || 
         lowerKey.includes('replace_with') ||
         lowerKey.includes('example') ||
         key === 'PLACEHOLDER_KEY';
};

// ENHANCED live weather fetching with proper source and isActualForecast values
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌤️ STANDARDIZED: Starting fetchLiveWeatherDirect:', cityName);

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

    // CRITICAL: Create live forecast with EXPLICIT properties to ensure proper detection
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
      isActualForecast: true, // EXPLICIT: This is a live forecast
      source: 'live_forecast' // EXPLICIT: Mark as live forecast
    };

    console.log('🎯 STANDARDIZED: CRITICAL - Live forecast created with EXPLICIT properties:', {
      cityName,
      temperature: liveWeatherResult.temperature,
      highTemp: liveWeatherResult.highTemp,
      lowTemp: liveWeatherResult.lowTemp,
      isActualForecast: liveWeatherResult.isActualForecast,
      source: liveWeatherResult.source,
      description: liveWeatherResult.description,
      explicitProperties: true,
      shouldShowLiveBadge: true
    });

    return liveWeatherResult;
  } catch (error) {
    console.error('❌ STANDARDIZED: fetchLiveWeatherDirect error:', error);
    return null;
  }
};

// Enhanced geocoding
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
