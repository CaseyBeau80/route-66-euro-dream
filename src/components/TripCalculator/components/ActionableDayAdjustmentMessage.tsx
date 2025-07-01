
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ActionableDayAdjustmentMessageProps {
  currentDays: number;
  requiredDays: number;
  className?: string;
}

const ActionableDayAdjustmentMessage: React.FC<ActionableDayAdjustmentMessageProps> = ({
  currentDays,
  requiredDays,
  className = ""
}) => {
  const daysToAdd = requiredDays - currentDays;
  
  if (daysToAdd <= 0) {
    return null;
  }

  const dayWord = daysToAdd === 1 ? 'day' : 'days';
  const message = `Add ${daysToAdd} more ${dayWord} to meet minimum trip requirements`;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ActionableDayAdjustmentMessage;
