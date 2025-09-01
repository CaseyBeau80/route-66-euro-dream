
import React from "react";
import { route66States, allUSStates } from "../mapData";
import StatePath from "./StatePath";

interface ReactMapStatesProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

/**
 * React-based implementation of MapStates for rendering US states
 */
const ReactMapStates = ({ selectedState, onStateClick }: ReactMapStatesProps) => {
  // Only render Route 66 states for optimal DOM performance (reduced from all neighboring states)
  const relevantStates = allUSStates.filter(state => {
    const isRoute66State = route66States.some(r66 => r66.id === state.id);
    // Include only Route 66 states and 3 key neighboring states for minimal context
    const criticalNeighbors = ['nv', 'co', 'ks'];
    return isRoute66State || criticalNeighbors.includes(state.id);
  });

  return (
    <g stroke="#ffffff" strokeWidth="1.3">
      {relevantStates.map(state => {
        // Determine if this is a Route 66 state
        const isRoute66State = route66States.some(r66 => r66.id === state.id);
        
        return (
          <StatePath
            key={state.id}
            state={state}
            isRoute66State={isRoute66State}
            isSelected={selectedState === state.id}
            onClick={isRoute66State ? () => onStateClick(state.id, state.name) : undefined}
          />
        );
      })}
    </g>
  );
};

export default ReactMapStates;
