
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import PreviewDayCard from './PreviewDayCard';

interface PreviewDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const PreviewDailyItinerary: React.FC<PreviewDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  return (
    <div className="space-y-0">
      {segments.map((segment, index) => (
        <PreviewDayCard
          key={`day-${segment.day}`}
          segment={segment}
          dayIndex={index}
          tripStartDate={tripStartDate}
          isLast={index === segments.length - 1}
        />
      ))}
    </div>
  );
};

export default PreviewDailyItinerary;
