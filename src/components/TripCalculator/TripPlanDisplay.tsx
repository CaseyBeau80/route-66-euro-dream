
import React from 'react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import DaySegmentCard from './components/DaySegmentCard';
import TripPlanHeader from './components/TripPlanHeader';
import TripSharingSection from './components/TripSharingSection';
import TripPlanStats from './components/TripPlanStats';

interface TripPlanDisplayProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  isCompact?: boolean;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ 
  tripPlan, 
  shareUrl,
  isCompact = false 
}) => {
  console.log('📊 TripPlanDisplay render:', {
    segmentsCount: tripPlan.segments?.length || 0,
    isCompact,
    shareUrl: !!shareUrl
  });

  if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No trip plan available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-${isCompact ? '4' : '6'}`}>
      {/* Trip Plan Header */}
      <TripPlanHeader 
        tripPlan={tripPlan} 
        isCompact={isCompact}
      />

      {/* Trip Statistics */}
      <TripPlanStats 
        tripPlan={tripPlan} 
        isCompact={isCompact}
      />

      {/* Daily Segments */}
      <div className={`space-y-${isCompact ? '3' : '4'}`}>
        <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-route66-primary`}>
          Daily Itinerary
        </h3>
        
        <div className={`space-y-${isCompact ? '3' : '4'}`}>
          {tripPlan.segments.map((segment, index) => (
            <DaySegmentCard
              key={`segment-${segment.day}-${index}`}
              segment={segment}
              tripStartDate={tripPlan.startDate}
              cardIndex={index}
              tripId={tripPlan.id}
              sectionKey={`trip-display-${isCompact ? 'compact' : 'full'}`}
              showWeather={!isCompact}
              forceShowAttractions={false}
            />
          ))}
        </div>
      </div>

      {/* Trip Sharing Section - Only show in full mode */}
      {!isCompact && shareUrl && (
        <TripSharingSection 
          shareUrl={shareUrl}
          tripPlan={tripPlan}
        />
      )}
    </div>
  );
};

export default TripPlanDisplay;
