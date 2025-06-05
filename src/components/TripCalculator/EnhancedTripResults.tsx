
import React from 'react';
import { TripPlan } from './services/Route66TripPlannerService';
import TripHeader from './components/TripHeader';
import DaySegmentCard from './components/DaySegmentCard';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({ tripPlan, shareUrl }) => {
  console.log('✨ Rendering EnhancedTripResults with tripPlan:', tripPlan);

  return (
    <div className="space-y-6">
      {/* Trip Header with Images */}
      <TripHeader tripPlan={tripPlan} shareUrl={shareUrl} />

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="font-travel font-bold text-route66-vintage-brown text-xl">
          Daily Itinerary
        </h3>
        <div className="grid gap-4">
          {tripPlan.dailySegments.length > 0 ? (
            tripPlan.dailySegments.map((segment) => (
              <DaySegmentCard key={segment.day} segment={segment} />
            ))
          ) : (
            <p className="text-center p-4 italic text-route66-vintage-brown">
              No daily segments available for this trip plan.
            </p>
          )}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg border-2 border-route66-vintage-brown">
        <p className="text-sm text-route66-navy font-travel text-center">
          💡 <strong>Smart Route Planning:</strong> This itinerary shows drive times between each stop. 
          Times are based on 55mph average speed and may vary based on traffic, road conditions, and how long 
          you spend at each location. Don't forget to check attraction hours and seasonal availability!
        </p>
      </div>
    </div>
  );
};

export default EnhancedTripResults;
