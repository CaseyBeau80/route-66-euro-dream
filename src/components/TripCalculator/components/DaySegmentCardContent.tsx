
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import SegmentNearbyAttractions from './SegmentNearbyAttractions';
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
  forceShowAttractions?: boolean;
}

const DaySegmentCardContent: React.FC<DaySegmentCardContentProps> = ({
  segment,
  tripStartDate,
  driveTimeStyle,
  cardIndex = 0,
  tripId,
  sectionKey = 'itinerary',
  forceShowAttractions = false
}) => {
  // CRITICAL: Use centralized service for consistent limiting
  const maxAttractions = AttractionLimitingService.getMaxAttractions();
  const context = `DaySegmentCardContent-Day${segment.day}-${sectionKey}`;
  
  console.log('🔍 DaySegmentCardContent - FIXED attractions display:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    maxAttractions,
    context,
    sectionKey,
    forceShowAttractions,
    availableAttractions: {
      attractionsCount: segment.attractions?.length || 0,
      recommendedStopsCount: segment.recommendedStops?.length || 0,
      stopsCount: segment.stops?.length || 0
    },
    fixApplied: 'FORCE_SHOW_ATTRACTIONS_WHEN_NEEDED'
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

      {/* Route & Stops Content - ALWAYS SHOW ATTRACTIONS */}
      <div className="space-y-4">
        {/* Nearby Attractions - CENTRALIZED ENFORCED LIMIT with force display */}
        <ErrorBoundary context={`SegmentNearbyAttractions-Day${segment.day}`}>
          <SegmentNearbyAttractions 
            segment={segment} 
            maxAttractions={maxAttractions}
            forceDisplay={forceShowAttractions}
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
