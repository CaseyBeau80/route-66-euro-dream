
import React from 'react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import TripHeader from './components/TripHeader';
import DaySegmentCard from './components/DaySegmentCard';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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

      {/* Trip Adjustment Notice */}
      {tripPlan.wasAdjusted && tripPlan.originalDays && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Trip Duration Optimized</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                We've adjusted your trip from <strong>{tripPlan.originalDays} days</strong> to <strong>{tripPlan.totalDays} days</strong> 
                to ensure comfortable daily driving distances (under 400 miles per day). This provides a safer and more enjoyable 
                Route 66 experience with time to explore stops along the way.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Segments */}
      <div className="space-y-4">
        <h3 className="font-travel font-bold text-route66-vintage-brown text-xl">
          Daily Itinerary
        </h3>
        <div className="grid gap-4">
          {tripPlan.dailySegments.length > 0 ? (
            tripPlan.dailySegments.map((segment, index) => (
              <DaySegmentCard 
                key={segment.day} 
                segment={segment} 
                showAdjustmentWarning={tripPlan.wasAdjusted && index === 0}
              />
            ))
          ) : (
            <p className="text-center p-4 italic text-route66-vintage-brown">
              No daily segments available for this trip plan.
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Travel Tips */}
      <div className="mt-6 p-4 bg-route66-vintage-yellow rounded-lg border-2 border-route66-vintage-brown">
        <div className="space-y-3">
          <p className="text-sm text-route66-navy font-travel text-center">
            💡 <strong>Smart Route Planning:</strong> This itinerary shows drive times between each stop with geographic diversity. 
            Times are based on 55mph average speed and may vary based on traffic, road conditions, and how long 
            you spend at each location.
          </p>
          
          {tripPlan.totalMiles > 1000 && (
            <div className="flex items-start gap-2 p-2 bg-orange-100 rounded border border-orange-300">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-orange-800">
                <strong>Long Journey Tip:</strong> This is a significant road trip covering {tripPlan.totalMiles} miles. 
                Consider building in rest days and checking attraction hours and seasonal availability before your trip.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTripResults;
