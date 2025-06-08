
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MissingDaysDisplayProps {
  missingDays: number[];
  onGenerateMissingDays?: (days: number[]) => void;
  totalDays: number;
  startCity?: string;
  endCity?: string;
}

const MissingDaysDisplay: React.FC<MissingDaysDisplayProps> = ({
  missingDays,
  onGenerateMissingDays,
  totalDays,
  startCity,
  endCity
}) => {
  if (missingDays.length === 0) {
    return (
      <div className="text-sm text-route66-text-secondary">
        Complete {totalDays}-day itinerary from {startCity} to {endCity}
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-amber-800 font-medium">
            Missing Days: {missingDays.join(', ')}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Some days in your itinerary are incomplete or missing segments.
          </p>
          {onGenerateMissingDays && (
            <button
              onClick={() => onGenerateMissingDays(missingDays)}
              className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
            >
              Generate Missing Days
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingDaysDisplay;
