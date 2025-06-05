
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
  
  // Calculate the actual date for this segment
  const segmentDate = tripStartDate ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) : null;
  const daysFromNow = segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  
  // Check if API key is available using enhanced service
  const weatherService = EnhancedWeatherService.getInstance();
  const hasApiKey = weatherService.hasApiKey();

  const handleApiKeySet = () => {
    console.log('🔑 SegmentWeatherWidget: Enhanced API key set, triggering refresh');
    setApiKeyRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    const fetchWeather = async () => {
      if (!segmentDate || daysFromNow === null || !hasApiKey) return;
      
      // Only fetch real weather data for trips starting within 5 days
      if (daysFromNow > 5) return;
      
      const coordinates = GeocodingService.getCoordinatesForCity(segment.endCity);
      if (!coordinates) {
        console.warn(`No coordinates found for ${segment.endCity}`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const weatherData = await weatherService.getWeatherData(
          coordinates.lat, 
          coordinates.lng, 
          segment.endCity
        );
        
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Weather service unavailable');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [segment.endCity, segmentDate, daysFromNow, hasApiKey, apiKeyRefreshTrigger]);

  const renderWeatherContent = () => {
    // No API key available - show enhanced input
    if (!hasApiKey) {
      return (
        <EnhancedWeatherApiKeyInput 
          onApiKeySet={handleApiKeySet}
          cityName={segment.endCity}
        />
      );
    }

    // No trip start date set
    if (!segmentDate || daysFromNow === null) {
      return (
        <div className="text-sm text-gray-500 italic">
          Set a trip start date to see weather information
        </div>
      );
    }

    // Too far in the future - show seasonal estimate
    if (daysFromNow > 16) {
      return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
    }

    // Beyond 5-day forecast range but within 16 days
    if (daysFromNow > 5) {
      const message = daysFromNow > 16 
        ? "Weather forecasts are only available for the next 16 days. Check closer to your travel date."
        : "Weather forecasts are only available for the next 5 days. Check closer to your travel date.";
      
      return <WeatherStatusBadge type="unavailable" description={message} />;
    }

    // Within 5-day forecast range
    if (loading) {
      return <WeatherLoading />;
    }

    if (error) {
      return <WeatherError error={error} />;
    }

    if (!weather) {
      return <SeasonalWeatherDisplay segmentDate={segmentDate} cityName={segment.endCity} />;
    }

    return <CurrentWeatherDisplay weather={weather} segmentDate={segmentDate} />;
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
