
import React from 'react';
import { Cloud } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface WeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
}

const WeatherForecastColumn: React.FC<WeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  const stableSegments = useStableSegments(segments);

  console.log('🌤️ WeatherForecastColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate?.toISOString()
  });

  if (!tripStartDate) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Weather Forecast
        </h3>
        <p className="text-gray-500 text-sm">
          Set a trip start date to see weather forecasts for your journey
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-route66-text-primary mb-4">
        Weather Forecast
      </h3>
      {stableSegments.map((segment, index) => {
        const segmentDate = addDays(tripStartDate, segment.day - 1);
        
        return (
          <ErrorBoundary key={`weather-segment-${segment.day}-${index}`} context={`WeatherForecastColumn-Segment-${index}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    Day {segment.day}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(segmentDate, 'EEE, MMM d')}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-route66-text-primary">
                  {segment.endCity}
                </h4>
              </div>
              
              <SegmentWeatherWidget
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={index}
                tripId={tripId}
                sectionKey="weather-column"
                forceExpanded={true}
              />
            </div>
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default WeatherForecastColumn;
