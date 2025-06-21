
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface TripAdjustmentNoticeProps {
  originalDays?: number;
  actualDays: number;
  adjustmentMessage?: string;
  className?: string;
  // Support for notice object prop for backward compatibility
  notice?: {
    originalDays?: number;
    actualDays: number;
    adjustmentMessage?: string;
  };
}

const TripAdjustmentNotice: React.FC<TripAdjustmentNoticeProps> = ({
  originalDays,
  actualDays,
  adjustmentMessage,
  className = '',
  notice
}) => {
  // Use notice object if provided, otherwise use direct props
  const finalOriginalDays = notice?.originalDays || originalDays;
  const finalActualDays = notice?.actualDays || actualDays;
  const finalAdjustmentMessage = notice?.adjustmentMessage || adjustmentMessage;

  // Only show if there was an adjustment
  if (!finalOriginalDays || finalOriginalDays === finalActualDays) {
    return null;
  }

  const wasReduced = finalActualDays < finalOriginalDays;
  const difference = Math.abs(finalOriginalDays - finalActualDays);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-800 mb-2">
            Trip Optimized: {finalActualDays} Days
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Requested:</strong> {finalOriginalDays} days → <strong>Optimized:</strong> {finalActualDays} days
              {wasReduced && (
                <span className="ml-2 text-blue-600">
                  ({difference} day{difference > 1 ? 's' : ''} reduced)
                </span>
              )}
            </p>
            {finalAdjustmentMessage && (
              <p className="bg-blue-100 rounded p-2 border-l-2 border-blue-300">
                {finalAdjustmentMessage}
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
