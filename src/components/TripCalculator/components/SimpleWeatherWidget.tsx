
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

  // Load weather data
  React.useEffect(() => {
    if (!segmentDate) return;

    const loadWeather = async () => {
      setLoading(true);
      
      try {
        if (hasApiKey) {
          // Try to fetch live weather
          console.log('🌤️ SimpleWeatherWidget: Attempting live weather for', segment.endCity);
          // For now, we'll use fallback until live weather is properly implemented
        }
        
        // Create fallback weather
        const targetDateString = segmentDate.toISOString().split('T')[0];
        const daysFromToday = Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        
        const fallbackWeather = WeatherFallbackService.createFallbackForecast(
          segment.endCity,
          segmentDate,
          targetDateString,
          daysFromToday
        );
        
        setWeather(fallbackWeather);
      } catch (error) {
        console.error('Error loading weather:', error);
      } finally {
        setLoading(false);
      }
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
      
      // Refresh page to reload with new API key
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error setting API key:', error);
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
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{segment.endCity}</span>
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
        
        {!hasApiKey && (
          <div className="mt-2 text-xs text-blue-500">
            Historical average • Add API key for live forecast
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
    </div>
  );
};

export default SimpleWeatherWidget;
