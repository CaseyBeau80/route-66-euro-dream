
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
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-route66-text-primary mb-4">
        Daily Route & Stops
      </h3>
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
  );
};

export default RouteAndStopsColumn;
