
import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, AlertTriangle, Thermometer, Eye } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { WeatherService } from '@/components/Route66Map/services/WeatherService';
import { WeatherData } from '@/components/Route66Map/components/weather/WeatherTypes';
import { GeocodingService } from '../services/GeocodingService';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const getWeatherIcon = (iconCode?: string, description?: string) => {
  if (iconCode) {
    return (
      <img 
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt={description || 'Weather'}
        className="h-12 w-12"
      />
    );
  }
  
  // Fallback to our icon logic if no API icon
  const lowerCondition = (description || '').toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
    return <CloudRain className="h-8 w-8 text-blue-500" />;
  }
  if (lowerCondition.includes('snow') || lowerCondition.includes('blizzard')) {
    return <CloudSnow className="h-8 w-8 text-blue-300" />;
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className="h-8 w-8 text-gray-500" />;
  }
  return <Sun className="h-8 w-8 text-yellow-500" />;
};

const getSeasonalWeatherData = (cityName: string, month: number) => {
  // Seasonal averages for Route 66 regions
  const seasonalData = {
    // Winter (Dec, Jan, Feb)
    winter: { high: 45, low: 25, condition: 'Cool and Clear' },
    // Spring (Mar, Apr, May)
    spring: { high: 68, low: 45, condition: 'Mild and Pleasant' },
    // Summer (Jun, Jul, Aug)
    summer: { high: 85, low: 65, condition: 'Hot and Sunny' },
    // Fall (Sep, Oct, Nov)
    fall: { high: 70, low: 48, condition: 'Cool and Clear' }
  };
  
  let season: keyof typeof seasonalData;
  if (month >= 12 || month <= 2) season = 'winter';
  else if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else season = 'fall';
  
  return {
    ...seasonalData[season],
    humidity: 45,
    windSpeed: 8
  };
};

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ segment, tripStartDate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyRefreshTrigger, setApiKeyRefreshTrigger] = useState(0);
  
  // Calculate the actual date for this segment
  const segmentDate = tripStartDate ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) : null;
  const daysFromNow = segmentDate ? Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : null;
  
  // Check if API key is available
  const weatherService = WeatherService.getInstance();
  const hasApiKey = weatherService.hasApiKey();

  const handleApiKeySet = () => {
    console.log('🔑 SegmentWeatherWidget: API key set, triggering refresh');
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

  const renderApiKeyInput = () => (
    <SimpleWeatherApiKeyInput 
      onApiKeySet={handleApiKeySet}
      cityName={segment.endCity}
    />
  );

  const renderForecastUnavailable = () => (
    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
      <AlertTriangle className="h-5 w-5 text-yellow-600" />
      <div className="text-sm text-yellow-800">
        <p className="font-semibold">Weather forecast unavailable</p>
        <p className="text-xs">
          {daysFromNow && daysFromNow > 16 
            ? "Weather forecasts are only available for the next 16 days. Check closer to your travel date."
            : "Weather forecasts are only available for the next 5 days. Check closer to your travel date."
          }
        </p>
      </div>
    </div>
  );

  const renderSeasonalEstimate = () => {
    if (!segmentDate) return null;
    
    const seasonalData = getSeasonalWeatherData(segment.endCity, segmentDate.getMonth() + 1);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
          <Eye className="h-4 w-4 text-blue-600" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Seasonal estimate</span> - Typical {segmentDate.toLocaleDateString('en-US', { month: 'long' })} weather
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getWeatherIcon(undefined, seasonalData.condition)}
          <div>
            <div className="font-semibold text-gray-800">{seasonalData.condition}</div>
            <div className="text-sm text-gray-600">{segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded p-2">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{seasonalData.high}°F</div>
            <div className="text-xs text-gray-500">Typical High</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{seasonalData.low}°F</div>
            <div className="text-xs text-gray-500">Typical Low</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between bg-white rounded p-1">
            <span className="text-gray-600">Avg Humidity:</span>
            <span className="font-semibold">{seasonalData.humidity}%</span>
          </div>
          <div className="flex justify-between bg-white rounded p-1">
            <span className="text-gray-600">Avg Wind:</span>
            <span className="font-semibold">{seasonalData.windSpeed} mph</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRealWeather = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
          <Cloud className="w-4 h-4 animate-pulse" />
          <span>Loading current weather...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">Weather unavailable</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      );
    }

    if (!weather) {
      return renderSeasonalEstimate();
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
          <Thermometer className="h-4 w-4 text-green-600" />
          <div className="text-xs text-green-800">
            <span className="font-semibold">Current conditions</span> - Live weather data
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.icon, weather.description)}
          <div>
            <div className="font-semibold text-gray-800 capitalize">{weather.description}</div>
            <div className="text-sm text-gray-600">
              {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white rounded p-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weather.temperature}°F</div>
            <div className="text-xs text-gray-500">Current Temp</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between bg-white rounded p-1">
            <span className="text-gray-600">Humidity:</span>
            <span className="font-semibold">{weather.humidity}%</span>
          </div>
          <div className="flex justify-between bg-white rounded p-1">
            <span className="text-gray-600">Wind:</span>
            <span className="font-semibold">{weather.windSpeed} mph</span>
          </div>
        </div>
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

      {/* Determine what weather content to show */}
      {!hasApiKey ? (
        renderApiKeyInput()
      ) : !segmentDate || daysFromNow === null ? (
        <div className="text-sm text-gray-500 italic">
          Set a trip start date to see weather information
        </div>
      ) : daysFromNow > 16 ? (
        renderSeasonalEstimate()
      ) : daysFromNow > 5 ? (
        renderForecastUnavailable()
      ) : (
        renderRealWeather()
      )}
    </div>
  );
};

export default SegmentWeatherWidget;
