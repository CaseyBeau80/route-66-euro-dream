
import React from 'react';
import { Calendar } from 'lucide-react';
import MissingDaysDisplay from './MissingDaysDisplay';

interface ItineraryHeaderProps {
  totalDays: number;
  segmentsCount: number;
  missingDays: number[];
  onGenerateMissingDays?: (days: number[]) => void;
}

const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  totalDays,
  segmentsCount,
  missingDays,
  onGenerateMissingDays
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="h-6 w-6 text-route66-primary" />
        <h3 className="text-xl font-bold text-route66-text-primary">
          Daily Itinerary
        </h3>
      </div>
      
      <div className="ml-9 space-y-2">
        <p className="text-sm text-route66-text-secondary">
          Complete overview of your {totalDays}-day Route 66 adventure ({segmentsCount} segments loaded)
        </p>
        
        <MissingDaysDisplay 
          missingDays={missingDays}
          onGenerateMissingDays={onGenerateMissingDays}
        />
      </div>
    </div>
  );
};

export default ItineraryHeader;
