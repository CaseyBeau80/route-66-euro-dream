
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';

interface SegmentActionButtonsProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex: number;
  tripId?: string;
  sectionKey: string;
}

const SegmentActionButtons: React.FC<SegmentActionButtonsProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  sectionKey
}) => {
  const formatDistance = (distance: number) => {
    return distance >= 1 ? `${Math.round(distance)} mi` : `${Math.round(distance * 5280)} ft`;
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <div className="space-y-4">
      {/* Weather Widget - only show if tripStartDate is available */}
      {tripStartDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <SegmentWeatherWidget 
            segment={segment}
            tripStartDate={tripStartDate}
            cardIndex={cardIndex}
            tripId={tripId}
            sectionKey={sectionKey}
            forceExpanded={false}
            isCollapsible={true}
          />
        </div>
      )}

      {/* Route Information */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{segment.startCity} → {segment.endCity}</span>
        </div>
        <div className="text-gray-600">
          {formatDistance(segment.distance || segment.approximateMiles || 0)} • {formatTime(segment.driveTimeHours || 0)}
        </div>
      </div>

      {/* External Links */}
      {segment.endCity && (
        <div className="flex gap-2">
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(segment.endCity + ' Route 66')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Maps
          </a>
          <a
            href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(segment.endCity)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Reviews
          </a>
        </div>
      )}
    </div>
  );
};

export default SegmentActionButtons;
