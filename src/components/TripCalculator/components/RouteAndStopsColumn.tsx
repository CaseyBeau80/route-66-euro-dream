
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface RouteAndStopsColumnProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
}

const RouteAndStopsColumn: React.FC<RouteAndStopsColumnProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  const stableSegments = useStableSegments(segments);

  console.log('🛣️ RouteAndStopsColumn render:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate?.toISOString()
  });

  return (
    <>
      {/* Subtle Column Label */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Route & Stops
        </h4>
      </div>
      
      {/* Day Cards */}
      <div className="space-y-4">
        {stableSegments.map((segment, index) => (
          <ErrorBoundary key={`route-segment-${segment.day}-${index}`} context={`RouteAndStopsColumn-Segment-${index}`}>
            <DaySegmentCard 
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={index}
              tripId={tripId}
              sectionKey="route-stops"
            />
          </ErrorBoundary>
        ))}
      </div>
    </>
  );
};

export default RouteAndStopsColumn;
