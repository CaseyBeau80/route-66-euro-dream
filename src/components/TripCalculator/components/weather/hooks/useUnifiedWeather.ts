
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

  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('🚫 UNIFIED: No segment date, skipping fetch for', cityName);
      return;
    }

    console.log('🚀 UNIFIED: Starting AGGRESSIVE live weather fetch for shared view:', cityName, {
      segmentDate: segmentDate.toISOString(),
      segmentDay,
      forcingLiveWeatherForSharedViews: true
    });

    setLoading(true);
    setError(null);

    try {
      // AGGRESSIVE API key detection - check ALL possible storage locations
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

      console.log('🔑 UNIFIED: AGGRESSIVE API key detection results:', {
        cityName,
        foundKeys: possibleKeys.length,
        hasValidKey: !!validApiKey,
        keyLength: validApiKey?.length || 0,
        keyPreview: validApiKey ? `${validApiKey.substring(0, 8)}...` : 'none',
        prioritizingLiveWeatherForSharedView: true
      });

      // Calculate days from today - be MORE permissive for shared views
      const daysFromNow = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const isWithinForecastRange = daysFromNow >= -2 && daysFromNow <= 7; // Expanded range for shared views
      
      console.log('📅 UNIFIED: Enhanced date analysis for shared view:', {
        cityName,
        daysFromNow,
        isWithinForecastRange,
        shouldAttemptLive: validApiKey && isWithinForecastRange,
        expandedRangeForSharedViews: true
      });

      // PRIORITIZE live forecast aggressively for shared views
      if (validApiKey && isWithinForecastRange) {
        console.log('✅ UNIFIED: Attempting LIVE WEATHER with enhanced shared view support:', cityName);
        
        const liveWeather = await fetchLiveWeatherDirect(cityName, segmentDate, validApiKey);
        
        if (liveWeather) {
          console.log('🎯 UNIFIED: LIVE WEATHER SUCCESS for shared view:', cityName, {
            temperature: liveWeather.temperature,
            source: liveWeather.source,
            isActualForecast: liveWeather.isActualForecast,
            description: liveWeather.description,
            highTemp: liveWeather.highTemp,
            lowTemp: liveWeather.lowTemp
          });
          setWeather(liveWeather);
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ UNIFIED: Live weather API failed, will use fallback for', cityName);
        }
      } else {
        console.log('📝 UNIFIED: Skipping live weather attempt for', cityName, {
          reason: !validApiKey ? 'no_valid_api_key' : 'outside_expanded_forecast_range',
          hasValidKey: !!validApiKey,
          isWithinForecastRange,
          daysFromNow
        });
      }

      // Create fallback weather as last resort
      console.log('🔄 UNIFIED: Creating fallback weather for', cityName);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);

    } catch (err) {
      console.error('❌ UNIFIED: Weather fetch error for', cityName, err);
      const fallbackWeather = createFallbackWeather(cityName, segmentDate, segmentDay);
      setWeather(fallbackWeather);
      setError('Weather temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, [cityName, segmentDate?.getTime(), segmentDay]);

  // Auto-fetch when dependencies change
  React.useEffect(() => {
    if (segmentDate) {
      console.log('🔄 UNIFIED: Auto-triggering weather fetch for', cityName);
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

// Enhanced live weather fetching with better error handling for shared views
const fetchLiveWeatherDirect = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌤️ UNIFIED: Starting ENHANCED live weather fetch for shared view:', cityName);

    // Get coordinates with enhanced city name processing
    const coords = await getCoordinatesEnhanced(cityName, apiKey);
    if (!coords) {
      console.log('❌ UNIFIED: Failed to get coordinates for', cityName);
      return null;
    }

    console.log('✅ UNIFIED: Got coordinates for', cityName, coords);

    // Fetch weather data with enhanced error handling
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      console.log('❌ UNIFIED: Weather API failed for', cityName, {
        status: response.status,
        statusText: response.statusText
      });
      return null;
    }

    const data = await response.json();
    if (!data.list || data.list.length === 0) {
      console.log('❌ UNIFIED: No forecast data for', cityName);
      return null;
    }

    console.log('✅ UNIFIED: Got forecast data for', cityName, {
      forecastItems: data.list.length,
      firstItemDate: data.list[0]?.dt_txt,
      lastItemDate: data.list[data.list.length - 1]?.dt_txt
    });

    // Enhanced date matching strategy
    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = null;

    // Strategy 1: Find exact date match
    bestMatch = data.list.find((item: any) => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === targetDateString;
    });

    // Strategy 2: Find closest match if no exact date
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
      console.log('❌ UNIFIED: No suitable forecast match for', cityName);
      return null;
    }

    const matchedDate = new Date(bestMatch.dt * 1000).toISOString().split('T')[0];
    console.log('✅ UNIFIED: Enhanced weather match found for shared view:', {
      cityName,
      targetDate: targetDateString,
      matchedDate,
      matchType: matchedDate === targetDateString ? 'exact' : 'closest',
      temperature: Math.round(bestMatch.main.temp),
      description: bestMatch.weather[0]?.description
    });

    // Create live forecast with verified properties for shared view
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

    console.log('🎯 UNIFIED: LIVE FORECAST CREATED for shared view:', {
      cityName,
      temperature: liveWeatherResult.temperature,
      highTemp: liveWeatherResult.highTemp,
      lowTemp: liveWeatherResult.lowTemp,
      isActualForecast: liveWeatherResult.isActualForecast,
      source: liveWeatherResult.source,
      description: liveWeatherResult.description,
      verifiedForSharedView: true
    });

    return liveWeatherResult;
  } catch (error) {
    console.error('❌ UNIFIED: Live weather fetch error for shared view:', error);
    return null;
  }
};

// Enhanced geocoding function with better US city handling
const getCoordinatesEnhanced = async (cityName: string, apiKey: string) => {
  try {
    // Enhanced city name processing for better geocoding results
    let cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    cleanCityName = cleanCityName.replace(/\s*(Route 66|Historic Route 66)/gi, '');
    
    console.log('🔍 UNIFIED: Enhanced geocoding for shared view:', cityName, '→', cleanCityName);

    // Try multiple geocoding strategies
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

        // Prefer US results
        const usResult = data.find((r: any) => r.country === 'US') || data[0];
        const coords = { lat: usResult.lat, lng: usResult.lon };
        
        console.log('✅ UNIFIED: Coordinates found with strategy:', searchTerm, coords);
        return coords;
      } catch (err) {
        console.warn('⚠️ UNIFIED: Geocoding strategy failed:', searchTerm, err);
        continue;
      }
    }
    
    console.log('❌ UNIFIED: All geocoding strategies failed for', cityName);
    return null;
  } catch (error) {
    console.error('❌ UNIFIED: Geocoding error:', error);
    return null;
  }
};

// Helper function to create fallback weather
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
