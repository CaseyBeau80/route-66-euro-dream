
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, Key, ExternalLink } from 'lucide-react';

interface ForecastWeatherData {
  temperature: number;
  highTemp?: number;
  lowTemp?: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  cityName: string;
  forecast: any[];
  forecastDate: Date;
  isActualForecast: boolean;
  source: 'live_forecast' | 'historical_fallback';
}

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

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    if (isSharedView || isPDFExport) {
      const today = new Date();
      return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // SIMPLIFIED: Direct live weather API call
  const fetchLiveWeather = async (cityName: string, targetDate: Date): Promise<ForecastWeatherData | null> => {
    const apiKey = WeatherApiKeyManager.getApiKey();
    console.log('🚀 LIVE WEATHER: Starting fetch for', cityName, {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      targetDate: targetDate.toISOString()
    });

    if (!apiKey || apiKey.length < 10) {
      console.log('❌ LIVE WEATHER: No valid API key');
      return null;
    }

    // Check if date is within forecast range (0-5 days from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedTarget = new Date(targetDate);
    normalizedTarget.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((normalizedTarget.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('📅 LIVE WEATHER: Date check', {
      daysFromToday,
      withinRange: daysFromToday >= 0 && daysFromToday <= 5
    });

    if (daysFromToday < 0 || daysFromToday > 5) {
      console.log('📅 LIVE WEATHER: Date outside forecast range');
      return null;
    }

    try {
      // Get coordinates
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      console.log('🌐 LIVE WEATHER: Geocoding', cleanCityName);
      
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
      }

      const geocodeData = await geocodeResponse.json();
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('No geocoding results found');
      }

      const coords = geocodeData.find((r: any) => r.country === 'US') || geocodeData[0];
      console.log('📍 LIVE WEATHER: Got coordinates', { lat: coords.lat, lon: coords.lon });

      // Get weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Weather API failed: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) {
        throw new Error('No forecast data available');
      }

      // Find best forecast match
      const targetDateString = normalizedTarget.toISOString().split('T')[0];
      let bestMatch = weatherData.list[0];

      for (const item of weatherData.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        
        if (itemDateString === targetDateString) {
          bestMatch = item;
          break;
        }
      }

      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max || bestMatch.main.temp + 5),
        lowTemp: Math.round(bestMatch.main.temp_min || bestMatch.main.temp - 5),
        description: bestMatch.weather[0]?.description || 'Clear',
        icon: bestMatch.weather[0]?.icon || '01d',
        humidity: bestMatch.main.humidity || 50,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: cityName,
        forecast: [],
        forecastDate: targetDate,
        isActualForecast: true,
        source: 'live_forecast'
      };

      console.log('✅ LIVE WEATHER: SUCCESS - Live data created', {
        cityName,
        temperature: liveWeather.temperature,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ LIVE WEATHER: Failed', error);
      return null;
    }
  };

  // Fallback weather data
  const createFallbackWeather = (cityName: string, targetDate: Date): ForecastWeatherData => {
    const month = targetDate.getMonth();
    let baseTemp = 70;
    
    // Seasonal adjustment
    if (month >= 11 || month <= 2) baseTemp = 45; // Winter
    else if (month >= 3 && month <= 5) baseTemp = 65; // Spring
    else if (month >= 6 && month <= 8) baseTemp = 85; // Summer
    else baseTemp = 70; // Fall

    return {
      temperature: baseTemp,
      highTemp: baseTemp + 8,
      lowTemp: baseTemp - 8,
      description: 'Partly cloudy',
      icon: '02d',
      humidity: 50,
      windSpeed: 8,
      precipitationChance: 20,
      cityName: cityName,
      forecast: [],
      forecastDate: targetDate,
      isActualForecast: false,
      source: 'historical_fallback'
    };
  };

  // Load weather data
  React.useEffect(() => {
    if (!segmentDate) return;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      
      console.log('🔄 LOADING: Weather for', segment.endCity);

      // ALWAYS try live weather first if API key is available
      const hasApiKey = WeatherApiKeyManager.hasApiKey();
      console.log('🔑 LOADING: Has API key:', hasApiKey);

      if (hasApiKey) {
        try {
          console.log('🚀 LOADING: Attempting LIVE weather fetch');
          const liveWeather = await fetchLiveWeather(segment.endCity, segmentDate);
          
          if (liveWeather) {
            console.log('🎉 LOADING: LIVE weather successful!');
            setWeather(liveWeather);
            setLoading(false);
            return;
          } else {
            console.log('⚠️ LOADING: Live weather failed, using fallback');
          }
        } catch (error) {
          console.error('❌ LOADING: Live weather error:', error);
        }
      }
      
      // Fallback
      console.log('📊 LOADING: Using fallback weather');
      const fallbackWeather = createFallbackWeather(segment.endCity, segmentDate);
      setWeather(fallbackWeather);
      setLoading(false);
    };

    loadWeather();
  }, [segment.endCity, segmentDate]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsStoring(true);
    setError(null);
    
    try {
      WeatherApiKeyManager.setApiKey(apiKey.trim());
      setApiKey('');
      
      // Force reload
      setWeather(null);
      
    } catch (error) {
      setError('Invalid API key. Please check and try again.');
    } finally {
      setIsStoring(false);
    }
  };

  // Show API key input if no key available (except in shared views)
  if (!WeatherApiKeyManager.hasApiKey() && !isSharedView && !isPDFExport) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-700">
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">Weather forecast for {segment.endCity}</span>
        </div>
        <p className="text-xs text-blue-600">
          Add your OpenWeatherMap API key to see live weather forecasts
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-xs text-red-700">❌ {error}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-sm h-8"
            disabled={isStoring}
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
        
        <div className="flex items-center gap-1 text-blue-600">
          <ExternalLink className="w-3 h-3" />
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs hover:underline"
          >
            Get free API key from OpenWeatherMap
          </a>
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
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    return (
      <div className={`${isLive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{segment.endCity}</span>
            {isLive && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-bold">🟢 LIVE</span>}
            {!isLive && <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded">📊 Historical</span>}
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
        
        <div className="mt-2 text-xs text-blue-500">
          {isLive ? 
            '🟢 Live forecast from OpenWeatherMap' : 
            '🟡 Historical average - add API key for live forecasts'
          }
        </div>
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
