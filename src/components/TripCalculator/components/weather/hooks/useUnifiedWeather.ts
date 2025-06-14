
import { useState, useEffect, useCallback } from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

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
        console.log('❌ useUnifiedWeather: No segment date provided');
        setLoading(false);
        return;
      }

      console.log('🌤️ UNIFIED: useUnifiedWeather fetching for', cityName, {
        segmentDate: segmentDate.toISOString(),
        segmentDay,
        refetchTrigger
      });

      setLoading(true);
      setError(null);

      try {
        // Enhanced API key checking with detailed logging
        const hasApiKey = WeatherApiKeyManager.hasApiKey();
        const apiKey = WeatherApiKeyManager.getApiKey();
        const debugInfo = WeatherApiKeyManager.getDebugInfo();
        
        console.log('🔑 UNIFIED: Enhanced API key analysis:', {
          hasApiKey,
          keyLength: apiKey?.length || 0,
          keyPreview: apiKey ? apiKey.substring(0, 8) + '...' : 'none',
          debugInfo,
          willAttemptLiveFetch: hasApiKey && apiKey
        });

        // Calculate days from today with enhanced logging
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(segmentDate);
        targetDate.setHours(0, 0, 0, 0);
        
        const timeDiff = targetDate.getTime() - today.getTime();
        const daysFromToday = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

        console.log('📅 UNIFIED: Enhanced date calculation:', {
          today: today.toISOString(),
          targetDate: targetDate.toISOString(),
          daysFromToday,
          isWithinForecastRange,
          cityName
        });

        // Try live weather if we have API key and within range
        if (hasApiKey && apiKey && isWithinForecastRange) {
          console.log('🚀 UNIFIED: ATTEMPTING LIVE WEATHER FETCH for', cityName, {
            apiKeyAvailable: true,
            withinRange: true,
            daysFromToday,
            guaranteedAttempt: true
          });
          
          const liveWeather = await fetchLiveWeather(cityName, targetDate, apiKey);
          if (liveWeather) {
            console.log('✅ UNIFIED: LIVE WEATHER SUCCESS - FORCING LIVE PROPERTIES:', {
              cityName,
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast,
              verifyLiveProperties: {
                sourceIsLiveForecast: liveWeather.source === 'live_forecast',
                isActualForecastIsTrue: liveWeather.isActualForecast === true,
                bothPropertiesCorrect: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
              },
              guaranteedLiveWeather: true
            });
            setWeather(liveWeather);
            setLoading(false);
            return;
          } else {
            console.log('⚠️ UNIFIED: Live weather fetch returned null for', cityName);
          }
        } else {
          console.log('🚫 UNIFIED: Skipping live weather fetch for', cityName, {
            hasApiKey,
            isWithinForecastRange,
            daysFromToday,
            reason: !hasApiKey ? 'no_api_key' : !isWithinForecastRange ? 'outside_forecast_range' : 'unknown'
          });
        }

        // Fallback to historical weather
        console.log('📊 UNIFIED: Using historical fallback for', cityName);
        const fallbackWeather = createHistoricalWeather(cityName, targetDate);
        setWeather(fallbackWeather);

      } catch (err) {
        console.error('❌ UNIFIED: Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Still provide fallback weather on error
        if (segmentDate) {
          const fallbackWeather = createHistoricalWeather(cityName, segmentDate);
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

// Enhanced live weather fetching function with more detailed logging
const fetchLiveWeather = async (
  cityName: string,
  targetDate: Date,
  apiKey: string
): Promise<ForecastWeatherData | null> => {
  try {
    console.log('🌐 UNIFIED: fetchLiveWeather starting for', cityName, {
      targetDate: targetDate.toISOString(),
      apiKeyLength: apiKey.length,
      step: 'getting_coordinates'
    });

    // Get coordinates first
    const coords = await getCoordinates(cityName, apiKey);
    if (!coords) {
      console.log('❌ UNIFIED: No coordinates found for', cityName);
      return null;
    }

    console.log('📍 UNIFIED: Got coordinates for', cityName, coords);

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
    console.log('🌐 UNIFIED: Fetching forecast from API for', cityName);
    
    const response = await fetch(forecastUrl);

    if (!response.ok) {
      console.error('❌ UNIFIED: Weather API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data.list || data.list.length === 0) {
      console.log('❌ UNIFIED: No forecast data returned');
      return null;
    }

    console.log('📊 UNIFIED: Processing forecast data for', cityName, {
      forecastItems: data.list.length,
      targetDate: targetDate.toISOString()
    });

    // Find best match for target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    let bestMatch = null;
    let closestDiff = Infinity;
    
    for (const item of data.list) {
      const itemDate = new Date(item.dt * 1000);
      const itemDateString = itemDate.toISOString().split('T')[0];
      const timeDiff = Math.abs(itemDate.getTime() - targetDate.getTime());
      
      if (itemDateString === targetDateString || timeDiff < closestDiff) {
        bestMatch = item;
        closestDiff = timeDiff;
        
        if (itemDateString === targetDateString) {
          console.log('🎯 UNIFIED: Found exact date match for', cityName, itemDateString);
          break;
        }
      }
    }

    if (!bestMatch) {
      console.log('❌ UNIFIED: No suitable forecast found');
      return null;
    }

    console.log('✅ UNIFIED: Creating live weather object for', cityName, {
      matchedItem: {
        dt: bestMatch.dt,
        temp: bestMatch.main.temp,
        description: bestMatch.weather[0]?.description
      }
    });

    // Create live weather object with EXPLICIT live marking
    const liveWeather: ForecastWeatherData = {
      temperature: Math.round(bestMatch.main.temp),
      highTemp: Math.round(bestMatch.main.temp_max),
      lowTemp: Math.round(bestMatch.main.temp_min),
      description: bestMatch.weather[0]?.description || 'Clear',
      icon: bestMatch.weather[0]?.icon || '01d',
      humidity: bestMatch.main.humidity,
      windSpeed: Math.round(bestMatch.wind?.speed || 0),
      precipitationChance: Math.round((bestMatch.pop || 0) * 100),
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      // CRITICAL: EXPLICIT VALUES FOR LIVE WEATHER - FORCING THESE TO BE LIVE
      isActualForecast: true,
      source: 'live_forecast' as const
    };

    console.log('🔥 UNIFIED: LIVE WEATHER OBJECT CREATED - VERIFICATION:', {
      cityName,
      temperature: liveWeather.temperature,
      isActualForecast: liveWeather.isActualForecast,
      source: liveWeather.source,
      explicitLiveCheck: {
        sourceEquals: liveWeather.source === 'live_forecast',
        isActualEquals: liveWeather.isActualForecast === true,
        bothTrue: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
      },
      GUARANTEED_LIVE_WEATHER: true,
      WILL_PASS_CENTRALIZED_CHECK: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
    });

    return liveWeather;
  } catch (error) {
    console.error('❌ UNIFIED: Live weather fetch error:', error);
    return null;
  }
};

// Get coordinates for a city
const getCoordinates = async (cityName: string, apiKey: string) => {
  try {
    const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
    
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      console.error('❌ UNIFIED: Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      console.log('❌ UNIFIED: No geocoding results for', cleanCityName);
      return null;
    }

    const result = data.find((r: any) => r.country === 'US') || data[0];
    return { lat: result.lat, lng: result.lon };
  } catch (error) {
    console.error('❌ UNIFIED: Geocoding error:', error);
    return null;
  }
};

// Create historical fallback weather
const createHistoricalWeather = (cityName: string, targetDate: Date): ForecastWeatherData => {
  const month = targetDate.getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;
  const isSummer = month >= 5 && month <= 8;
  
  const baseTemp = isWinter ? 45 : isSummer ? 85 : 65;
  const tempVariation = Math.random() * 20 - 10;
  const temperature = Math.round(baseTemp + tempVariation);
  
  return {
    temperature,
    highTemp: temperature + 8,
    lowTemp: temperature - 8,
    description: isWinter ? 'Partly cloudy' : isSummer ? 'Sunny' : 'Clear',
    icon: isWinter ? '02d' : isSummer ? '01d' : '01d',
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 10),
    precipitationChance: Math.round(Math.random() * 30),
    cityName,
    forecast: [],
    forecastDate: targetDate,
    // CRITICAL: Historical data markers
    isActualForecast: false,
    source: 'historical_fallback' as const
  };
};
