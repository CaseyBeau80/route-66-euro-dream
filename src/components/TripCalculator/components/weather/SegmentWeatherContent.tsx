
import React from 'react';
import { Cloud, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherService } from '@/components/Route66Map/services/WeatherService';

interface SegmentWeatherContentProps {
  hasApiKey: boolean;
  loading: boolean;
  weather: ForecastWeatherData | null;
  error: string | null;
  retryCount: number;
  segmentEndCity: string;
  segmentDate: Date | null;
  onApiKeySet: () => void;
  onTimeout: () => void;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SegmentWeatherContent: React.FC<SegmentWeatherContentProps> = ({
  hasApiKey,
  loading,
  weather,
  error,
  retryCount,
  segmentEndCity,
  segmentDate,
  onApiKeySet,
  onTimeout,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [apiKey, setApiKey] = React.useState('');
  const [isSettingKey, setIsSettingKey] = React.useState(false);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) return;
    
    setIsSettingKey(true);
    try {
      const weatherService = WeatherService.getInstance();
      await weatherService.setApiKey(apiKey.trim());
      console.log('🔑 API key set successfully for weather service');
      onApiKeySet();
      setApiKey(''); // Clear the input
    } catch (error) {
      console.error('❌ Failed to set API key:', error);
    } finally {
      setIsSettingKey(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <Cloud className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Loading weather for {segmentEndCity}...</span>
        </div>
      </div>
    );
  }

  // API Key required - show input form
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-700">
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">Weather API Key Required</span>
        </div>
        <p className="text-xs text-amber-600">
          Get weather forecasts for {segmentEndCity} by adding your OpenWeatherMap API key
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter OpenWeatherMap API key (32 characters)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-xs"
            maxLength={32}
          />
          <Button 
            onClick={handleSetApiKey}
            size="sm"
            disabled={!apiKey.trim() || isSettingKey}
            className="text-xs"
          >
            {isSettingKey ? 'Setting...' : 'Set Key'}
          </Button>
        </div>
        <div className="text-xs text-amber-600">
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-amber-800"
          >
            Get Free API Key →
          </a>
        </div>
      </div>
    );
  }

  // Show weather data if available
  if (weather && segmentDate) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h5 className="text-sm font-semibold text-blue-900">
              {segmentEndCity} Weather
            </h5>
            <p className="text-xs text-blue-600">
              {segmentDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">
              {weather.temperature}°F
            </div>
            {weather.highTemp && weather.lowTemp && (
              <div className="text-xs text-blue-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {weather.icon && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.description}
              className="w-8 h-8"
            />
          )}
          <span className="text-sm text-blue-800 capitalize">
            {weather.description}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
          <div>Humidity: {weather.humidity}%</div>
          <div>Wind: {weather.windSpeed} mph</div>
          {weather.precipitationChance > 0 && (
            <div className="col-span-2">
              Rain: {weather.precipitationChance}%
            </div>
          )}
        </div>
        
        {weather.source && (
          <div className="mt-2 pt-2 border-t border-blue-200">
            <span className="text-xs text-blue-500">
              {weather.isActualForecast ? '🌤️ Live forecast' : '📊 Seasonal estimate'}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Weather Error</span>
        </div>
        <p className="text-xs text-red-700">{error}</p>
        <Button 
          onClick={onRetry} 
          size="sm" 
          variant="outline"
          className="text-xs h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry ({retryCount + 1})
        </Button>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
      <Cloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={onRetry}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Try again
      </button>
    </div>
  );
};

export default SegmentWeatherContent;
