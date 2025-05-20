
import React from "react";
import DomMapStates from "./components/DomMapStates";
import ReactMapStates from "./components/ReactMapStates";

interface MapStatesProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

/**
 * MapStates - Main component that provides both DOM and React implementations
 */
const MapStates = ({ selectedState, onStateClick }: MapStatesProps) => {
  // DOM implementation for MapRenderer.tsx
  const { createStatesPaths } = DomMapStates({ selectedState, onStateClick });

  return { createStatesPaths };
};

// Export the React component version
export const MapStatesComponent = ({ selectedState, onStateClick }: MapStatesProps) => {
  return <ReactMapStates selectedState={selectedState} onStateClick={onStateClick} />;
};

export default MapStates;
