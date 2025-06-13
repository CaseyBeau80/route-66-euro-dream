
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../../../services/planning/TripPlanBuilder';

interface WeatherCardHeaderProps {
  segment: DailySegment;
  segmentDate: Date;
}

const WeatherCardHeader: React.FC<WeatherCardHeaderProps> = ({
  segment,
  segmentDate
}) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-route66-primary bg-route66-accent-light px-2 py-1 rounded">
            Day {segment.day}
          </span>
          <span className="text-gray-300">•</span>
          <h5 className="text-sm font-semibold text-route66-text-primary">
            {segment.endCity}
          </h5>
        </div>
        <span className="text-xs text-gray-500">
          {format(segmentDate, 'EEE, MMM d')}
        </span>
      </div>
    </div>
  );
};

export default WeatherCardHeader;
