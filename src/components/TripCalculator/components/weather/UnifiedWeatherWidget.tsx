
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { SimpleWeatherFetcher } from './SimpleWeatherFetcher';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface UnifiedWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherWidget: React.FC<UnifiedWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [weather, setWeather] = React.useState<ForecastWeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  console.log('🌤️ UnifiedWeatherWidget render debug:', {
    city: segment.endCity,
    day: segment.day,
    tripStartDateProvided: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateValid: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())
  });

  // Calculate segment date with improved logic
  const segmentDate = React.useMemo(() => {
    // Use provided date or fall back to today
    const baseDate = tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()) 
      ? tripStartDate 
      : new Date();

    // Calculate the segment date: Day 1 = trip start date, Day 2 = trip start + 1 day, etc.
    const segmentDate = new Date(baseDate);
    segmentDate.setDate(segmentDate.getDate() + (segment.day - 1));
    segmentDate.setHours(12, 0, 0, 0); // Normalize to noon

    console.log('✅ UnifiedWeatherWidget: Calculated segment date:', {
      city: segment.endCity,
      segmentDay: segment.day,
      baseDate: baseDate.toISOString(),
      calculatedSegmentDate: segmentDate.toISOString(),
      localDate: segmentDate.toLocaleDateString()
    });

    return segmentDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Fetch weather using unified SimpleWeatherFetcher
  const fetchWeather = React.useCallback(async () => {
    console.log('🌤️ UNIFIED UnifiedWeatherWidget: Starting weather fetch for', segment.endCity, {
      segmentDate: segmentDate.toISOString(),
      unifiedFetcher: true
    });
    setLoading(true);
    setError(null);

    try {
      const weatherData = await SimpleWeatherFetcher.fetchWeatherForCity({
        cityName: segment.endCity,
        targetDate: segmentDate,
        hasApiKey: true, // Let SimpleWeatherFetcher determine this
        isSharedView: isSharedView,
        segmentDay: segment.day
      });

      if (weatherData) {
        console.log('✅ UNIFIED UnifiedWeatherWidget: Weather fetch successful:', {
          city: segment.endCity,
          temperature: weatherData.temperature,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast,
          unifiedFetcher: true
        });
        setWeather(weatherData);
      } else {
        console.log('⚠️ UNIFIED UnifiedWeatherWidget: No weather data returned');
        setError('Weather data unavailable');
      }
    } catch (error) {
      console.error('❌ UNIFIED UnifiedWeatherWidget: Weather fetch failed:', error);
      setError('Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate, isSharedView, segment.day]);

  // Fetch weather when component mounts or dependencies change
  React.useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

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

  // Error state
  if (error && !weather) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="text-center">
          <div className="text-amber-600 text-2xl mb-2">⚠️</div>
          <p className="text-xs text-amber-700 font-medium mb-2">{error}</p>
          <button
            onClick={fetchWeather}
            className="text-xs text-amber-700 hover:text-amber-900 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success state with weather data
  if (weather) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getWeatherIcon(weather.icon)}</span>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                Weather for {segment.endCity}
              </h4>
              <p className="text-xs text-gray-600">
                {segmentDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-700">
              {weather.temperature}°F
            </div>
            {weather.highTemp && weather.lowTemp && (
              <div className="text-xs text-gray-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
          <div className="text-center">
            <div className="font-medium">{weather.humidity}%</div>
            <div>Humidity</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{weather.windSpeed} mph</div>
            <div>Wind</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{weather.precipitationChance}%</div>
            <div>Rain</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-700 capitalize">{weather.description}</p>
          <div className="flex items-center gap-1">
            {weather.isActualForecast ? (
              <>
                <span className="text-green-600 text-xs">🟢</span>
                <span className="text-xs text-green-700 font-medium">Live Forecast</span>
              </>
            ) : (
              <>
                <span className="text-orange-500 text-xs">🟡</span>
                <span className="text-xs text-orange-700 font-medium">Seasonal Est.</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-gray-400 text-2xl mb-2">🌤️</div>
      <p className="text-sm text-gray-600">Weather loading...</p>
    </div>
  );
};

// Helper function to get weather icon
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌤️';
};

export default UnifiedWeatherWidget;
