
import React from 'react';
import { Cloud } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import ErrorBoundary from './ErrorBoundary';

interface WeatherForecastColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date | string;
  tripId?: string;
}

const WeatherForecastColumn: React.FC<WeatherForecastColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  const stableSegments = useStableSegments(segments);

  // Validate and convert tripStartDate to Date object
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) {
      return null;
    }
    
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ WeatherForecastColumn: Invalid Date object provided', tripStartDate);
          return null;
        }
        return tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        const parsed = new Date(tripStartDate);
        if (isNaN(parsed.getTime())) {
          console.error('❌ WeatherForecastColumn: Invalid date string provided', tripStartDate);
          return null;
        }
        return parsed;
      } else {
        console.error('❌ WeatherForecastColumn: tripStartDate is not a Date or string', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
    } catch (error) {
      console.error('❌ WeatherForecastColumn: Error validating tripStartDate:', error, tripStartDate);
      return null;
    }
  }, [tripStartDate]);

  console.log('🌤️ WeatherForecastColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: validTripStartDate?.toISOString(),
    originalTripStartDate: tripStartDate
  });

  if (!validTripStartDate) {
    return (
      <>
        {/* Subtle Column Label */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
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
      {/* Subtle Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Weather Forecast
        </h4>
      </div>
      
      {/* Day Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          let segmentDate: Date | null = null;
          
          try {
            segmentDate = addDays(validTripStartDate, segment.day - 1);
            
            if (isNaN(segmentDate.getTime())) {
              console.error('❌ WeatherForecastColumn: Invalid calculated date for segment', { 
                segment: segment.day, 
                startDate: validTripStartDate.toISOString() 
              });
              segmentDate = null;
            }
          } catch (error) {
            console.error('❌ WeatherForecastColumn: Error calculating segment date:', error, { 
              segment: segment.day, 
              startDate: validTripStartDate 
            });
            segmentDate = null;
          }
          
          return (
            <ErrorBoundary key={`weather-segment-${segment.day}-${index}`} context={`WeatherForecastColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
                {/* Consistent Header Format: Day X • City Name */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
                        Day {segment.day}
                      </span>
                      <span className="text-gray-300">•</span>
                      <h5 className="text-sm font-semibold text-route66-text-primary">
                        {segment.endCity}
                      </h5>
                    </div>
                    {segmentDate && (
                      <span className="text-xs text-gray-500">
                        {format(segmentDate, 'EEE, MMM d')}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Weather Content */}
                <div className="p-4">
                  <SegmentWeatherWidget
                    segment={segment}
                    tripStartDate={validTripStartDate}
                    cardIndex={index}
                    tripId={tripId}
                    sectionKey="weather-column"
                    forceExpanded={true}
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

export default WeatherForecastColumn;
