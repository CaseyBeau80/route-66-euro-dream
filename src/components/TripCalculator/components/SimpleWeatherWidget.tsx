
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { CentralizedWeatherApiKeyManager } from '../services/CentralizedWeatherApiKeyManager';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherFallbackService } from '@/components/Route66Map/services/weather/WeatherFallbackService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, Key } from 'lucide-react';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [apiKey, setApiKey] = React.useState('');
  const [isStoring, setIsStoring] = React.useState(false);
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const apiKeyManager = CentralizedWeatherApiKeyManager.getInstance();
  const hasApiKey = apiKeyManager.hasApiKey();

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    // Fallback for shared views
    if (isSharedView || isPDFExport) {
      const today = new Date();
      return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Function to fetch live weather data
  const fetchLiveWeather = async (cityName: string, targetDate: Date) => {
    const apiKey = apiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error('No API key available');
    }

    console.log('🌤️ Fetching live weather for', cityName, 'on', targetDate.toISOString());

    // Simple geocoding - you might want to use a more robust solution
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Failed to get city coordinates');
    }

    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon } = geoData[0];

    // Get weather forecast
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to get weather data');
    }

    const weatherData = await weatherResponse.json();
    
    // Find forecast for the target date
    const targetDateString = targetDate.toISOString().split('T')[0];
    const matchingForecast = weatherData.list.find((item: any) => {
      const forecastDate = new Date(item.dt * 1000);
      const forecastDateString = forecastDate.toISOString().split('T')[0];
      return forecastDateString === targetDateString;
    });

    if (matchingForecast) {
      console.log('✅ Found matching live forecast for', cityName);
      return {
        temperature: Math.round(matchingForecast.main.temp),
        highTemp: Math.round(matchingForecast.main.temp_max),
        lowTemp: Math.round(matchingForecast.main.temp_min),
        description: matchingForecast.weather[0].description,
        icon: matchingForecast.weather[0].icon,
        humidity: matchingForecast.main.humidity,
        windSpeed: Math.round(matchingForecast.wind.speed),
        precipitationChance: Math.round((matchingForecast.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: targetDateString,
          matchedDate: new Date(matchingForecast.dt * 1000).toISOString().split('T')[0],
          matchType: 'exact' as const,
          daysOffset: 0,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: 'high' as const
        }
      };
    }

    throw new Error('No forecast data for target date');
  };

  // Load weather data
  React.useEffect(() => {
    if (!segmentDate) return;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (hasApiKey) {
          console.log('🚀 Attempting to fetch LIVE weather for', segment.endCity);
          const liveWeather = await fetchLiveWeather(segment.endCity, segmentDate);
          setWeather(liveWeather);
          console.log('✅ Successfully got LIVE weather for', segment.endCity);
          return;
        }
      } catch (error) {
        console.warn('⚠️ Live weather failed, using fallback:', error);
        setError(`Live weather failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Fallback to historical weather
      console.log('📊 Using fallback weather for', segment.endCity);
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        segment.endCity,
        segmentDate,
        targetDateString,
        daysFromToday
      );
      
      setWeather(fallbackWeather);
      setLoading(false);
    };

    loadWeather();
  }, [segment.endCity, segmentDate, hasApiKey]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsStoring(true);
    try {
      WeatherApiKeyManager.setApiKey(apiKey.trim());
      apiKeyManager.invalidateCache();
      setApiKey('');
      
      // Reload weather with new API key
      window.location.reload();
    } catch (error) {
      console.error('Error setting API key:', error);
      setError('Invalid API key');
    } finally {
      setIsStoring(false);
    }
  };

  // Show API key input if no key available (except in shared views)
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-700">
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">Weather forecast for {segment.endCity}</span>
        </div>
        <p className="text-xs text-blue-600">
          Add your OpenWeatherMap API key to see live weather forecasts
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-sm h-8"
          />
          <Button
            onClick={handleSetApiKey}
            disabled={isStoring || !apiKey.trim()}
            size="sm"
            className="h-8 text-xs"
          >
            {isStoring ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Display weather
  if (weather && segmentDate) {
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast;
    
    return (
      <div className={`${isLive ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{segment.endCity}</span>
            {isLive && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">LIVE</span>}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">
              {weather.temperature ? `${weather.temperature}°F` : 
               weather.highTemp && weather.lowTemp ? `${weather.highTemp}°/${weather.lowTemp}°F` : 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-blue-600">
          <span>{segmentDate.toLocaleDateString()}</span>
          <span className="capitalize">{weather.description || 'Partly cloudy'}</span>
        </div>
        
        {weather.highTemp && weather.lowTemp && (
          <div className="text-xs text-blue-600 mt-1">
            High: {weather.highTemp}°F • Low: {weather.lowTemp}°F
          </div>
        )}
        
        <div className="text-xs text-blue-600 mt-1">
          💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph • 💦 {weather.humidity}%
        </div>
        
        {error && (
          <div className="mt-2 text-xs text-red-600">
            {error}
          </div>
        )}
        
        {!isLive && (
          <div className="mt-2 text-xs text-blue-500">
            Historical average • {hasApiKey ? 'Live forecast unavailable for this date' : 'Add API key for live forecast'}
          </div>
        )}
      </div>
    );
  }

  // Fallback display
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Cloud className="w-4 h-4" />
        <span className="text-sm">Weather info unavailable</span>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
