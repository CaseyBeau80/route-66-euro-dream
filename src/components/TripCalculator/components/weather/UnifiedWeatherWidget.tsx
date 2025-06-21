
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { SecureWeatherService } from '@/services/SecureWeatherService';
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

  console.log('🌤️ UnifiedWeatherWidget render:', {
    city: segment.endCity,
    day: segment.day,
    tripStartDate: tripStartDate?.toISOString(),
    hasValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())
  });

  // Calculate segment date - FIXED: More robust date calculation
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate || !(tripStartDate instanceof Date) || isNaN(tripStartDate.getTime())) {
      console.log('❌ UnifiedWeatherWidget: Invalid or missing tripStartDate for', segment.endCity);
      return null;
    }

    // Simple and reliable date calculation
    const segmentDate = new Date(tripStartDate);
    segmentDate.setDate(segmentDate.getDate() + (segment.day - 1));
    segmentDate.setHours(12, 0, 0, 0); // Normalize to noon
    
    console.log('✅ UnifiedWeatherWidget: Calculated segment date for', segment.endCity, {
      tripStartDate: tripStartDate.toISOString(),
      segmentDay: segment.day,
      calculatedDate: segmentDate.toISOString(),
      calculatedLocal: segmentDate.toLocaleDateString()
    });
    
    return segmentDate;
  }, [tripStartDate, segment.day, segment.endCity]);

  // Fetch weather using secure service
  const fetchWeather = React.useCallback(async () => {
    if (!segmentDate) {
      console.log('❌ UnifiedWeatherWidget: No valid segment date for', segment.endCity);
      return;
    }

    console.log('🌤️ UnifiedWeatherWidget: Starting weather fetch for', segment.endCity);

    setLoading(true);
    setError(null);

    try {
      const weatherData = await SecureWeatherService.fetchWeatherForecast(
        segment.endCity,
        segmentDate
      );

      if (weatherData) {
        console.log('✅ UnifiedWeatherWidget: Weather fetch successful for', segment.endCity, {
          temperature: weatherData.temperature,
          source: weatherData.source,
          isActualForecast: weatherData.isActualForecast
        });
        setWeather(weatherData);
      } else {
        console.log('⚠️ UnifiedWeatherWidget: No weather data returned for', segment.endCity);
        setError('Weather data unavailable');
      }
    } catch (error) {
      console.error('❌ UnifiedWeatherWidget: Weather fetch failed for', segment.endCity, error);
      setError('Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, [segment.endCity, segmentDate]);

  // Fetch weather when segment date is available
  React.useEffect(() => {
    if (segmentDate) {
      fetchWeather();
    }
  }, [fetchWeather]);

  // Show message if no valid date
  if (!segmentDate) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-blue-400 text-2xl mb-2">📅</div>
        <p className="text-sm text-blue-700 font-medium mb-1">Date Required for Weather</p>
        <p className="text-xs text-blue-600">Trip start date needed to show weather forecast</p>
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
    const daysFromToday = segmentDate ? 
      Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 0;

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
                {segmentDate?.toLocaleDateString('en-US', { 
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

  return null;
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
