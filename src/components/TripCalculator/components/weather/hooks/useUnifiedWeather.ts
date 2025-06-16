
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataValidator } from '../WeatherDataValidator';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';

interface UseUnifiedWeatherProps {
  cityName: string;
  segmentDate?: Date | null;
  segmentDay: number;
  prioritizeCachedData?: boolean;
  cachedWeather?: ForecastWeatherData | null;
}

interface UnifiedWeatherState {
  weather: ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useUnifiedWeather = ({
  cityName,
  segmentDate,
  segmentDay,
  prioritizeCachedData = false,
  cachedWeather = null
}: UseUnifiedWeatherProps) => {
  const [state, setState] = React.useState<UnifiedWeatherState>({
    weather: null,
    loading: false,
    error: null
  });

  // FIXED: Stable key that includes segment date for proper cache invalidation
  const stableKey = React.useMemo(() => {
    return `${cityName}-day-${segmentDay}-${segmentDate?.toISOString().split('T')[0] || 'no-date'}`;
  }, [cityName, segmentDay, segmentDate?.getTime()]);

  console.log('🔗 FIXED: useUnifiedWeather with REQUIRED segmentDate:', {
    stableKey,
    cityName,
    segmentDay,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toLocaleDateString(),
    prioritizeCachedData,
    hasCachedWeather: !!cachedWeather,
    fixedImplementation: 'REQUIRES_SEGMENT_DATE_FOR_VALIDATION'
  });

  // FIXED: Fetch weather function that ensures consistent validation
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.warn('⚠️ FIXED: useUnifiedWeather - segmentDate is required for consistent validation');
      setState(prev => ({ ...prev, error: 'Segment date required for weather validation' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`🚀 FIXED: Fetching weather for ${stableKey} with segmentDate:`, segmentDate.toLocaleDateString());

      // Try to get live weather if API key exists and within forecast range
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      const isWithinForecastRange = WeatherUtilityService.isWithinLiveForecastRange(segmentDate);

      let fetchedWeather: ForecastWeatherData | null = null;

      if (hasApiKey && isWithinForecastRange) {
        console.log(`🌤️ FIXED: Attempting live weather for ${cityName}`);
        fetchedWeather = await fetchLiveWeather();
      }

      // Fallback to historical weather
      if (!fetchedWeather) {
        console.log(`📊 FIXED: Using fallback weather for ${cityName}`);
        fetchedWeather = createFallbackWeather();
      }

      // FIXED: Always validate with segment date to ensure consistent source labeling
      const validationResult = WeatherDataValidator.validateWeatherData(
        fetchedWeather,
        cityName,
        segmentDate
      );

      console.log(`✅ FIXED: Weather validation for ${stableKey}:`, {
        originalSource: fetchedWeather?.source,
        validatedSource: validationResult.validation.source,
        isLiveForecast: validationResult.isLiveForecast,
        styleTheme: validationResult.validation.styleTheme,
        dateBasedDecision: validationResult.validation.dateBasedDecision,
        daysFromToday: validationResult.validation.daysFromToday
      });

      setState(prev => ({ 
        ...prev, 
        weather: validationResult.normalizedWeather, 
        loading: false 
      }));

    } catch (error) {
      console.error(`❌ FIXED: Weather fetch error for ${stableKey}:`, error);
      
      // Create fallback weather and validate it
      const fallbackWeather = createFallbackWeather();
      const validationResult = WeatherDataValidator.validateWeatherData(
        fallbackWeather,
        cityName,
        segmentDate
      );

      setState(prev => ({ 
        ...prev, 
        weather: validationResult.normalizedWeather, 
        loading: false, 
        error: 'Using estimated weather data' 
      }));
    }
  }, [segmentDate?.getTime(), cityName, stableKey]);

  // FIXED: Create fallback weather function
  const createFallbackWeather = (): ForecastWeatherData => {
    const targetDateString = segmentDate!.toISOString().split('T')[0];
    const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate!);
    
    return WeatherFallbackService.createFallbackForecast(
      cityName,
      segmentDate!,
      targetDateString,
      daysFromToday
    );
  };

  // FIXED: Live weather fetch function
  const fetchLiveWeather = async (): Promise<ForecastWeatherData | null> => {
    try {
      const apiKey = WeatherApiKeyManager.getApiKey();
      if (!apiKey) return null;

      // Get coordinates first
      const coords = await getCoordinates(apiKey);
      if (!coords) return null;

      // Fetch forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial`;
      const response = await fetch(weatherUrl);

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.list || data.list.length === 0) return null;

      // Find best match for the segment date
      const targetDateString = segmentDate!.toISOString().split('T')[0];
      const bestMatch = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || data.list[0];

      return {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName,
        forecast: [],
        forecastDate: segmentDate!,
        isActualForecast: true,
        source: 'live_forecast' as const
      };
    } catch (error) {
      console.error('❌ FIXED: Live weather fetch failed:', error);
      return null;
    }
  };

  // FIXED: Geocoding helper
  const getCoordinates = async (apiKey: string) => {
    try {
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const response = await fetch(geocodingUrl);
      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.length === 0) return null;

      const result = data.find((r: any) => r.country === 'US') || data[0];
      return { lat: result.lat, lng: result.lon };
    } catch (error) {
      console.error('❌ FIXED: Geocoding error:', error);
      return null;
    }
  };

  // FIXED: Auto-fetch effect with proper dependencies
  React.useEffect(() => {
    if (segmentDate && !state.weather && !state.loading) {
      console.log(`🔄 FIXED: Auto-fetching weather for ${stableKey}`);
      fetchWeather();
    }
  }, [segmentDate?.getTime(), stableKey, state.weather, state.loading, fetchWeather]);

  // Refetch function for manual refresh
  const refetch = React.useCallback(() => {
    console.log(`🔄 FIXED: Manual refetch for ${stableKey}`);
    setState(prev => ({ ...prev, weather: null }));
    fetchWeather();
  }, [fetchWeather, stableKey]);

  return {
    weather: state.weather,
    loading: state.loading,
    error: state.error,
    refetch
  };
};
