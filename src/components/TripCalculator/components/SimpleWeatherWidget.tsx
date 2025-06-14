
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

  // FIXED: Enhanced live weather fetching with better debugging
  const fetchLiveWeather = async (cityName: string, targetDate: Date): Promise<ForecastWeatherData | null> => {
    console.log('🚀 FIXED SimpleWeatherWidget: Starting live weather fetch for', cityName, {
      targetDate: targetDate.toISOString(),
      segment: segment.day
    });

    // Get API key directly
    const apiKey = WeatherApiKeyManager.getApiKey();
    console.log('🔑 FIXED SimpleWeatherWidget: API key check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? apiKey.substring(0, 8) + '...' : 'none'
    });

    if (!apiKey || apiKey.length < 10) {
      console.log('❌ FIXED SimpleWeatherWidget: Invalid API key');
      return null;
    }

    // Check date range (0-5 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedTarget = new Date(targetDate);
    normalizedTarget.setHours(0, 0, 0, 0);
    
    const daysFromToday = Math.ceil((normalizedTarget.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('📅 FIXED SimpleWeatherWidget: Date analysis for', cityName, {
      today: today.toISOString(),
      target: normalizedTarget.toISOString(),
      daysFromToday,
      withinRange: daysFromToday >= 0 && daysFromToday <= 5
    });

    if (daysFromToday < 0 || daysFromToday > 5) {
      console.log('📅 FIXED SimpleWeatherWidget: Date outside forecast range for', cityName);
      return null;
    }

    try {
      // Step 1: Get coordinates
      console.log('🗺️ FIXED SimpleWeatherWidget: Getting coordinates for', cityName);
      const cleanCityName = cityName.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=3&appid=${apiKey}`;
      
      const geocodeResponse = await fetch(geocodeUrl);
      console.log('🗺️ FIXED SimpleWeatherWidget: Geocode response for', cityName, {
        status: geocodeResponse.status,
        ok: geocodeResponse.ok
      });

      if (!geocodeResponse.ok) {
        console.error('❌ FIXED SimpleWeatherWidget: Geocoding failed for', cityName);
        return null;
      }

      const geocodeData = await geocodeResponse.json();
      if (!geocodeData || geocodeData.length === 0) {
        console.log('❌ FIXED SimpleWeatherWidget: No geocoding results for', cityName);
        return null;
      }

      const coords = geocodeData.find((r: any) => r.country === 'US') || geocodeData[0];
      console.log('📍 FIXED SimpleWeatherWidget: Got coordinates for', cityName, {
        lat: coords.lat,
        lon: coords.lon,
        country: coords.country
      });

      // Step 2: Get weather forecast
      console.log('🌤️ FIXED SimpleWeatherWidget: Fetching weather forecast for', cityName);
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`;
      
      const weatherResponse = await fetch(weatherUrl);
      console.log('🌤️ FIXED SimpleWeatherWidget: Weather response for', cityName, {
        status: weatherResponse.status,
        ok: weatherResponse.ok
      });

      if (!weatherResponse.ok) {
        console.error('❌ FIXED SimpleWeatherWidget: Weather API failed for', cityName, {
          status: weatherResponse.status,
          statusText: weatherResponse.statusText
        });
        return null;
      }

      const weatherData = await weatherResponse.json();
      console.log('📊 FIXED SimpleWeatherWidget: Got weather data for', cityName, {
        hasData: !!weatherData,
        hasList: !!weatherData.list,
        listLength: weatherData.list?.length || 0
      });

      if (!weatherData.list || weatherData.list.length === 0) {
        console.log('❌ FIXED SimpleWeatherWidget: No forecast data for', cityName);
        return null;
      }

      // Step 3: Find best forecast match
      const targetDateString = normalizedTarget.toISOString().split('T')[0];
      let bestMatch = weatherData.list[0];
      let exactMatch = false;

      for (const item of weatherData.list) {
        const itemDate = new Date(item.dt * 1000);
        const itemDateString = itemDate.toISOString().split('T')[0];
        
        if (itemDateString === targetDateString) {
          bestMatch = item;
          exactMatch = true;
          console.log('🎯 FIXED SimpleWeatherWidget: Found EXACT date match for', cityName);
          break;
        }
      }

      if (!exactMatch) {
        console.log('🎯 FIXED SimpleWeatherWidget: Using closest forecast for', cityName);
      }

      // Step 4: Create live weather object with GUARANTEED live marking
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
        // CRITICAL: These values GUARANTEE live weather marking
        isActualForecast: true,
        source: 'live_forecast' as const,
        dateMatchInfo: {
          requestedDate: targetDateString,
          matchedDate: new Date(bestMatch.dt * 1000).toISOString().split('T')[0],
          matchType: exactMatch ? 'exact' : 'closest',
          daysOffset: daysFromToday,
          hoursOffset: 0,
          source: 'live_forecast' as const,
          confidence: exactMatch ? 'high' : 'medium'
        }
      };

      console.log('✅ FIXED SimpleWeatherWidget: LIVE WEATHER CREATED for', cityName, {
        temperature: liveWeather.temperature,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast,
        exactMatch,
        GUARANTEED_LIVE: liveWeather.source === 'live_forecast' && liveWeather.isActualForecast === true
      });

      return liveWeather;
    } catch (error) {
      console.error('❌ FIXED SimpleWeatherWidget: Live weather error for', cityName, error);
      return null;
    }
  };

  // Load weather data
  React.useEffect(() => {
    if (!segmentDate) return;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      
      console.log('🔄 FIXED SimpleWeatherWidget: Loading weather for', segment.endCity, {
        segmentDate: segmentDate.toISOString(),
        day: segment.day
      });

      // Check if we have an API key
      const hasApiKey = apiKeyManager.hasApiKey();
      console.log('🔑 FIXED SimpleWeatherWidget: API key available:', hasApiKey);

      if (hasApiKey) {
        console.log('🚀 FIXED SimpleWeatherWidget: Attempting LIVE weather for', segment.endCity);
        
        try {
          const liveWeather = await fetchLiveWeather(segment.endCity, segmentDate);
          
          if (liveWeather) {
            console.log('✅ FIXED SimpleWeatherWidget: LIVE weather SUCCESS for', segment.endCity, {
              temperature: liveWeather.temperature,
              source: liveWeather.source,
              isActualForecast: liveWeather.isActualForecast
            });
            setWeather(liveWeather);
            setLoading(false);
            return;
          } else {
            console.log('⚠️ FIXED SimpleWeatherWidget: Live weather failed, using fallback for', segment.endCity);
          }
        } catch (error) {
          console.error('❌ FIXED SimpleWeatherWidget: Live weather error for', segment.endCity, error);
          setError(`Live weather failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        console.log('ℹ️ FIXED SimpleWeatherWidget: No API key, using fallback for', segment.endCity);
      }
      
      // Fallback to historical weather
      console.log('📊 FIXED SimpleWeatherWidget: Creating fallback weather for', segment.endCity);
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      const fallbackWeather = WeatherFallbackService.createFallbackForecast(
        segment.endCity,
        segmentDate,
        targetDateString,
        daysFromToday
      );
      
      console.log('📊 FIXED SimpleWeatherWidget: Fallback weather created for', segment.endCity, {
        temperature: fallbackWeather.temperature,
        source: fallbackWeather.source,
        isActualForecast: fallbackWeather.isActualForecast
      });
      
      setWeather(fallbackWeather);
      setLoading(false);
    };

    loadWeather();
  }, [segment.endCity, segmentDate, apiKeyManager]);

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
  if (!apiKeyManager.hasApiKey() && !isSharedView && !isPDFExport) {
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
    // FIXED: Enhanced live weather detection
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🎨 FIXED SimpleWeatherWidget: Rendering weather for', segment.endCity, {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      isLive,
      temperature: weather.temperature
    });
    
    return (
      <div className={`${isLive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{segment.endCity}</span>
            {isLive && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold">✨ LIVE</span>}
            {!isLive && <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">📊 Historical</span>}
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
        
        <div className="mt-2 text-xs text-blue-500">
          {isLive ? 
            '🟢 Live forecast from OpenWeatherMap' : 
            '🟡 Historical average - add API key for live forecast'
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
