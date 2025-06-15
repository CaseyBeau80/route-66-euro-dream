
import React from 'react';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { formatTime } from '../utils/distanceCalculator';
import { AttractionLimitingService } from '../services/attractions/AttractionLimitingService';
import { useRecommendedStops } from '../hooks/useRecommendedStops';
import DaySegmentCardContent from './DaySegmentCardContent';
import ErrorBoundary from './ErrorBoundary';

interface DaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const DaySegmentCard: React.FC<DaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  tripId,
  sectionKey = 'itinerary'
}) => {
  console.log('🎯 [CONSISTENT] DaySegmentCard rendering with enhanced system:', {
    day: segment.day,
    route: `${segment.startCity} → ${segment.endCity}`,
    cardIndex,
    sectionKey
  });

  // Drive time styling
  const getDriveTimeStyle = (hours: number) => {
    if (hours <= 4) return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    };
    if (hours <= 6) return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200'
    };
    return {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    };
  };

  const driveTimeStyle = getDriveTimeStyle(segment.driveTimeHours || 0);

  return (
    <ErrorBoundary context={`DaySegmentCard-Day${segment.day}`}>
      <div className="bg-white rounded-lg border border-route66-border shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-route66-primary to-route66-secondary text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-route66 text-xl font-bold">Day {segment.day}</h3>
              <div className="flex items-center gap-2 text-route66-cream">
                <MapPin className="h-4 w-4" />
                <span className="font-travel">
                  {segment.startCity} → {segment.endCity}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-route66-cream">
                <Clock className="h-4 w-4" />
                <span className="font-travel">
                  {formatTime(segment.driveTimeHours || 0)}
                </span>
              </div>
              <div className="text-sm text-route66-cream">
                {Math.round(segment.distance || 0)} miles
              </div>
            </div>
          </div>
        </div>

        {/* Content - Using consistent enhanced system */}
        <div className="p-4">
          <DaySegmentCardContent
            segment={segment}
            tripStartDate={tripStartDate}
            driveTimeStyle={driveTimeStyle}
            cardIndex={cardIndex}
            tripId={tripId}
            sectionKey={sectionKey}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DaySegmentCard;
