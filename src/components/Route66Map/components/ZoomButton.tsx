
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ZoomButtonProps {
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  disabled: boolean;
  isZooming: boolean;
  Icon: LucideIcon;
  title: string;
}

const ZoomButton: React.FC<ZoomButtonProps> = ({
  onClick,
  disabled,
  isZooming,
  Icon,
  title
}) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        // Prevent double-click zoom
        e.preventDefault();
        e.stopPropagation();
      }}
      disabled={disabled}
      className={`w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
        isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
      }`}
      type="button"
      title={title}
      style={{ 
        pointerEvents: 'auto',
        touchAction: 'manipulation' // Prevent iOS zoom gestures
      }}
    >
      <Icon className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
    </button>
  );
};

export default ZoomButton;
