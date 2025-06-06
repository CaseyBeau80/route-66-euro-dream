
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ItineraryCardActionsProps {
  onViewDetails?: () => void;
}

const ItineraryCardActions: React.FC<ItineraryCardActionsProps> = ({
  onViewDetails
}) => {
  if (!onViewDetails) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={onViewDetails}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="View detailed itinerary"
      >
        View Detailed Itinerary
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default ItineraryCardActions;
