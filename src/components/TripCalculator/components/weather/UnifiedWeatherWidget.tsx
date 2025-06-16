
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useEdgeFunctionWeather } from './hooks/useEdgeFunctionWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { WeatherUtilityService } from './services/WeatherUtilityService';

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
  console.log('🔥 UNIFIED WIDGET: Component rendering for', segment.endCity, {
    day: segment.day,
    tripStartDate: tripStartDate?.toISOString(),
    componentName: 'UnifiedWeatherWidget'
  });

  // Calculate segment date
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

    // Fallback for shared/PDF views
    if (isSharedView || isPDFExport) {
      const today = new Date();
      return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }, [tripStartDate, segment.day, isSharedView, isPDFExport]);

  // Use Edge Function weather hook
  const { weather, loading, error, refetch } = useEdgeFunctionWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  console.log('🔥 UNIFIED WIDGET: Weather data received for', segment.endCity, {
    day: segment.day,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    weatherDetails: weather ? {
      temperature: weather.temperature,
      source: weather.source,
      isActualForecast: weather.isActualForecast
    } : null,
    componentName: 'UnifiedWeatherWidget'
  });

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
    console.log('🔥 UNIFIED WIDGET: Rendering SimpleWeatherDisplay for', segment.endCity, {
      day: segment.day,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      componentPath: 'UnifiedWeatherWidget -> SimpleWeatherDisplay'
    });

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

  // Error or no weather state
  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
      <div className="text-amber-600 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-amber-700 font-medium">Weather forecast temporarily unavailable</p>
      {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
      <button
        onClick={refetch}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default UnifiedWeatherWidget;
