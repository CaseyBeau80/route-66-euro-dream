
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { useSharedOnlyWeather } from './hooks/useSharedOnlyWeather';
import SharedOnlyWeatherDisplay from './SharedOnlyWeatherDisplay';

interface SharedOnlyWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const SharedOnlyWeatherWidget: React.FC<SharedOnlyWeatherWidgetProps> = ({
  segment,
  tripStartDate
}) => {
  // Calculate segment date - SIMPLE logic for shared view only
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
    }

    // Try URL parameters for shared view
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tripStartParam = urlParams.get('tripStart') || urlParams.get('startDate');
      if (tripStartParam) {
        const parsedDate = new Date(tripStartParam);
        if (!isNaN(parsedDate.getTime())) {
          return new Date(parsedDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
        }
      }
    } catch (error) {
      console.warn('Failed to parse trip start date from URL:', error);
    }

    // Fallback: use today
    const today = new Date();
    return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
  }, [tripStartDate, segment.day]);

  // Use completely separate hook for shared views
  const { weather, loading, error } = useSharedOnlyWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day
  });

  console.log('🔥 SHARED ONLY: SharedOnlyWeatherWidget render:', {
    cityName: segment.endCity,
    day: segment.day,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    sharedOnlyPath: true
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
      <SharedOnlyWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
      />
    );
  }

  // Fallback
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
      <div className="text-blue-600 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-blue-700 font-medium">Weather forecast temporarily unavailable</p>
      <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
      {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
    </div>
  );
};

export default SharedOnlyWeatherWidget;
