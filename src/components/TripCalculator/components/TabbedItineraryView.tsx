
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
  onGenerateMissingDays?: (missingDays: number[]) => void;
  startCity?: string;
  endCity?: string;
}

const TabbedItineraryView: React.FC<TabbedItineraryViewProps> = ({
  segments,
  tripStartDate,
  tripId,
  totalDays,
  onGenerateMissingDays,
  startCity,
  endCity
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
  
  // Calculate missing days
  const expectedDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const actualDays = stableSegments.map(s => s.day).sort((a, b) => a - b);
  const missingDays = expectedDays.filter(day => !actualDays.includes(day));
  
  if (missingDays.length > 0) {
    console.warn('⚠️ MISSING DAYS DETECTED:', {
      expectedDays,
      actualDays,
      missingDays,
      totalDays,
      segmentsCount: stableSegments.length
    });
  }
  
  console.log('📱 TabbedItineraryView render - FIXED duplicate weather issue:', {
    segmentsCount: stableSegments.length,
    activeTab,
    tripStartDate: tripStartDate ? tripStartDate.toISOString() : 'Not set',
    totalDays,
    segmentDetails: stableSegments.map(s => ({ day: s.day, endCity: s.endCity })),
    expectedDays,
    actualDays,
    missingDays,
    fixApplied: 'PREVENT_DUPLICATE_WEATHER_DISPLAYS'
  });

  if (!stableSegments || stableSegments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Itinerary Available
          </h3>
          <p className="text-gray-500">
            There was an issue generating your trip itinerary. Please try recalculating your trip.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary context="TabbedItineraryView">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <ItineraryHeader 
          totalDays={totalDays}
          segmentsCount={stableSegments.length}
          missingDays={missingDays}
          onGenerateMissingDays={onGenerateMissingDays}
          startCity={startCity}
          endCity={endCity}
        />

        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content - FIXED: Prevent duplicate weather rendering */}
        <div className="mt-4">
          <RouteTabContent
            segments={stableSegments}
            tripStartDate={tripStartDate}
            tripId={tripId}
            isVisible={activeTab === 'route'}
            showWeather={false}
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
