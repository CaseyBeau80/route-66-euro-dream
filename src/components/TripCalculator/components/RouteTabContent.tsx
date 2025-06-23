
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface RouteTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  isVisible: boolean;
  showWeather?: boolean;
}

const RouteTabContent: React.FC<RouteTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  isVisible,
  showWeather = true
}) => {
  console.log('🛣️ RouteTabContent render - FIXED attractions display:', {
    isVisible,
    segmentsCount: segments.length,
    showWeather,
    segments: segments.map(s => ({
      day: s.day,
      endCity: s.endCity,
      attractionsCount: s.attractions?.length || 0,
      recommendedStopsCount: s.recommendedStops?.length || 0,
      stopsCount: s.stops?.length || 0
    })),
    fixApplied: 'ENSURE_ATTRACTIONS_DISPLAY'
  });

  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Daily Route & Attractions
        </h4>
      </div>
      
      {segments.map((segment, index) => (
        <ErrorBoundary key={`route-day-${segment.day}-${segment.endCity}`} context={`RouteTab-Day-${segment.day}`}>
          <DaySegmentCard
            segment={segment}
            tripStartDate={tripStartDate}
            cardIndex={index}
            tripId={tripId}
            sectionKey="route-tab"
            showWeather={showWeather}
            forceShowAttractions={true}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default RouteTabContent;
