
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface TripAdjustmentNoticeProps {
  originalDays?: number;
  actualDays: number;
  adjustmentMessage?: string;
  className?: string;
}

const TripAdjustmentNotice: React.FC<TripAdjustmentNoticeProps> = ({
  originalDays,
  actualDays,
  adjustmentMessage,
  className = ''
}) => {
  // Only show if there was an adjustment
  if (!originalDays || originalDays === actualDays) {
    return null;
  }

  const wasReduced = actualDays < originalDays;
  const difference = Math.abs(originalDays - actualDays);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-800 mb-2">
            Trip Optimized: {actualDays} Days
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Requested:</strong> {originalDays} days → <strong>Optimized:</strong> {actualDays} days
              {wasReduced && (
                <span className="ml-2 text-blue-600">
                  ({difference} day{difference > 1 ? 's' : ''} reduced)
                </span>
              )}
            </p>
            {adjustmentMessage && (
              <p className="bg-blue-100 rounded p-2 border-l-2 border-blue-300">
                {adjustmentMessage}
              </p>
            )}
            <p className="text-xs text-blue-600 italic">
              This ensures each day has meaningful progress and avoids duplicate destinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripAdjustmentNotice;
