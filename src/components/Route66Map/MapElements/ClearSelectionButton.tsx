
import React from "react";
import { route66States } from "../mapData";

interface ClearSelectionButtonProps {
  selectedState: string | null;
  onClearSelection: () => void;
}

const ClearSelectionButton = ({ selectedState, onClearSelection }: ClearSelectionButtonProps) => {
  if (!selectedState) return null;
  
  const stateName = route66States.find(s => s.id === selectedState)?.name || '';
  
  return (
    <button 
      className="absolute top-2 left-24 bg-white px-3 py-1 rounded-full text-xs shadow-md z-10 flex items-center gap-1 hover:bg-gray-100 transition-colors"
      onClick={onClearSelection}
    >
      <span>Clear {stateName}</span>
    </button>
  );
};

export default ClearSelectionButton;
