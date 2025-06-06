
import React from 'react';
import { AlertTriangle, Plus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface MissingDaysDisplayProps {
  missingDays: number[];
  onGenerateMissingDays?: (days: number[]) => void;
}

const MissingDaysDisplay: React.FC<MissingDaysDisplayProps> = ({
  missingDays,
  onGenerateMissingDays
}) => {
  if (missingDays.length === 0) return null;

  const getMissingDaysExplanation = () => {
    if (missingDays.length > 20) {
      return "These days are missing because the trip duration exceeds the available route data. Route 66 planning typically works best for trips under 21 days.";
    } else if (missingDays.length > 10) {
      return "These days are missing due to insufficient intermediate destination cities along the selected route segment. Try adjusting your trip duration or endpoints.";
    } else if (missingDays.length > 5) {
      return "Some days are missing because there aren't enough major stops between your start and end cities for this trip length. Consider a shorter trip or different endpoints.";
    } else {
      return "A few days are missing due to gaps in the route planning data. This can happen when destinations are very close together or far apart.";
    }
  };

  const handleGenerateDays = () => {
    if (onGenerateMissingDays) {
      onGenerateMissingDays(missingDays);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1 text-red-600">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">Missing days: {missingDays.join(', ')}</span>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-1 p-0.5 rounded hover:bg-red-50 transition-colors">
              <Info className="h-3 w-3 text-red-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{getMissingDaysExplanation()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {onGenerateMissingDays && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateDays}
              className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Fill Missing
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Auto-generate itinerary for missing days</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default MissingDaysDisplay;
