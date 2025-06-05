
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { WeatherData } from '@/components/Route66Map/components/weather/WeatherTypes';
import { GeocodingService } from '../services/GeocodingService';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';
import WeatherRequestDeduplicationService from './weather/WeatherRequestDeduplicationService';
import EnhancedWeatherLoading from './weather/EnhancedWeatherLoading';
import WeatherError from './weather/WeatherError';
import WeatherFallback from './weather/WeatherFallback';
import WeatherStatusBadge from './weather/WeatherStatusBadge';
import CurrentWeatherDisplay from './weather/CurrentWeatherDisplay';
import SeasonalWeatherDisplay from './weather/SeasonalWeatherDisplay';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ segment, tripStartDate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [apiKeyRefreshTrigger, setApiKeyRefreshTrigger] = useState(0);
  
  const weatherService = EnhancedWeatherService.getInstance();
  const deduplicationService = WeatherRequestDeduplicationService.getInstance();
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasApiKey = weatherService.hasApiKey();

  // Calculate the actual date for this segment
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
    : null;
  
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) 
    : null;

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity}`, {
    hasApiKey,
    tripStartDate,
    segmentDate,
    daysFromNow,
    segmentDay: segment.day,
    hasWeatherData: !!weather,
    loading,
    error,
    retryCount
  });

  const handleApiKeySet = useCallback(() => {
    console.log('🔑 SegmentWeatherWidget: Enhanced API key set, triggering refresh');
    setApiKeyRefreshTrigger(prev => prev + 1);
    setRetryCount(0);
    setError(null);
  }, []);

  const handleRetry = useCallback(() => {
    console.log(`🔄 SegmentWeatherWidget: Retry requested for ${segment.endCity} (attempt ${retryCount + 1})`);
    setRetryCount(prev => prev + 1);
    setError(null);
  }, [segment.endCity, retryCount]);

  const handleTimeout = useCallback(() => {
    console.log(`⏰ SegmentWeatherWidget: Request timeout for ${segment.endCity}`);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setError('Request timeout - please check your connection');
  }, [segment.endCity]);
  
  const fetchWeather = useCallback(async () => {
    console.log(`🌤️ SegmentWeatherWidget: fetchWeather called for ${segment.endCity}`, {
      hasApiKey,
      segmentDate,
      daysFromNow,
      retryCount
    });

    // Don't fetch if no API key
    if (!hasApiKey) {
      console.log('🌤️ SegmentWeatherWidget: No API key, skipping fetch');
      return;
    }
    
    const coordinates = GeocodingService.getCoordinatesForCity(segment.endCity);
    if (!coordinates) {
      console.warn(`🌤️ SegmentWeatherWidget: No coordinates found for ${segment.endCity}`);
      setError(`No coordinates found for ${segment.endCity}`);
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🌤️ SegmentWeatherWidget: Starting deduplicated weather request for ${segment.endCity}`);
      
      const requestKey = `weather-${coordinates.lat}-${coordinates.lng}-${segment.endCity}`;
      const weatherData = await deduplicationService.deduplicateRequest(
        requestKey,
        () => weatherService.getWeatherData(coordinates.lat, coordinates.lng, segment.endCity),
        12000 // 12 second timeout per request
      );
      
      console.log(`🌤️ SegmentWeatherWidget: Weather fetch result for ${segment.endCity}:`, weatherData);
      
      if (weatherData && !abortControllerRef.current?.signal.aborted) {
        setWeather(weatherData);
        setRetryCount(0); // Reset retry count on success
        console.log(`✅ SegmentWeatherWidget: Weather data set for ${segment.endCity}`);
      } else if (!abortControllerRef.current?.signal.aborted) {
        console.warn(`❌ SegmentWeatherWidget: No weather data returned for ${segment.endCity}`);
        setError('Unable to fetch weather data');
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error(`❌ SegmentWeatherWidget: Weather fetch error for ${segment.endCity}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Weather service error';
        setError(errorMessage);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
        console.log(`🌤️ SegmentWeatherWidget: Finished fetching weather for ${segment.endCity}`);
      }
    }
  }, [segment.endCity, hasApiKey, retryCount, weatherService, deduplicationService]);

  useEffect(() => {
    fetchWeather();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather, apiKeyRefreshTrigger]);

  const renderWeatherContent = () => {
    console.log(`🌤️ SegmentWeatherWidget: renderWeatherContent for ${segment.endCity}`, {
      hasApiKey,
      loading,
      error,
      hasWeather: !!weather,
      segmentDate,
      daysFromNow,
      retryCount
    });

    // No API key available - show enhanced input
    if (!hasApiKey) {
      console.log(`🌤️ SegmentWeatherWidget: Showing API key input for ${segment.endCity}`);
      return (
        <EnhancedWeatherApiKeyInput 
          onApiKeySet={handleApiKeySet}
          cityName={segment.endCity}
        />
      );
    }

    // Loading state with timeout handling
    if (loading) {
      console.log(`🌤️ SegmentWeatherWidget: Showing enhanced loading for ${segment.endCity}`);
      return <EnhancedWeatherLoading onTimeout={handleTimeout} />;
    }

    // Show fallback UI for repeated failures or network errors
    if (error && (retryCount >= 2 || error.includes('Failed to fetch') || error.includes('timeout'))) {
      console.log(`🌤️ SegmentWeatherWidget: Showing fallback UI for ${segment.endCity} (retries: ${retryCount})`);
      return (
        <WeatherFallback 
          cityName={segment.endCity}
          segmentDate={segmentDate}
          onRetry={handleRetry}
          error={error}
        />
      );
    }

    // Regular error state for first attempts
    if (error) {
      console.log(`🌤️ SegmentWeatherWidget: Showing error for ${segment.endCity}:`, error);
      return <WeatherError error={error} />;
    }

    // PRIORITY 1: Show weather data if we have it (regardless of trip date)
    if (weather) {
      console.log(`✅ SegmentWeatherWidget: Showing current weather for ${segment.endCity}`, weather);
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
    }

    // PRIORITY 2: No trip start date set - show message
    if (!segmentDate || daysFromNow === null) {
      console.log(`🌤️ SegmentWeatherWidget: No trip date set for ${segment.endCity}`);
      return (
        <div className="text-sm text-gray-500 italic">
          Set a trip start date to see weather information
        </div>
      );
    }

    // PRIORITY 3: Trip too far in the future - show seasonal estimate
    if (daysFromNow > 16) {
      console.log(`🌤️ SegmentWeatherWidget: Trip too far in future for ${segment.endCity}, showing seasonal`);
      return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
    }

    // PRIORITY 4: Beyond 5-day forecast range but within 16 days
    if (daysFromNow > 5) {
      console.log(`🌤️ SegmentWeatherWidget: Trip beyond 5-day forecast for ${segment.endCity}`);
      const message = "Weather forecasts are only available for the next 5 days. Check closer to your travel date.";
      return <WeatherStatusBadge type="unavailable" description={message} />;
    }

    // PRIORITY 5: Fallback to seasonal display
    console.log(`🌤️ SegmentWeatherWidget: Fallback to seasonal for ${segment.endCity}`);
    return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown">
          Weather in {segment.endCity}
        </h4>
        <div className="text-xs text-route66-vintage-brown">
          Day {segment.day}
          {segmentDate && (
            <div className="text-xs text-gray-600">
              {segmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {renderWeatherContent()}
    </div>
  );
};

export default SegmentWeatherWidget;
