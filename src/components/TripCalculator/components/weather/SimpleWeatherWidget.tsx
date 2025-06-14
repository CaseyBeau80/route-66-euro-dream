
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

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
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }
    return null;
  }, [tripStartDate, segment.day]);

  // Check API key
  const hasApiKey = React.useMemo(() => {
    const apiKey = WeatherApiKeyManager.getApiKey();
    const isValid = !!apiKey && apiKey !== 'your_api_key_here' && apiKey.length >= 20;
    console.log('🔑 API Key Check:', {
      hasKey: !!apiKey,
      isValid,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? apiKey.substring(0, 8) + '...' : 'none'
    });
    return isValid;
  }, []);

  // Fetch live weather
  const fetchLiveWeather = React.useCallback(async () => {
    if (!segmentDate || !hasApiKey) return;

    const apiKey = WeatherApiKeyManager.getApiKey();
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ Fetching live weather for:', segment.endCity);
      
      // Get coordinates
      const cleanCityName = segment.endCity.replace(/,\s*[A-Z]{2}$/, '').trim();
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanCityName)}&limit=1&appid=${apiKey}`;
      
      const geoResponse = await fetch(geocodingUrl);
      if (!geoResponse.ok) throw new Error('Geocoding failed');
      
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) throw new Error('City not found');

      const { lat, lon } = geoData[0];
      
      // Get weather forecast
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) throw new Error('Weather API failed');
      
      const weatherData = await weatherResponse.json();
      if (!weatherData.list || weatherData.list.length === 0) throw new Error('No weather data');

      // Find best match for target date
      const targetDateString = segmentDate.toISOString().split('T')[0];
      const bestMatch = weatherData.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === targetDateString;
      }) || weatherData.list[0];

      // Create live weather data
      const liveWeather: ForecastWeatherData = {
        temperature: Math.round(bestMatch.main.temp),
        highTemp: Math.round(bestMatch.main.temp_max),
        lowTemp: Math.round(bestMatch.main.temp_min),
        description: bestMatch.weather[0]?.description || 'Partly Cloudy',
        icon: bestMatch.weather[0]?.icon || '02d',
        humidity: bestMatch.main.humidity,
        windSpeed: Math.round(bestMatch.wind?.speed || 0),
        precipitationChance: Math.round((bestMatch.pop || 0) * 100),
        cityName: segment.endCity,
        forecast: [],
        forecastDate: segmentDate,
        isActualForecast: true,
        source: 'live_forecast' as const
      };

      console.log('✅ Live weather fetched:', {
        city: segment.endCity,
        temperature: liveWeather.temperature,
        description: liveWeather.description,
        source: liveWeather.source,
        isActualForecast: liveWeather.isActualForecast
      });

      setWeather(liveWeather);
    } catch (err) {
      console.error('❌ Live weather failed:', err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate, hasApiKey]);

  // Fetch weather on mount and when dependencies change
  React.useEffect(() => {
    if (hasApiKey && segmentDate) {
      fetchLiveWeather();
    }
  }, [fetchLiveWeather, hasApiKey, segmentDate]);

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

  // Show weather if available
  if (weather && segmentDate) {
    return (
      <SimpleWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Show API key input if needed
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            console.log('API key set, refetching weather for', segment.endCity);
            fetchLiveWeather();
          }}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!isSharedView && !isPDFExport && (
        <button
          onClick={fetchLiveWeather}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
