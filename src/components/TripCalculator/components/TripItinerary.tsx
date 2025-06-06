
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import TabbedItineraryView from './TabbedItineraryView';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ tripPlan, tripStartDate }) => {
  // Use stable segments to prevent cascading re-renders
  const stableSegments = useStableSegments(tripPlan.segments || tripPlan.dailySegments || []);
  
  console.log('📋 TripItinerary render with tabbed interface:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate?.toISOString(),
    totalDays: tripPlan.totalDays
  });

  return (
    <ErrorBoundary context="TripItinerary">
      <div className="space-y-6">
        <TabbedItineraryView
          segments={stableSegments}
          tripStartDate={tripStartDate}
          tripId={tripPlan.title || 'trip'}
          totalDays={tripPlan.totalDays}
        />
      </div>
    </ErrorBoundary>
  );
};

export default TripItinerary;
