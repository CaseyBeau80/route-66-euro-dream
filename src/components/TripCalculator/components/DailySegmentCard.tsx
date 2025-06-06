
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DailySegmentCardProps {
  segment: DailySegment;
  formatTime: (hours: number) => string;
}

const DailySegmentCard: React.FC<DailySegmentCardProps> = ({
  segment,
  formatTime
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-bold">
            Day {segment.day}
          </Badge>
          <div>
            <div className="font-semibold">{segment.startCity} → {segment.endCity}</div>
            <div className="text-sm text-gray-600">
              {Math.round(segment.distance)} miles • {formatTime(segment.drivingTime)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Show recommended stops - check both recommendedStops and attractions */}
      {((segment.recommendedStops && segment.recommendedStops.length > 0) || (segment.attractions && segment.attractions.length > 0)) && (
        <div className="mt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Recommended Stops:
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* First try recommendedStops, then fall back to attractions */}
            {(segment.recommendedStops && segment.recommendedStops.length > 0 
              ? segment.recommendedStops.map(stop => stop.name)
              : segment.attractions || []
            ).map((stopName, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {stopName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySegmentCard;
