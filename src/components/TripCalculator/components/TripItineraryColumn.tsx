
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useStableSegments } from '../hooks/useStableSegments';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const TripItineraryColumn: React.FC<TripItineraryColumnProps> = ({
  segments,
  tripStartDate
}) => {
  const stableSegments = useStableSegments(segments);

  console.log('📅 TripItineraryColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate?.toISOString()
  });

  if (!tripStartDate) {
    return (
      <>
        {/* Column Label */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
            Daily Itinerary
          </h4>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-gray-600 mb-2">
            Daily Itinerary
          </h5>
          <p className="text-gray-500 text-sm">
            Set a trip start date to see your daily itinerary
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Daily Itinerary
        </h4>
      </div>
      
      {/* Day Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => {
          let segmentDate: Date | null = null;
          
          try {
            segmentDate = addDays(tripStartDate, segment.day - 1);
            
            if (isNaN(segmentDate.getTime())) {
              console.error('❌ TripItineraryColumn: Invalid calculated date for segment', { 
                segment: segment.day, 
                startDate: tripStartDate.toISOString() 
              });
              segmentDate = null;
            }
          } catch (error) {
            console.error('❌ TripItineraryColumn: Error calculating segment date:', error, { 
              segment: segment.day, 
              startDate: tripStartDate 
            });
            segmentDate = null;
          }
          
          return (
            <ErrorBoundary key={`itinerary-segment-${segment.day}-${index}`} context={`TripItineraryColumn-Segment-${index}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow min-h-[200px]">
                {/* Header */}
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
                
                {/* Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{Math.round(segment.distance)} miles</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Drive Time:</span>
                      <span className="font-medium">{segment.driveTime} hours</span>
                    </div>
                    {segment.recommendedStops && segment.recommendedStops.length > 0 && (
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          Recommended Stops ({segment.recommendedStops.length})
                        </h6>
                        <div className="space-y-1">
                          {segment.recommendedStops.slice(0, 3).map((stop, stopIndex) => (
                            <div key={stopIndex} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {stop.name}
                            </div>
                          ))}
                          {segment.recommendedStops.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{segment.recommendedStops.length - 3} more stops
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    </>
  );
};

export default TripItineraryColumn;
