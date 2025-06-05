
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
  
  const weatherService = EnhancedWeatherService.getInstance();
  const deduplicationService = WeatherRequestDeduplicationService.getInstance();
  const mountedRef = useRef(true);
  const subscriberId = useRef(`widget-${segment.endCity}-${segment.day}-${Math.random()}`);

  const hasApiKey = weatherService.hasApiKey();

  // Calculate the actual date for this segment
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
    : null;
  
  const daysFromNow = segmentDate 
    ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) 
    : null;

  console.log(`🌤️ SegmentWeatherWidget: Rendering for ${segment.endCity} (Day ${segment.day})`, {
    hasApiKey,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    daysFromNow,
    subscriberId: subscriberId.current
  });

  const handleApiKeySet = useCallback(() => {
    console.log('🔑 API key set, clearing error and retry count');
    setError(null);
    setRetryCount(0);
  }, []);

  const handleRetry = useCallback(() => {
    console.log(`🔄 Retry requested for ${segment.endCity}`);
    setRetryCount(prev => prev + 1);
    setError(null);
  }, [segment.endCity]);

  const handleTimeout = useCallback(() => {
    console.log(`⏰ Timeout for ${segment.endCity}`);
    setLoading(false);
    setError('Request timeout - please check your connection');
  }, [segment.endCity]);
  
  const fetchWeather = useCallback(async () => {
    if (!hasApiKey) {
      console.log(`🌤️ No API key for ${segment.endCity}, skipping fetch`);
      return;
    }
    
    const coordinates = GeocodingService.getCoordinatesForCity(segment.endCity);
    if (!coordinates) {
      console.warn(`🌤️ No coordinates for ${segment.endCity}`);
      setError(`No coordinates found for ${segment.endCity}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const requestKey = `weather-${coordinates.lat}-${coordinates.lng}`;
      console.log(`🌤️ Starting weather fetch for ${segment.endCity} with key: ${requestKey}`);
      
      const weatherData = await deduplicationService.deduplicateRequest(
        requestKey,
        () => weatherService.getWeatherData(coordinates.lat, coordinates.lng, segment.endCity),
        subscriberId.current,
        10000
      );
      
      if (weatherData && mountedRef.current) {
        console.log(`✅ Weather data received for ${segment.endCity}:`, weatherData);
        setWeather(weatherData);
        setRetryCount(0);
      } else if (mountedRef.current) {
        console.warn(`❌ No weather data for ${segment.endCity}`);
        setError('Unable to fetch weather data');
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error(`❌ Weather fetch error for ${segment.endCity}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Weather service error';
        setError(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [segment.endCity, hasApiKey, weatherService, deduplicationService]);

  useEffect(() => {
    mountedRef.current = true;
    if (hasApiKey) {
      fetchWeather();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchWeather, hasApiKey, retryCount]);

  const renderWeatherContent = () => {
    console.log(`🎨 Rendering content for ${segment.endCity}:`, {
      hasApiKey,
      loading,
      error,
      hasWeather: !!weather,
      retryCount
    });

    // No API key - show input
    if (!hasApiKey) {
      return (
        <EnhancedWeatherApiKeyInput 
          onApiKeySet={handleApiKeySet}
          cityName={segment.endCity}
        />
      );
    }

    // Loading state
    if (loading) {
      return <EnhancedWeatherLoading onTimeout={handleTimeout} />;
    }

    // Show weather data if available
    if (weather) {
      console.log(`✨ Displaying weather for ${segment.endCity}:`, weather);
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
    }

    // Show fallback for repeated errors
    if (error && (retryCount >= 2 || error.includes('timeout'))) {
      return (
        <WeatherFallback 
          cityName={segment.endCity}
          segmentDate={segmentDate}
          onRetry={handleRetry}
          error={error}
        />
      );
    }

    // Show error
    if (error) {
      return <WeatherError error={error} />;
    }

    // Show seasonal fallback
    if (segmentDate) {
      return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
    }

    // Default message
    return (
      <div className="text-sm text-gray-500 italic">
        Set a trip start date to see weather information
      </div>
    );
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
