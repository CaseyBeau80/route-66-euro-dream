
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { SecureWeatherService } from '@/services/SecureWeatherService';

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
  const [serviceAvailable, setServiceAvailable] = React.useState<boolean | null>(null);

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }
    return null;
  }, [tripStartDate, segment.day]);

  // Check if secure weather service is available
  React.useEffect(() => {
    const checkService = async () => {
      const available = await SecureWeatherService.isServiceAvailable();
      setServiceAvailable(available);
      console.log('🔒 Weather service availability:', available);
    };
    
    checkService();
  }, []);

  // Fetch weather data
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ Fetching secure weather for:', segment.endCity, segmentDate);
      
      const weatherData = await SecureWeatherService.fetchWeatherForecast(
        segment.endCity,
        segmentDate
      );

      if (weatherData) {
        setWeather(weatherData);
        console.log('✅ Weather data received:', {
          city: segment.endCity,
          temperature: weatherData.temperature,
          source: weatherData.source,
          isLive: weatherData.source === 'live_forecast' && weatherData.isActualForecast
        });
      } else {
        setError('Weather data unavailable');
      }
    } catch (err) {
      console.error('❌ Weather fetch failed:', err);
      setError(err instanceof Error ? err.message : 'Weather fetch failed');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

  // Fetch weather when component mounts or dependencies change
  React.useEffect(() => {
    if (segmentDate && serviceAvailable !== null) {
      fetchWeather();
    }
  }, [fetchWeather, segmentDate, serviceAvailable]);

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

  // Service not configured message
  if (serviceAvailable === false && !isSharedView && !isPDFExport) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="text-sm text-yellow-800 mb-2">
          🔒 <strong>Secure Weather Service</strong>
        </div>
        <p className="text-xs text-yellow-700 mb-2">
          Weather forecasts are handled securely via backend service. 
          To enable live weather, an administrator needs to configure the OpenWeatherMap API key in Supabase.
        </p>
        <p className="text-xs text-gray-600">
          Showing seasonal weather estimates for now.
        </p>
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
          onClick={fetchWeather}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
