
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
  console.log('🗓️ CRITICAL FIX: PreviewDailyItinerary render:', {
    segmentsCount: segments.length,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateLocal: tripStartDate?.toLocaleDateString(),
    segments: segments.map(s => ({
      day: s.day,
      endCity: s.endCity,
      startCity: s.startCity
    }))
  });

  return (
    <div className="space-y-0">
      {segments.map((segment, index) => {
        console.log(`🗓️ CRITICAL FIX: Rendering PreviewDayCard for Day ${segment.day}:`, {
          segmentDay: segment.day,
          arrayIndex: index,
          endCity: segment.endCity,
          tripStartDate: tripStartDate?.toLocaleDateString(),
          note: 'Using segment.day for date calculation, not array index'
        });

        return (
          <PreviewDayCard
            key={`day-${segment.day}`}
            segment={segment}
            dayIndex={index}
            tripStartDate={tripStartDate}
            isLast={index === segments.length - 1}
          />
        );
      })}
    </div>
  );
};

export default PreviewDailyItinerary;
