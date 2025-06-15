
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useEdgeFunctionWeather } from './weather/hooks/useEdgeFunctionWeather';
import SimpleWeatherDisplay from './weather/SimpleWeatherDisplay';
import { WeatherUtilityService } from './weather/services/WeatherUtilityService';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date | string;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
  forceExpanded?: boolean;
  isCollapsible?: boolean;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ 
  segment, 
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  // Convert string to Date if needed
  const normalizedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (tripStartDate instanceof Date) return tripStartDate;
    return new Date(tripStartDate);
  }, [tripStartDate]);

  // Calculate segment date using the working utility service
  const segmentDate = React.useMemo(() => {
    if (normalizedTripStartDate) {
      return WeatherUtilityService.getSegmentDate(normalizedTripStartDate, segment.day);
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
  }, [normalizedTripStartDate, segment.day, isSharedView, isPDFExport]);

  // Use the working weather hook
  const { weather, loading, error, refetch } = useEdgeFunctionWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  console.log('🔧 FIXED: SegmentWeatherWidget using working logic for', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasStartDate: !!normalizedTripStartDate,
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast
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

  // Fallback for shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
        <div className="text-blue-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-blue-700 font-medium">Weather forecast temporarily unavailable</p>
        <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
      </div>
    );
  }

  // Final fallback
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

export default SegmentWeatherWidget;
