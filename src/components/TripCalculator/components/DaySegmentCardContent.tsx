
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentRecommendedStops from './SegmentRecommendedStops';
import SegmentRouteProgression from './SegmentRouteProgression';
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
        {/* Recommended Stops */}
        <ErrorBoundary context={`SegmentRecommendedStops-Day${segment.day}`}>
          <SegmentRecommendedStops segment={segment} />
        </ErrorBoundary>

        {/* Route Progression */}
        <ErrorBoundary context={`SegmentRouteProgression-Day${segment.day}`}>
          <SegmentRouteProgression segment={segment} />
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
