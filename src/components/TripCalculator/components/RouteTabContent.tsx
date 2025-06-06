
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface RouteTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  isVisible: boolean;
}

const RouteTabContent: React.FC<RouteTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  isVisible
}) => {
  return (
    <div className={`
      absolute inset-0 transition-all duration-500 ease-in-out
      ${isVisible 
        ? 'translate-x-0 opacity-100' 
        : '-translate-x-full opacity-0 pointer-events-none'
      }
    `}>
      <div className="space-y-4">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
            Route & Recommended Stops
          </h4>
        </div>
        
        {segments.map((segment, index) => {
          console.log(`🗺️ Rendering route segment ${index + 1}:`, { day: segment.day, endCity: segment.endCity });
          return (
            <ErrorBoundary key={`route-segment-${segment.day}-${segment.endCity}-${index}`} context={`RouteTab-Segment-${index}`}>
              <DaySegmentCard 
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={index}
                tripId={tripId}
                sectionKey="route-tab"
              />
            </ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
};

export default RouteTabContent;
