
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import TabbedItineraryView from './TabbedItineraryView';
import ErrorBoundary from './ErrorBoundary';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  onGenerateMissingDays?: (missingDays: number[]) => void;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ 
  tripPlan, 
  tripStartDate,
  onGenerateMissingDays 
}) => {
  // Debug: Log the raw trip plan data
  console.log('📋 TripItinerary - RAW TRIP PLAN:', {
    totalDays: tripPlan.totalDays,
    segmentsCount: tripPlan.segments?.length || 0,
    dailySegmentsCount: tripPlan.dailySegments?.length || 0,
    hasSegments: !!(tripPlan.segments),
    hasDailySegments: !!(tripPlan.dailySegments),
    segments: tripPlan.segments?.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })) || [],
    dailySegments: tripPlan.dailySegments?.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })) || []
  });
  
  // Use stable segments to prevent cascading re-renders
  const rawSegments = tripPlan.segments || tripPlan.dailySegments || [];
  console.log('📋 TripItinerary - SELECTED RAW SEGMENTS:', {
    selectedSegments: rawSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })),
    count: rawSegments.length
  });
  
  const stableSegments = useStableSegments(rawSegments);
  
  // Extract start and end cities from trip plan
  const startCity = tripPlan.startCity;
  const endCity = tripPlan.endCity;
  
  console.log('📋 TripItinerary render with tabbed interface:', {
    segmentsCount: stableSegments.length,
    tripStartDate: tripStartDate?.toISOString(),
    totalDays: tripPlan.totalDays,
    finalSegments: stableSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })),
    startCity,
    endCity
  });

  return (
    <ErrorBoundary context="TripItinerary">
      <div className="space-y-6">
        <TabbedItineraryView
          segments={stableSegments}
          tripStartDate={tripStartDate}
          tripId={tripPlan.title || 'trip'}
          totalDays={tripPlan.totalDays}
          onGenerateMissingDays={onGenerateMissingDays}
          startCity={startCity}
          endCity={endCity}
        />
      </div>
    </ErrorBoundary>
  );
};

export default TripItinerary;
