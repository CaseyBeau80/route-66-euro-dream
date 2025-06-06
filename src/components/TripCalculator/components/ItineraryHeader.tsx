
import React from 'react';
import { Calendar } from 'lucide-react';

interface ItineraryHeaderProps {
  totalDays: number;
  segmentsCount: number;
  missingDays: number[];
}

const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  totalDays,
  segmentsCount,
  missingDays
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="h-6 w-6 text-route66-primary" />
        <h3 className="text-xl font-bold text-route66-text-primary">
          Daily Itinerary
        </h3>
      </div>
      <p className="text-sm text-route66-text-secondary ml-9">
        Complete overview of your {totalDays}-day Route 66 adventure ({segmentsCount} segments loaded)
        {missingDays.length > 0 && (
          <span className="text-red-600 font-medium"> - Missing days: {missingDays.join(', ')}</span>
        )}
      </p>
    </div>
  );
};

export default ItineraryHeader;
