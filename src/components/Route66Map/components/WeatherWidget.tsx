
import React, { useEffect, useState } from 'react';
import { WeatherService } from '../services/WeatherService';
import { Cloud, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherWidgetProps, WeatherData } from './weather/WeatherTypes';
import WeatherDisplay from './weather/WeatherDisplay';
import CollapsibleWeatherDisplay from './weather/CollapsibleWeatherDisplay';
import SimpleWeatherApiKeyInput from './weather/SimpleWeatherApiKeyInput';

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  lat, 
  lng, 
  cityName, 
  compact = false,
  collapsible = false
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWeather = async () => {
    console.log(`🌤️ WeatherWidget: Starting weather fetch for ${cityName} (attempt ${retryCount + 1})`);
    const weatherService = WeatherService.getInstance();
    
    // Debug the API key status
    const debugInfo = weatherService.getDebugInfo();
    console.log('🔍 WeatherWidget: Debug info:', debugInfo);
    
    if (!weatherService.hasApiKey()) {
      console.warn('❌ WeatherWidget: No API key configured');
      setError('API key not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🌐 WeatherWidget: Requesting weather data for ${cityName}`);
      const weatherData = await weatherService.getWeatherWithForecast(lat, lng, cityName);
      
      if (weatherData) {
        console.log('✅ WeatherWidget: Weather data received successfully');
        setWeather(weatherData);
        setError(null);
      } else {
        console.warn('❌ WeatherWidget: No weather data returned from service');
        setError('Unable to fetch weather data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Weather service error';
      console.error('❌ WeatherWidget: Weather fetch error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lng, cityName, retryCount]);

  const handleRetry = () => {
    console.log('🔄 WeatherWidget: Retrying weather fetch');
    setRetryCount(prev => prev + 1);
  };

  const handleApiKeySet = () => {
    console.log('🔑 WeatherWidget: API key set, retrying fetch');
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
        <Cloud className="w-4 h-4 animate-pulse" />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error === 'API key not configured') {
    return (
      <SimpleWeatherApiKeyInput 
        onApiKeySet={handleApiKeySet}
        cityName={cityName}
      />
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Weather Error</span>
        </div>
        <p className="text-xs text-red-700">{error}</p>
        <Button 
          onClick={handleRetry} 
          size="sm" 
          variant="outline"
          className="text-xs h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
        <Cloud className="w-4 h-4" />
        <span>Weather unavailable</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm bg-blue-50 rounded-md px-2 py-1">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-6 h-6"
        />
        <span className="font-semibold text-blue-900">{weather.temperature}°F</span>
      </div>
    );
  }

  // Use collapsible display if requested, otherwise use the full display
  if (collapsible) {
    return <CollapsibleWeatherDisplay weather={weather} />;
  }

  return <WeatherDisplay weather={weather} />;
};

export default WeatherWidget;
