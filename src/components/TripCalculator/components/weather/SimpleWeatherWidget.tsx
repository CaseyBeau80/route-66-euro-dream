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

  // FIXED: Always call useMemo hooks in the same order
  // Calculate segment date - always called
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }

    // For shared views, try URL parameters
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

  // FIXED: Always check API key - always called
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log('🔧 FIXED: API key check:', {
      keyExists,
      cityName: segment.endCity,
      shouldShowLiveWeather: keyExists
    });
    return keyExists;
  }, [forceKey, segment.endCity]);

  // Use unified weather - always called with enhanced validation
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  // FIXED: Always validate weather data - always called
  const weatherValidation = React.useMemo(() => {
    if (!weather || !segmentDate) return null;
    return WeatherDataValidator.validateWeatherData(weather, segment.endCity, segmentDate);
  }, [weather, segmentDate, segment.endCity]);

  // FIXED: Always calculate if it's live forecast - always called
  const isLiveForecast = React.useMemo(() => {
    const isLive = weatherValidation?.isLiveForecast || false;
    console.log('🔧 FIXED: Live forecast check:', {
      cityName: segment.endCity,
      isLive,
      hasValidation: !!weatherValidation,
      weatherSource: weather?.source,
      hasApiKey
    });
    return isLive;
  }, [weatherValidation, segment.endCity, weather?.source, hasApiKey]);

  // FIXED: Always calculate styles - always called with corrected logic
  const styles = React.useMemo(() => {
    if (isLiveForecast) {
      console.log('🟢 FIXED: Using GREEN styling for live weather:', segment.endCity);
      return {
        sourceLabel: '🟢 Live Weather Forecast',
        sourceColor: '#059669', // Green-600
        badgeText: '✨ Current live forecast',
        badgeClasses: 'bg-green-100 text-green-700 border-green-200',
        containerClasses: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        backgroundColor: '#dcfce7', // Green-100
        borderColor: '#bbf7d0', // Green-200
        textColor: '#166534', // Green-800
      };
    } else {
      console.log('🟡 FIXED: Using YELLOW styling for historical weather:', segment.endCity);
      return {
        sourceLabel: '🟡 Historical Weather Data',
        sourceColor: '#ca8a04', // Yellow-600
        badgeText: '📊 Based on historical patterns',
        badgeClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        containerClasses: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
        backgroundColor: '#fef3c7', // Yellow-100
        borderColor: '#fde047', // Yellow-200
        textColor: '#a16207', // Yellow-800
      };
    }
  }, [isLiveForecast, segment.endCity]);

  console.log('🚀 FIXED: SimpleWeatherWidget render:', {
    cityName: segment.endCity,
    day: segment.day,
    forceKey,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    validationIsLive: isLiveForecast,
    shouldShowGreen: isLiveForecast,
    hasApiKey
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

  // FIXED: All early returns now happen after all hooks have been called
  // Loading state
  if (loading) {
    return (
      <div key={`loading-${segment.endCity}-${forceKey}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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
        {/* Weather Source Indicator */}
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs font-medium"
            style={{ color: styles.sourceColor }}
          >
            {styles.sourceLabel}
          </span>
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
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
