
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
  return (
    <g stroke="#ffffff" strokeWidth="1.2" transform="scale(1.0)"> {/* Increased stroke width for better definition */}
      {allUSStates.map(state => {
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
