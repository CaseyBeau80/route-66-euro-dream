
import React from 'react';
import { MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import StopItem from './StopItem';
import StopsEmpty from './StopsEmpty';

interface EnhancedRecommendedStopsProps {
  segment: DailySegment;
  maxStops?: number;
}

const EnhancedRecommendedStops: React.FC<EnhancedRecommendedStopsProps> = ({ 
  segment, 
  maxStops = 5  // Increased from 3 to 5 to show more stops
}) => {
  const validStops = getValidatedStops(segment);
  
  // Filter out route66_waypoint categories for user display
  const userRelevantStops = validStops.filter(isUserRelevantStop);

  console.log('🎯 EnhancedRecommendedStops filtering:', {
    segmentDay: segment.day,
    totalValidatedStops: validStops.length,
    userRelevantStops: userRelevantStops.length,
    filteredOutStops: validStops.length - userRelevantStops.length,
    maxStopsLimit: maxStops,
    willShowCount: Math.min(userRelevantStops.length, maxStops),
    userStopNames: userRelevantStops.map(s => s.name),
    filteredCategories: validStops.filter(s => !isUserRelevantStop(s)).map(s => s.category)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Recommended Stops ({userRelevantStops.length})
      </h4>
      
      {userRelevantStops.length > 0 ? (
        <div className="space-y-3">
          {userRelevantStops.slice(0, maxStops).map((stop, index) => (
            <StopItem key={stop.id || `stop-${index}`} stop={stop} index={index} />
          ))}
          
          {userRelevantStops.length > maxStops && (
            <div className="text-xs text-route66-vintage-brown italic text-center p-3 bg-route66-background-alt rounded border border-route66-border">
              +{userRelevantStops.length - maxStops} more stops available
              <div className="text-xs text-route66-text-secondary mt-1">
                Expand card to see all recommended stops for this segment
              </div>
            </div>
          )}
        </div>
      ) : (
        <StopsEmpty />
      )}
    </div>
  );
};

export default EnhancedRecommendedStops;
