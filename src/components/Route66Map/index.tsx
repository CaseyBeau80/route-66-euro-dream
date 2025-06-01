
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
  // For now, always use the React SVG map to prevent zoom control conflicts
  const useReactMap = true;
  
  console.log('🗺️ Route66Map: Rendering with React SVG map to prevent zoom conflicts', {
    selectedState,
    useReactMap
  });

  if (useReactMap) {
    return (
      <MapRendererReact
        selectedState={selectedState}
        onStateClick={onStateClick}
        onClearSelection={onClearSelection}
      />
    );
  }

  // Fallback to Google Maps (currently disabled to prevent conflicts)
  return (
    <MapDisplay
      selectedState={selectedState}
      onStateClick={onStateClick}
      onClearSelection={onClearSelection}
    />
  );
};

export default Route66Map;
