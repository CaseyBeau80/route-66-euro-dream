
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import WeatherCard from './weather/WeatherCard';

interface SimpleWeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date | string;
  tripId?: string;
}

const SimpleWeatherForecastColumn: React.FC<SimpleWeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  const stableSegments = useStableSegments(segments);

  // Validate and convert tripStartDate to Date object
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    
    try {
      if (tripStartDate instanceof Date) {
        return isNaN(tripStartDate.getTime()) ? null : tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        const parsed = new Date(tripStartDate);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [tripStartDate]);

  // 🎯 DEBUG: Log SimpleWeatherForecastColumn render
  console.log('🎯 [WEATHER DEBUG] SimpleWeatherForecastColumn rendered:', {
    component: 'SimpleWeatherForecastColumn',
    originalSegmentsCount: segments.length,
    stableSegmentsCount: stableSegments.length,
    hasValidStartDate: !!validTripStartDate,
    tripStartDate: validTripStartDate?.toISOString(),
    tripId,
    segments: stableSegments.map(s => ({
      day: s.day,
      endCity: s.endCity
    }))
  });

  return (
    <>
      {/* Column Header */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Weather Forecast
        </h4>
      </div>
      
      {/* Weather Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          // 🎯 DEBUG: Log before rendering each WeatherCard
          console.log(`🎯 [WEATHER DEBUG] About to render WeatherCard ${index + 1}:`, {
            component: 'SimpleWeatherForecastColumn -> WeatherCard',
            segmentDay: segment.day,
            segmentEndCity: segment.endCity,
            cardIndex: index,
            tripStartDate: validTripStartDate?.toISOString(),
            key: `weather-${segment.day}-${index}`
          });

          return (
            <WeatherCard
              key={`weather-${segment.day}-${index}`}
              segment={segment}
              tripStartDate={validTripStartDate}
              cardIndex={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default SimpleWeatherForecastColumn;
