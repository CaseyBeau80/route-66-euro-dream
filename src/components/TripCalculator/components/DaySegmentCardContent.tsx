
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentRecommendedStops from './SegmentRecommendedStops';
import SegmentRouteProgression from './SegmentRouteProgression';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import DebugStopSelectionWrapper from './DebugStopSelectionWrapper';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardContentProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex: number;
  tripId?: string;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardContent: React.FC<DaySegmentCardContentProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  driveTimeStyle
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

      {/* Integrated Layout: Route Info & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Route & Stops */}
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

        {/* Right Column - Weather */}
        {tripStartDate && (
          <div className="space-y-4">
            <ErrorBoundary context={`SegmentWeather-Day${segment.day}`}>
              <SegmentWeatherWidget 
                segment={segment}
                tripStartDate={tripStartDate}
                cardIndex={cardIndex}
                tripId={tripId}
                sectionKey={`weather-${segment.day}`}
                forceExpanded={false}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Debug Component - Production Safe */}
      <ErrorBoundary context={`DebugStopSelection-Day${segment.day}`} silent={true}>
        <DebugStopSelectionWrapper segment={segment} />
      </ErrorBoundary>
    </div>
  );
};

export default DaySegmentCardContent;
