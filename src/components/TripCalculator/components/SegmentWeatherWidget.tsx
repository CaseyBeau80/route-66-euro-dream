
import React, { useEffect, useState } from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { EnhancedWeatherService } from '@/components/Route66Map/services/weather/EnhancedWeatherService';
import { WeatherData } from '@/components/Route66Map/components/weather/WeatherTypes';
import { GeocodingService } from '../services/GeocodingService';
import EnhancedWeatherApiKeyInput from '@/components/Route66Map/components/weather/EnhancedWeatherApiKeyInput';
import WeatherLoading from './weather/WeatherLoading';
import WeatherError from './weather/WeatherError';
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
  const [apiKeyRefreshTrigger, setApiKeyRefreshTrigger] = useState(0);
  
  const weatherService = EnhancedWeatherService.getInstance();
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
    segmentDay: segment.day
  });

  const handleApiKeySet = () => {
    console.log('🔑 SegmentWeatherWidget: Enhanced API key set, triggering refresh');
    setApiKeyRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchWeather = async () => {
      console.log(`🌤️ SegmentWeatherWidget: fetchWeather called for ${segment.endCity}`, {
        hasApiKey,
        segmentDate,
        daysFromNow
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
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🌤️ SegmentWeatherWidget: Fetching weather for ${segment.endCity}`, coordinates);
        
        const weatherData = await weatherService.getWeatherData(
          coordinates.lat, 
          coordinates.lng, 
          segment.endCity
        );
        
        console.log(`🌤️ SegmentWeatherWidget: Weather fetch result for ${segment.endCity}:`, weatherData);
        
        if (weatherData) {
          setWeather(weatherData);
          console.log(`✅ SegmentWeatherWidget: Weather data set for ${segment.endCity}`);
        } else {
          console.warn(`❌ SegmentWeatherWidget: No weather data returned for ${segment.endCity}`);
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        console.error(`❌ SegmentWeatherWidget: Weather fetch error for ${segment.endCity}:`, err);
        setError('Weather service unavailable');
      } finally {
        setLoading(false);
        console.log(`🌤️ SegmentWeatherWidget: Finished fetching weather for ${segment.endCity}`);
      }
    };
    
    fetchWeather();
  }, [segment.endCity, hasApiKey, apiKeyRefreshTrigger]);

  const renderWeatherContent = () => {
    console.log(`🌤️ SegmentWeatherWidget: renderWeatherContent for ${segment.endCity}`, {
      hasApiKey,
      loading,
      error,
      hasWeather: !!weather,
      segmentDate,
      daysFromNow
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

    // Loading state
    if (loading) {
      console.log(`🌤️ SegmentWeatherWidget: Showing loading for ${segment.endCity}`);
      return <WeatherLoading />;
    }

    // Error state
    if (error) {
      console.log(`🌤️ SegmentWeatherWidget: Showing error for ${segment.endCity}:`, error);
      return <WeatherError error={error} />;
    }

    // Successfully fetched current weather data
    if (weather) {
      console.log(`✅ SegmentWeatherWidget: Showing current weather for ${segment.endCity}`, weather);
      return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
    }

    // No trip start date set - show message
    if (!segmentDate || daysFromNow === null) {
      console.log(`🌤️ SegmentWeatherWidget: No trip date set for ${segment.endCity}`);
      return (
        <div className="text-sm text-gray-500 italic">
          Set a trip start date to see weather information
        </div>
      );
    }

    // Too far in the future - show seasonal estimate
    if (daysFromNow > 16) {
      console.log(`🌤️ SegmentWeatherWidget: Trip too far in future for ${segment.endCity}, showing seasonal`);
      return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
    }

    // Beyond 5-day forecast range but within 16 days
    if (daysFromNow > 5) {
      console.log(`🌤️ SegmentWeatherWidget: Trip beyond 5-day forecast for ${segment.endCity}`);
      const message = "Weather forecasts are only available for the next 5 days. Check closer to your travel date.";
      return <WeatherStatusBadge type="unavailable" description={message} />;
    }

    // Fallback to seasonal display
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
