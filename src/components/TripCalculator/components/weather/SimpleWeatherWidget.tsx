import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

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
  // ENHANCED: Create a unique widget key for forced re-rendering
  const widgetKey = React.useMemo(() => {
    return `widget-${segment.endCity}-${segment.day}-${tripStartDate?.toISOString() || 'no-date'}-${Date.now()}`;
  }, [segment.endCity, segment.day, tripStartDate]);

  console.log('🔍 ENHANCED: SimpleWeatherWidget rendering with widgetKey:', widgetKey, {
    segment: {
      day: segment.day,
      endCity: segment.endCity
    },
    tripStartDate: tripStartDate?.toISOString(),
    isSharedView,
    isPDFExport
  });

  // Calculate segment date with enhanced debugging
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      console.log('🔍 ENHANCED: SimpleWeatherWidget segment date calculation:', {
        widgetKey,
        tripStartDate: tripStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString(),
        endCity: segment.endCity
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
              const calculatedDate = WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
              console.log('🔍 ENHANCED: SimpleWeatherWidget URL date extraction:', {
                widgetKey,
                param: paramName,
                value: tripStartParam,
                calculatedDate: calculatedDate?.toISOString(),
                endCity: segment.endCity
              });
              return calculatedDate;
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ ENHANCED: Failed to parse trip start date from URL:', error);
      }
    }

    // Fallback for shared/PDF views
    if (isSharedView || isPDFExport) {
      const today = new Date();
      const estimatedDate = new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
      console.log('🔍 ENHANCED: SimpleWeatherWidget fallback date:', {
        widgetKey,
        estimatedDate: estimatedDate.toISOString(),
        reason: 'fallback_for_shared_view',
        endCity: segment.endCity
      });
      return estimatedDate;
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport, widgetKey]);

  // Use the unified weather service with enhanced debugging
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

  console.log('🔍 ENHANCED: SimpleWeatherWidget state analysis:', {
    widgetKey,
    endCity: segment.endCity,
    hasWeather: !!weather,
    weatherDetails: weather ? {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      description: weather.description
    } : null,
    loading,
    error,
    hasSegmentDate: !!segmentDate,
    hasApiKey,
    isSharedView,
    stateTimestamp: new Date().toISOString()
  });

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" key={`loading-${widgetKey}`}>
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available
  if (weather && segmentDate) {
    console.log('✅ ENHANCED: SimpleWeatherWidget displaying weather for', segment.endCity, {
      widgetKey,
      temperature: weather.temperature,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      description: weather.description,
      displayTimestamp: new Date().toISOString()
    });
    
    return (
      <div key={widgetKey}>
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

  // For shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center" key={`no-weather-${widgetKey}`}>
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
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center" key={`no-date-${widgetKey}`}>
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Add trip start date for accurate forecast</p>
      </div>
    );
  }

  // Regular view without API key
  if (!hasApiKey) {
    return (
      <div className="space-y-2" key={`no-api-${widgetKey}`}>
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={() => {
            console.log('🔑 ENHANCED: API key set, refetching weather for', segment.endCity);
            refetch();
          }}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Final fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center" key={`fallback-${widgetKey}`}>
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={refetch}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default SimpleWeatherWidget;
