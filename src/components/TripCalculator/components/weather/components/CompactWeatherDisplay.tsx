
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from '../services/WeatherUtilityService';
import { useUnifiedWeather } from '../hooks/useUnifiedWeather';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import { format } from 'date-fns';

interface CompactWeatherDisplayProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const CompactWeatherDisplay: React.FC<CompactWeatherDisplayProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  const [forceKey, setForceKey] = React.useState(() => Date.now().toString());

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }

    if (isSharedView) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start', 'tripStartDate'];
        
        for (const paramName of possibleParams) {
          const tripStartParam = urlParams.get(paramName);
          if (tripStartParam) {
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              return WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse trip start date from URL:', error);
      }
    }

    if (isSharedView || isPDFExport) {
      const today = new Date();
      return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Check API key
  const hasApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, [forceKey, segment.endCity]);

  // Use unified weather hook
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  // CRITICAL FIX: Proper weather detection using EXACT same logic as LiveWeatherDetectionService
  const isLiveForecast = React.useMemo(() => {
    if (!weather) return false;
    
    console.log('🔥 COMPACT WEATHER: Weather detection for', segment.endCity, {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      bothConditions: weather.source === 'live_forecast' && weather.isActualForecast === true
    });
    
    // Both conditions must be true for live forecast
    const result = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🔥 COMPACT WEATHER: Final detection result for', segment.endCity, {
      isLiveForecast: result,
      expectedColor: result ? 'GREEN' : 'YELLOW'
    });
    
    return result;
  }, [weather, segment.endCity]);

  // CRITICAL FIX: Drive time calculation using actual segment data
  const displayDriveTime = React.useMemo(() => {
    console.log('🚗 COMPACT WEATHER: Drive time calculation for', segment.endCity, {
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance
    });
    
    // Priority 1: Use driveTimeHours if available
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('✅ COMPACT WEATHER: Using driveTimeHours:', { hours, minutes, total: segment.driveTimeHours, formatted });
      return formatted;
    }
    
    // Priority 2: Calculate from distance
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const driveTimeHours = segment.distance / 55;
      const hours = Math.floor(driveTimeHours);
      const minutes = Math.round((driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('⚠️ COMPACT WEATHER: Using distance calculation:', { distance: segment.distance, hours, minutes, formatted });
      return formatted;
    }
    
    console.log('❌ COMPACT WEATHER: Using fallback drive time');
    return '3h 30m';
  }, [segment.driveTimeHours, segment.distance, segment.endCity]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  console.log('🚀 COMPACT WEATHER: Final render state for', segment.endCity, {
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    isLiveForecast,
    displayDriveTime,
    expectedColor: isLiveForecast ? 'GREEN' : 'YELLOW'
  });

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600">Loading weather...</span>
          <span className="text-xs text-gray-500">{displayDriveTime}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available
  if (weather && segmentDate) {
    const weatherIcon = getWeatherIcon(weather.icon);
    const formattedDate = format(segmentDate, 'EEEE, MMM d');

    // CRITICAL FIX: Proper styling based on live forecast detection
    const containerClasses = isLiveForecast 
      ? "bg-green-100 border-green-200 rounded-lg p-4 border"
      : "bg-yellow-100 border-yellow-200 rounded-lg p-4 border";
    
    const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
    const badgeText = isLiveForecast ? '✨ Live weather forecast' : '📊 Historical weather patterns';
    const badgeClasses = isLiveForecast
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
    const sourceColor = isLiveForecast ? 'text-green-600' : 'text-yellow-600';

    console.log('🎨 COMPACT WEATHER: Styling applied for', segment.endCity, {
      isLiveForecast,
      containerClasses,
      sourceLabel,
      expectedBackground: isLiveForecast ? 'GREEN' : 'YELLOW'
    });

    return (
      <div className={containerClasses}>
        {/* Header with Drive Time */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${sourceColor}`}>
            {sourceLabel}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>⏱️ {displayDriveTime}</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{weatherIcon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {weather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {weather.highTemp && weather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Weather Status Badge */}
        <div className="mt-2 text-center">
          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${badgeClasses}`}>
            {badgeText}
          </span>
        </div>
      </div>
    );
  }

  // For shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-blue-600">⏱️ {displayDriveTime}</span>
        </div>
        <div className="text-blue-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-blue-700 font-medium">Weather forecast temporarily unavailable</p>
        <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
      </div>
    );
  }

  // For shared/PDF views without valid date
  if (isSharedView || isPDFExport) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Add trip start date for accurate forecast</p>
      </div>
    );
  }

  // Regular view without API key
  if (!hasApiKey) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            setForceKey(Date.now().toString());
            refetch();
          }}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Final fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={() => {
          setForceKey(Date.now().toString());
          refetch();
        }}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default CompactWeatherDisplay;
