
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
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
  console.log('🔥 DaySegmentCardContent render - NO STOPS SYSTEM:', {
    segmentDay: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    sectionKey,
    cardIndex
  });

  return (
    <div className="space-y-4">
      {/* Drive Time Warning */}
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

      {/* Simple Route Information */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600 text-center">
          Enjoy your drive from {segment.startCity} to {segment.endCity}! 
          <br />
          Stop along the way to explore local attractions and Route 66 landmarks.
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardContent;
