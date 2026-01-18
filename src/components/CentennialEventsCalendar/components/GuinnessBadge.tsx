import React from 'react';
import { Trophy } from 'lucide-react';

interface GuinnessBadgeProps {
  note?: string;
  size?: 'sm' | 'md' | 'lg';
  showNote?: boolean;
}

const GuinnessBadge: React.FC<GuinnessBadgeProps> = ({ 
  note = 'Official Guinness World Records™ Attempt',
  size = 'md',
  showNote = false
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  return (
    <div className="flex flex-col gap-1">
      <div 
        className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-amber-900 font-bold rounded-full shadow-md ${sizeClasses[size]}`}
        title={note}
      >
        <Trophy className={iconSizes[size]} />
        <span>Guinness World Records™</span>
      </div>
      {showNote && note && (
        <p className="text-xs text-amber-700 italic pl-1">
          {note}
        </p>
      )}
    </div>
  );
};

export default GuinnessBadge;
