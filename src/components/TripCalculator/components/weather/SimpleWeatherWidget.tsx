import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import { WeatherDataValidator } from './WeatherDataValidator';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import { format } from 'date-fns';

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
    const keyExists = WeatherApiKeyManager.hasApiKey();
    return keyExists;
  }, [forceKey, segment.endCity]);

  // Use unified weather
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  // FIXED: Use simple validation to determine display
  const weatherValidation = React.useMemo(() => {
    if (!weather || !segmentDate) return null;
    return WeatherDataValidator.validateWeatherData(weather, segment.endCity, segmentDate);
  }, [weather, segmentDate, segment.endCity]);

  // FIXED: Use validation result directly
  const isLiveForecast = weatherValidation?.isLiveForecast || false;

  // FIXED: Robust drive time calculation with proper fallbacks
  const displayDriveTime = React.useMemo(() => {
    console.log('🚗 FIXED: Drive time calculation for segment:', {
      day: segment.day,
      endCity: segment.endCity,
      driveTimeHours: segment.driveTimeHours,
      drivingTime: segment.drivingTime,
      distance: segment.distance
    });

    // Try driveTimeHours first (most reliable)
    if (segment.driveTimeHours && typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      console.log('✅ Using driveTimeHours:', `${hours}h ${minutes}m`);
      return `${hours}h ${minutes}m`;
    }
    
    // Try drivingTime if it's a number
    if (segment.drivingTime && typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
      const hours = Math.floor(segment.drivingTime);
      const minutes = Math.round((segment.drivingTime - hours) * 60);
      console.log('✅ Using drivingTime number:', `${hours}h ${minutes}m`);
      return `${hours}h ${minutes}m`;
    }
    
    // Try to parse drivingTime if it's a string like "5.5h" or "5h 30m"
    if (segment.drivingTime && typeof segment.drivingTime === 'string') {
      const timeStr = segment.drivingTime.toLowerCase();
      
      // Parse "5h 30m" format
      const hMinMatch = timeStr.match(/(\d+)h\s*(\d+)m/);
      if (hMinMatch) {
        const hours = parseInt(hMinMatch[1]);
        const minutes = parseInt(hMinMatch[2]);
        console.log('✅ Parsed drivingTime h-m format:', `${hours}h ${minutes}m`);
        return `${hours}h ${minutes}m`;
      }
      
      // Parse "5.5h" format
      const decimalMatch = timeStr.match(/(\d+\.?\d*)h/);
      if (decimalMatch) {
        const totalHours = parseFloat(decimalMatch[1]);
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        console.log('✅ Parsed drivingTime decimal format:', `${hours}h ${minutes}m`);
        return `${hours}h ${minutes}m`;
      }
    }
    
    // Calculate from distance (55 mph average)
    if (segment.distance && typeof segment.distance === 'number' && segment.distance > 0) {
      const driveTimeHours = segment.distance / 55;
      const hours = Math.floor(driveTimeHours);
      const minutes = Math.round((driveTimeHours - hours) * 60);
      console.log('⚠️ Calculated from distance:', `${hours}h ${minutes}m`);
      return `${hours}h ${minutes}m`;
    }
    
    console.log('❌ No valid data, using fallback');
    return '4h 0m';
  }, [segment.driveTimeHours, segment.drivingTime, segment.distance, segment.day, segment.endCity]);

  // FIXED: Simple styling based on validation result
  const styles = React.useMemo(() => {
    if (isLiveForecast) {
      console.log('🟢 USING GREEN styling for live forecast:', segment.endCity);
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: '#059669',
        badgeText: '✨ Live weather forecast',
        badgeClasses: 'bg-green-100 text-green-700 border-green-200',
        containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        backgroundColor: '#dcfce7',
        borderColor: '#bbf7d0',
        textColor: '#166534',
      };
    } else {
      console.log('🟡 USING YELLOW styling for historical data:', segment.endCity);
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: '#d97706',
        badgeText: '📊 Historical weather patterns',
        badgeClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        containerClasses: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
        backgroundColor: '#fef3c7',
        borderColor: '#fde68a',
        textColor: '#92400e',
      };
    }
  }, [isLiveForecast, segment.endCity]);

  console.log('🔧 FINAL SimpleWeatherWidget state:', {
    cityName: segment.endCity,
    day: segment.day,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    isLiveForecast,
    displayDriveTime,
    weatherSource: weather?.source,
    validationResult: weatherValidation?.isLiveForecast,
    expectedColor: isLiveForecast ? 'GREEN' : 'YELLOW'
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  // Loading state
  if (loading) {
    return (
      <div key={`loading-${segment.endCity}-${forceKey}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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
  if (weather && segmentDate && weatherValidation) {
    const validatedWeather = weatherValidation.normalizedWeather;
    const weatherIcon = getWeatherIcon(validatedWeather.icon);
    const formattedDate = format(segmentDate, 'EEEE, MMM d');

    return (
      <div 
        key={`weather-${segment.endCity}-${forceKey}`}
        className={`${styles.containerClasses} rounded-lg p-4 border`}
        style={{
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor
        }}
      >
        {/* Header with Drive Time */}
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs font-medium"
            style={{ color: styles.sourceColor }}
          >
            {styles.sourceLabel}
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
                {Math.round(validatedWeather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {validatedWeather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {validatedWeather.highTemp && validatedWeather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(validatedWeather.highTemp)}° L: {Math.round(validatedWeather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {validatedWeather.precipitationChance}% • 💨 {validatedWeather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Weather Status Badge */}
        <div className="mt-2 text-center">
          <span 
            className="inline-block text-xs px-2 py-1 rounded-full font-medium border"
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.textColor,
              borderColor: styles.borderColor
            }}
          >
            {styles.badgeText}
          </span>
        </div>
      </div>
    );
  }

  // For shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    return (
      <div key={`fallback-${segment.endCity}-${forceKey}`} className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
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
      <div key={`no-date-${segment.endCity}-${forceKey}`} className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Add trip start date for accurate forecast</p>
      </div>
    );
  }

  // Regular view without API key
  if (!hasApiKey) {
    return (
      <div key={`api-key-${segment.endCity}-${forceKey}`} className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            console.log('API key set, refetching weather for', segment.endCity);
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
    <div key={`error-${segment.endCity}-${forceKey}`} className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
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

export default SimpleWeatherWidget;
