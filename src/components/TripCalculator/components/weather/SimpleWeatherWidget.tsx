
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

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
  console.log('🎯 SHARED: SimpleWeatherWidget rendering', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // Calculate segment date with better URL parameter handling
  const segmentDate = React.useMemo(() => {
    // First priority: use passed tripStartDate
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      console.log('🔧 SHARED: Calculated date from tripStartDate:', {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString()
      });
      return calculatedDate;
    }

    // Second priority: for shared views, try to get date from URL params with multiple possible parameter names
    if (isSharedView) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start'];
        
        for (const paramName of possibleParams) {
          const tripStartParam = urlParams.get(paramName);
          if (tripStartParam) {
            console.log('🔧 SHARED: Found URL param:', paramName, '=', tripStartParam);
            
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              const calculatedDate = WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
              console.log('🔧 SHARED: Successfully calculated date from URL params:', {
                urlParam: tripStartParam,
                segmentDay: segment.day,
                calculatedDate: calculatedDate?.toISOString()
              });
              return calculatedDate;
            }
          }
        }
        
        console.log('🔧 SHARED: No valid trip start date found in URL params');
      } catch (error) {
        console.warn('⚠️ Failed to parse trip start date from URL:', error);
      }
    }

    // For shared views without a valid date, use today + segment day offset for demonstration
    if (isSharedView || isPDFExport) {
      const today = new Date();
      const estimatedDate = new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      console.log('🔧 SHARED: Using estimated date for shared view:', {
        segmentDay: segment.day,
        estimatedDate: estimatedDate.toISOString()
      });
      return estimatedDate;
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Use unified weather hook
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  // Check if we have API key for non-shared views
  const hasApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, []);

  console.log('🔧 SHARED: Weather state for', segment.endCity, {
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    temperature: weather?.temperature,
    loading,
    error,
    hasApiKey,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    isSharedView
  });

  // Show loading state
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

  // Show weather if we have it and a valid date
  if (weather && segmentDate) {
    console.log('✅ SHARED: Displaying weather for', segment.endCity, {
      temperature: weather.temperature,
      source: weather.source,
      isSharedView,
      hasValidDate: true
    });
    
    return (
      <div className="weather-widget">
        <SimpleWeatherDisplay
          weather={weather}
          segmentDate={segmentDate}
          cityName={segment.endCity}
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
        />
      </div>
    );
  }

  // For shared/PDF views without weather but WITH a date, show that we're trying
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    console.log('⚠️ SHARED: Have date but no weather for', segment.endCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
        <div className="text-blue-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-blue-700 font-medium">Weather forecast unavailable</p>
        <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
      </div>
    );
  }

  // For shared/PDF views without valid date
  if (isSharedView || isPDFExport) {
    console.log('⚠️ SHARED: No valid date for weather in', segment.endCity);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Add trip start date for accurate forecast</p>
      </div>
    );
  }

  // Regular view without API key
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            console.log('🔑 API key set, refetching weather for', segment.endCity);
            refetch();
          }}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Error state with retry
  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <div className="text-amber-800 text-sm">
          Weather information temporarily unavailable
        </div>
        {error && (
          <div className="text-xs text-amber-600 mt-1">{error}</div>
        )}
      </div>

      {!isSharedView && !isPDFExport && (
        <div className="text-center">
          <button
            onClick={refetch}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherWidget;
