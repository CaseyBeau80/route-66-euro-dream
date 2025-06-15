
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import { useRecommendedStops } from '../hooks/useRecommendedStops';
import SegmentNearbyAttractions from './SegmentNearbyAttractions';
import RecommendedStopsDisplay from './RecommendedStopsDisplay';
import DebugStopSelectionWrapper from './DebugStopSelectionWrapper';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardContentProps {
  segment: DailySegment;
  tripStartDate?: Date;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const DaySegmentCardContent: React.FC<DaySegmentCardContentProps> = ({
  segment,
  tripStartDate,
  driveTimeStyle,
  cardIndex = 0,
  tripId,
  sectionKey = 'itinerary'
}) => {
  // Get recommended stops for this segment
  const { recommendedStops, isLoading: isLoadingStops, hasStops } = useRecommendedStops(segment, 3);
  
  // CRITICAL: Use centralized service for consistent limiting
  const maxAttractions = AttractionLimitingService.getMaxAttractions();
  const context = `DaySegmentCardContent-Day${segment.day}-${sectionKey}`;
  
  console.log('🔍 DaySegmentCardContent using CENTRALIZED attraction limiting:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    maxAttractions,
    context,
    sectionKey,
    hasRecommendedStops: hasStops,
    recommendedStopsCount: recommendedStops.length
  });

  return (
    <div className="space-y-4">
      {/* Drive Time Message - Compact */}
      {segment.driveTimeCategory && segment.driveTimeHours > 6 && (
        <div className={`p-3 rounded-lg border text-sm ${driveTimeStyle.bg} ${driveTimeStyle.border}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-4 w-4 mt-0.5 ${driveTimeStyle.text}`} />
            <div>
              <div className={`font-medium text-sm ${driveTimeStyle.text}`}>
                {segment.driveTimeCategory.category.charAt(0).toUpperCase() + segment.driveTimeCategory.category.slice(1)} Drive Day
              </div>
              <div className={`text-xs mt-1 ${driveTimeStyle.text}`}>
                {segment.driveTimeCategory.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route & Stops Content */}
      <div className="space-y-4">
        {/* Recommended Stops Section - NEW */}
        {(hasStops || isLoadingStops) && (
          <ErrorBoundary context={`RecommendedStops-Day${segment.day}`}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
              {isLoadingStops ? (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Loading recommended stops...
                </div>
              ) : (
                <RecommendedStopsDisplay 
                  stops={recommendedStops}
                  maxDisplay={3}
                  showLocation={true}
                  compact={false}
                />
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* Nearby Attractions - CENTRALIZED ENFORCED LIMIT */}
        <ErrorBoundary context={`SegmentNearbyAttractions-Day${segment.day}`}>
          <SegmentNearbyAttractions 
            segment={segment} 
            maxAttractions={maxAttractions}
          />
        </ErrorBoundary>
      </div>

      {/* Debug Component - Production Safe */}
      <ErrorBoundary context={`DebugStopSelection-Day${segment.day}`} silent={true}>
        <DebugStopSelectionWrapper segment={segment} />
      </ErrorBoundary>
    </div>
  );
};

export default DaySegmentCardContent;
