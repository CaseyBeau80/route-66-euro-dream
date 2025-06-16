import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import EnhancedWeatherDisplay from './EnhancedWeatherDisplay';
import WeatherDebugInfo from './WeatherDebugInfo';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

interface UnifiedWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  forceRefresh?: boolean;
}

const UnifiedWeatherWidget: React.FC<UnifiedWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false,
  forceRefresh = false
}) => {
  const [forceKey, setForceKey] = React.useState(() => Date.now().toString());
  
  React.useEffect(() => {
    if (forceRefresh) {
      setForceKey(Date.now().toString());
    }
  }, [forceRefresh]);

  // Calculate segment date using fixed date normalization
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      
      console.log('📅 FIXED: UnifiedWeatherWidget segment date calculation:', {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString(),
        calculatedDateLocal: calculatedDate?.toLocaleDateString(),
        cityName: segment.endCity,
        usingFixedCalculation: true
      });
      
      return calculatedDate;
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

    // Fallback for shared/PDF views
    if (isSharedView || isPDFExport) {
      const today = new Date();
      const fallbackStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return WeatherUtilityService.getSegmentDate(fallbackStartDate, segment.day);
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Use unified weather with enhanced cache invalidation
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  // Check API key availability
  const hasApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, []);

  console.log('🌤️ FIXED: UnifiedWeatherWidget render with validation consistency:', {
    cityName: segment.endCity,
    day: segment.day,
    forceKey,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    segmentDateLocal: segmentDate?.toLocaleDateString(),
    weatherValidation: weather ? {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      daysFromToday: segmentDate ? WeatherUtilityService.getDaysFromToday(segmentDate) : 'no-date',
      isWithinRange: segmentDate ? WeatherUtilityService.isWithinLiveForecastRange(segmentDate) : false
    } : null,
    fixedVersion: 'VALIDATION_CONSISTENCY_APPLIED'
  });

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
  if (weather && segmentDate) {
    return (
      <div key={`weather-display-${segment.endCity}-${forceKey}`}>
        <EnhancedWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
          forceKey={forceKey}
          showDebug={true}
        />
        <WeatherDebugInfo 
          weather={weather}
          cityName={segment.endCity}
          segmentDate={segmentDate}
        />
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

export default UnifiedWeatherWidget;
