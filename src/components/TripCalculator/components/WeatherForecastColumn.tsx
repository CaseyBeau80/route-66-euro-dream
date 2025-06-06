
import React from 'react';
import { Cloud, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
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
  console.log('🌤️ WeatherForecastColumn render:', {
    segmentsCount: segments.length,
    hasStartDate: !!tripStartDate
  });

  return (
    <div className="space-y-4">
      {/* Weather Column Header */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-route66-text-primary">
            Weather Forecast
          </h3>
        </div>
        {tripStartDate && (
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Calendar className="h-4 w-4" />
            <span>Starting {format(tripStartDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
        )}
      </div>

      {/* Weather Cards for Each Day */}
      <div className="space-y-4">
        {segments.map((segment, index) => {
          const segmentDate = tripStartDate 
            ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000) 
            : null;

          return (
            <ErrorBoundary key={`weather-${segment.day}-${index}`} context={`WeatherForecast-Day${segment.day}`}>
              <div className="bg-white rounded-lg border border-blue-200 shadow-sm">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">Day {segment.day}</span>
                      <span className="text-blue-700">•</span>
                      <span className="text-blue-800 font-medium">{segment.endCity}</span>
                    </div>
                    {segmentDate && (
                      <span className="text-sm text-blue-600">
                        {format(segmentDate, 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Weather Widget */}
                <div className="p-4">
                  <SegmentWeatherWidget 
                    segment={segment}
                    tripStartDate={tripStartDate}
                    cardIndex={index}
                    tripId={tripId}
                    sectionKey={`weather-${segment.day}`}
                    forceExpanded={true}
                  />
                </div>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecastColumn;
