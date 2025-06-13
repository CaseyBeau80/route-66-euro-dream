
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripItineraryTabs from './TripItineraryTabs';
import TripItineraryContent from './TripItineraryContent';
import TripSegmentLoader from './TripSegmentLoader';

interface TripItineraryProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
}

const TripItinerary: React.FC<TripItineraryProps> = React.memo(({ tripPlan, tripStartDate }) => {
  const [activeTab, setActiveTab] = React.useState('itinerary');
  const [isRendering, setIsRendering] = React.useState(false);

  // Validate tripStartDate once and memoize it
  const validatedTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    if (!(tripStartDate instanceof Date)) return undefined;
    if (isNaN(tripStartDate.getTime())) return undefined;
    return tripStartDate;
  }, [tripStartDate]);

  const handleTabChange = (value: string) => {
    console.log('🔄 TripItinerary: Tab change to', value);
    setIsRendering(true);
    setActiveTab(value);
    
    // Reset rendering flag after a delay
    setTimeout(() => setIsRendering(false), 1000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TripItineraryTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <TripSegmentLoader segments={tripPlan.segments || []} initialLimit={1}>
          {(limitedSegments, hasMoreSegments, loadMoreSegments) => (
            <TripItineraryContent
              activeTab={activeTab}
              isRendering={isRendering}
              limitedSegments={limitedSegments}
              validatedTripStartDate={validatedTripStartDate}
              hasMoreSegments={hasMoreSegments}
              loadMoreSegments={loadMoreSegments}
              tripPlan={tripPlan}
              handleTabChange={handleTabChange}
            />
          )}
        </TripSegmentLoader>
      </Tabs>
    </div>
  );
});

TripItinerary.displayName = 'TripItinerary';

export default TripItinerary;
