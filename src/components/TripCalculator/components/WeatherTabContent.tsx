
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import DaySegmentCard from './DaySegmentCard';
import ErrorBoundary from './ErrorBoundary';

interface WeatherTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  isVisible: boolean;
}

const WeatherTabContent: React.FC<WeatherTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  isVisible
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-route66-text-secondary uppercase tracking-wider">
          Weather Forecast for Each Day
        </h4>
      </div>
      
      {segments.map((segment, index) => {
        console.log(`🌤️ Rendering weather segment ${index + 1}:`, { day: segment.day, endCity: segment.endCity });
        return (
          <ErrorBoundary key={`weather-segment-${segment.day}-${segment.endCity}-${index}`} context={`WeatherTab-Segment-${index}`}>
            <DaySegmentCard 
              segment={segment}
              tripStartDate={tripStartDate}
              cardIndex={index}
              tripId={tripId}
              sectionKey="weather-tab"
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default WeatherTabContent;
