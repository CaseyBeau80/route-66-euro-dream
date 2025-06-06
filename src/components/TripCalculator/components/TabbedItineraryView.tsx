
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useStableSegments } from '../hooks/useStableSegments';
import ItineraryHeader from './ItineraryHeader';
import TabNavigation, { TabType } from './TabNavigation';
import RouteTabContent from './RouteTabContent';
import WeatherTabContent from './WeatherTabContent';
import ErrorBoundary from './ErrorBoundary';

interface TabbedItineraryViewProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  totalDays: number;
}

const TabbedItineraryView: React.FC<TabbedItineraryViewProps> = ({
  segments,
  tripStartDate,
  tripId,
  totalDays
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('route');
  
  // Debug: Log incoming segments before stabilization
  console.log('🔍 TabbedItineraryView - RAW INCOMING SEGMENTS:', {
    segmentsCount: segments?.length || 0,
    totalDays,
    rawSegments: segments?.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity })) || []
  });
  
  const stableSegments = useStableSegments(segments);
  
  // Debug: Log segments after stabilization
  console.log('🔍 TabbedItineraryView - AFTER STABILIZATION:', {
    originalCount: segments?.length || 0,
    stableCount: stableSegments.length,
    stableSegments: stableSegments.map(s => ({ day: s.day, endCity: s.endCity, startCity: s.startCity }))
  });
  
  // Debug: Check for missing days
  const expectedDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const actualDays = stableSegments.map(s => s.day).sort((a, b) => a - b);
  const missingDays = expectedDays.filter(day => !actualDays.includes(day));
  
  if (missingDays.length > 0) {
    console.error('❌ MISSING DAYS DETECTED:', {
      expectedDays,
      actualDays,
      missingDays,
      totalDays,
      segmentsCount: stableSegments.length
    });
  }
  
  console.log('📱 TabbedItineraryView render:', {
    segmentsCount: stableSegments.length,
    activeTab,
    tripStartDate: tripStartDate ? tripStartDate.toISOString() : 'Not set',
    totalDays,
    segmentDetails: stableSegments.map(s => ({ day: s.day, endCity: s.endCity })),
    expectedDays,
    actualDays,
    missingDays
  });

  if (!stableSegments || stableSegments.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <div className="text-center p-8 bg-route66-background-alt rounded-lg border border-route66-border">
          <MapPin className="h-12 w-12 text-route66-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-route66-text-primary mb-2">
            No Itinerary Available
          </h3>
          <p className="text-route66-text-secondary">
            There was an issue generating your trip itinerary. Please try recalculating your trip.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary context="TabbedItineraryView">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <ItineraryHeader 
          totalDays={totalDays}
          segmentsCount={stableSegments.length}
          missingDays={missingDays}
        />

        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-4">
          <RouteTabContent
            segments={stableSegments}
            tripStartDate={tripStartDate}
            tripId={tripId}
            isVisible={activeTab === 'route'}
          />

          <WeatherTabContent
            segments={stableSegments}
            tripStartDate={tripStartDate}
            tripId={tripId}
            isVisible={activeTab === 'weather'}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TabbedItineraryView;
