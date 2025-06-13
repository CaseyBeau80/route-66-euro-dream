
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';

interface WeatherCardHeaderProps {
  segment: DailySegment;
  segmentDate: Date;
}

const WeatherCardHeader: React.FC<WeatherCardHeaderProps> = ({
  segment,
  segmentDate
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown">
        Weather in {segment.endCity}
      </h4>
      <div className="text-xs text-route66-vintage-brown">
        Day {segment.day}
        <div className="text-xs text-gray-600">
          {format(segmentDate, 'MMM d')}
        </div>
      </div>
    </div>
  );
};

export default WeatherCardHeader;
