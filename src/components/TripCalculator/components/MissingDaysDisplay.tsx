
import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
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
