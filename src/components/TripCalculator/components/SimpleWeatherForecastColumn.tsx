
import React from 'react';
import { Cloud } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import SimpleWeatherWidget from './weather/SimpleWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface SimpleWeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
}

const SimpleWeatherForecastColumn: React.FC<SimpleWeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  const stableSegments = useStableSegments(segments);

  // Validate tripStartDate
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return null;
    
    if (tripStartDate instanceof Date) {
      return isNaN(tripStartDate.getTime()) ? null : tripStartDate;
    }
    
    if (typeof tripStartDate === 'string') {
      const parsed = new Date(tripStartDate);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    return null;
  }, [tripStartDate]);

  console.log('🌤️ SimpleWeatherForecastColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: validTripStartDate?.toISOString(),
    tripId
  });

  if (!validTripStartDate) {
    return (
      <>
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
            Weather Forecast
          </h4>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
          <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-gray-600 mb-2">
            Weather Forecast
          </h5>
          <p className="text-gray-500 text-sm">
            Set a trip start date to see weather forecasts for your journey
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
          Weather Forecast
        </h4>
      </div>
      
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          const segmentDate = new Date(validTripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
          
          return (
            <ErrorBoundary key={`weather-segment-${segment.day}-${index}`} context={`SimpleWeatherForecastColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Day {segment.day}
                      </span>
                      <span className="text-gray-300">•</span>
                      <h5 className="text-sm font-semibold text-gray-800">
                        {segment.endCity}
                      </h5>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(segmentDate, 'EEE, MMM d')}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <SimpleWeatherWidget
                    segment={segment}
                    tripStartDate={validTripStartDate}
                    isSharedView={false}
                    isPDFExport={false}
                  />
                </div>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    </>
  );
};

export default SimpleWeatherForecastColumn;
