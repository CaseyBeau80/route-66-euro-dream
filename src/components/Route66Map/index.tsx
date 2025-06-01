
import React, { useState } from 'react';
import MapRendererReact from './MapRendererReact';
import GoogleMapsRoute66 from './GoogleMapsRoute66';
import MapDisplay from './MapDisplay';

interface Route66MapProps {
  selectedState?: string | null;
  onStateClick?: (stateId: string, stateName: string) => void;
  onClearSelection?: () => void;
}

const Route66Map: React.FC<Route66MapProps> = ({ 
  selectedState = null,
  onStateClick = () => {},
  onClearSelection = () => {}
}) => {
  // Always use the React SVG map to prevent zoom control conflicts
  const useReactMap = true;
  
  console.log('🗺️ Route66Map: Rendering with React SVG map', {
    selectedState,
    useReactMap,
    hasStateClick: !!onStateClick,
    hasClearSelection: !!onClearSelection
  });

  // Use React SVG Map
  return (
    <div className="w-full h-[600px]">
      <MapRendererReact
        selectedState={selectedState}
        onStateClick={onStateClick}
        onClearSelection={onClearSelection}
      />
    </div>
  );
};

export default Route66Map;
