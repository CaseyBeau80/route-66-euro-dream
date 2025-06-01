
import React from 'react';

interface ClearSelectionOverlayProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
}

const ClearSelectionOverlay: React.FC<ClearSelectionOverlayProps> = ({
  selectedState,
  onClearSelection,
  isDragging
}) => {
  if (!selectedState || isDragging) return null;

  return (
    <div className="absolute top-4 left-4 z-20">
      <button
        onClick={onClearSelection}
        className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 border border-gray-200"
      >
        ← Back to Full Route
      </button>
    </div>
  );
};

export default ClearSelectionOverlay;
