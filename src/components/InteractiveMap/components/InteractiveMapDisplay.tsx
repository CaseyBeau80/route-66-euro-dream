
import React from 'react';
import Route66Map from '../../Route66Map';

interface InteractiveMapDisplayProps {
  isMapExpanded: boolean;
  onToggleExpanded: () => void;
}

const InteractiveMapDisplay: React.FC<InteractiveMapDisplayProps> = ({
  isMapExpanded,
  onToggleExpanded
}) => {
  return (
    <div className="relative">
      <div 
        className={`
          transition-all duration-700 ease-in-out overflow-hidden rounded-2xl
          ${isMapExpanded ? 'h-[900px] opacity-100' : 'h-[750px] opacity-100'}
        `}
      >
        <div className="relative h-full bg-white rounded-2xl border-2 border-route66-border shadow-2xl overflow-hidden">
          <Route66Map />
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapDisplay;
